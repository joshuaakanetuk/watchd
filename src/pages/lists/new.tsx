/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useRef, useState } from "react";
import { type NextPage } from "next";
import { WrappedInput as Input } from "~/components/Input/Input";
import { Reorder } from "framer-motion";

import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { debounce } from "lodash";
import Select, {
  type ControlProps,
  type InputActionMeta,
  type OptionProps,
  components,
  type SingleValue,
} from "react-select";
import { Poster } from "~/components/Poster/Poster";
import { api } from "~/utils/api";
import { type MultiSearchResult } from "tmdb-ts";
import { Button } from "~/components/Button/Button";
import { useForm, type SubmitHandler, FormProvider } from "react-hook-form";
import { useRouter } from "next/router";

const TMDB_POSTER = "https://image.tmdb.org/t/p/w92";

type Option = {
  poster: string;
  year: string;
  label: string;
  value: number;
  id: string;
  type: string;
};
enum BUTTON_SIZES {
  xs = "px-2 py-1 text-xs",
  sm = "px-2 py-1 text-sm",
  md = "px-2.5 py-1.5 text-sm",
}

enum INPUT_VARIANTS {
  text = "text",
  search = "search",
}

type FormData = {
  Name: string;
  Description: string;
  tmdbId: string[];
};

/**
 * Page for logged in user to create a new list.
 */
const NewList: NextPage = () => {
  const mutation = api.list.create.useMutation();
  const [items, setItems] = useState<Option[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const methods = useForm<FormData>();
  const router = useRouter();

  api.media.get.useQuery(
    {
      id: String(items[items.length - 1]?.value),
      type: items[items.length - 1]?.type == "tv" ? "tv" : "film",
    },
    { enabled: !!items }
  );

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log(data);
    const mediaIds: string[] = items.map((item) => item.id);
    const { Name, Description } = data;

    try {
      mutation.mutate(
        { type: "default", title: Name, description: Description, mediaIds },
        {
          onSuccess: ({ id }) => void router.push("/lists/" + id),
        }
      );
    } catch (error) {}
  };

  const res = api.example.search.useQuery(
    { q: searchText },
    { enabled: !!searchText }
  );

  const Control = ({ children, ...props }: ControlProps<Option>) => (
    <components.Control className="pl-2" {...props}>
      <MagnifyingGlassIcon className="h-5 w-5 fill-gray-600" /> {children}
    </components.Control>
  );

  type ExtendedOptionProps = OptionProps<Option>;

  const Option = (props: ExtendedOptionProps) => (
    <div
      {...props?.innerProps}
      className="h-13 flex flex-row gap-2 px-4 py-1 hover:bg-gray-100"
    >
      <div className="h">
        {/* <Poster
          size="tiny"
          url={
             props?.data?.poster
          }
          progress={0}
        /> */}
      </div>
      <div className="flex flex-col justify-center text-black">
        <div>
          {" "}
          {props?.label} {`(${props?.data?.year})`}
        </div>
        {/* <div className="text-xs">{props?.data?.creators}</div> */}
      </div>
    </div>
  );

  const handleSearchDebounced = useRef(
    debounce((searchText: string) => setSearchText(searchText), 1000)
  ).current;

  const handleInputChange = (inputText: string, meta: InputActionMeta) => {
    if (meta.action !== "input-blur" && meta.action !== "menu-close") {
      handleSearchDebounced(inputText);
    }
  };

  const searchResultMap = (item: MultiSearchResult) => {
    if (item?.media_type === "person") return;
    return {
      label: item?.media_type === "tv" ? item?.name : item?.title,
      value: item?.id,
      type: item?.media_type,
      id: String(item?.id),
      poster: item?.poster_path,
      year:
        item?.media_type === "tv"
          ? String(new Date(item?.first_air_date).getFullYear())
          : String(new Date(item?.release_date).getFullYear()),
    };
  };

  const searchResultsToGroups = (items: MultiSearchResult[]) => {
    const movies = {
      label: "Movies",
      options: items
        .filter((item) => item?.media_type === "movie")
        .map(searchResultMap)
        .slice(0, 5) as Option[],
    };
    const shows = {
      label: "Shows",
      options: items
        .filter((item) => item?.media_type === "tv")
        .map(searchResultMap)
        .slice(0, 5) as Option[],
    };
    return [movies, shows];
  };

  function handleRemove(id: string) {
    const arr = items.filter((item) => item.id != id);
    setItems(arr);
  }

  function handleOnClick(newValue: SingleValue<Option>): void {
    if (newValue) {
      setItems((prevState) => {
        return [...prevState, newValue];
      });
    }
  }

  return (
    <div className="min-h-screen  bg-[#14181c] p-4 text-white ">
      <div className="m-auto max-w-3xl">
        <FormProvider {...methods}>
          <form
            onSubmit={(event) => void methods.handleSubmit(onSubmit)(event)}
          >
            {/* List metadata */}
            <div>
              <Input label={"Name"} variant={INPUT_VARIANTS.text} />
              <Input label={"Description"} variant={INPUT_VARIANTS.text} />
            </div>
            {/* Search */}
            <Select
              options={res?.data && searchResultsToGroups(res?.data)}
              styles={{
                input: (baseStyles) => ({
                  ...baseStyles,
                  "> input:focus": {
                    boxShadow: "none",
                    width: "100%",
                  },
                }),
              }}
              onChange={handleOnClick}
              onInputChange={handleInputChange}
              id="long-value-select"
              instanceId="long-value-select"
              isMulti={false}
              components={{
                DropdownIndicator: null,
                Control,
                Option,
              }}
              isLoading={res.isFetching}
              placeholder={"Search for shows and movies."}
            />
            {/* List media */}
            <Reorder.Group axis="y" values={items} onReorder={setItems}>
              {items.map((item, index) => (
                <Reorder.Item key={item.id} value={item}>
                  <div className="  rounded p-1">
                    <input
                      {...methods.register(`tmdbId.${index}`)}
                      className="hidden"
                      value={item?.id}
                    />
                    <div className="flex flex-row justify-between">
                      <div className="flex flex-row gap-3">
                        <div className="w-10">
                          <Poster
                            size="fill"
                            url={TMDB_POSTER + item?.poster}
                            progress={0}
                          />
                        </div>
                        <div>
                          <div>{item.label}</div>
                          <div>{item.year && `(${item.year})`}</div>
                        </div>
                      </div>
                      <div
                        className="flex flex-col justify-center"
                        onClick={() => handleRemove(item.id)}
                      >
                        <XMarkIcon className="h-5 w-5 fill-gray-600" />
                      </div>
                    </div>
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
            <Button
              className={""}
              submit
              label={"Save"}
              size={BUTTON_SIZES.xs}
              variant={"primary"}
            />
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default NewList;
