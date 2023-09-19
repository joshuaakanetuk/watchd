/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useRef, useState } from "react";
import { type NextPage } from "next";
import { WrappedInput as Input } from "~/components/Input/Input";
import { type Media, type List, type User } from "@prisma/client";
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
import { sortByIDs } from "~/utils/utils";

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

const mediaToOption = (media: Media[], order?: string[]): Option[] => {
  if(order) media = sortByIDs(media, order)
  console.log(media)
  return media.map((item) => ({
    id: item.tmdbId,
    type: item.type,
    value: Number(item.tmdbId),
    poster: item.poster ?? "",
    year: String(new Date(item.first_released).getFullYear()),
    label: item.name,
  }));
};

/**
 * Page for logged in user to create a new list.
 */
const EditListComponent = ({
  list,
}: {
  list: List & { media: Media[]; user: User };
}) => {
  const utils = api.useContext();
  const mutation = api.list.update.useMutation();
  const [items, setItems] = useState<Option[]>(mediaToOption(list.media, list.order));
  const [searchText, setSearchText] = useState<string>("");
  
  const methods = useForm<FormData>({
    defaultValues: {
      Name: list?.title,
      Description: list.description ?? "",
    },
  });
  const router = useRouter();

  api.media.get.useQuery(
    {
      id: String(items[items.length - 1]?.value),
      type: items[items.length - 1]?.type == "tv" ? "tv" : "film",
    },
    { enabled: !!items }
  );

  const onSubmit: SubmitHandler<FormData> = (data) => {
    const mediaIds: string[] = items.map((item) => item.id);
    console.log(mediaIds);
    const { Name, Description } = data;
    try {
      mutation.mutate(
        {
          id: list.id,
          title: Name,
          description: Description,
          mediaIds,
          order: mediaIds,
        },
        {
          onSuccess: (newList) => {
            void utils.list.getById.setData({ id: newList.id }, newList);
            void router.push("/lists/" + newList.id);
          },
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
      <div className="h"></div>
      <div className="flex flex-col justify-center text-black">
        <div>
          {" "}
          {props?.label} {`(${props?.data?.year})`}
        </div>
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

  function handleOnClick(newValue: SingleValue<Option>): void {
    if (newValue) {
      setItems((prevState) => {
        return [...prevState, newValue];
      });
    }
  }

  const removeElementByIndex = (index: number) => {
    const newArray = [...items];
    newArray.splice(index, 1);
    setItems(newArray);
  };

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
                        className="flex flex-col justify-center justify-self-end	"
                        onClick={() => removeElementByIndex(index)}
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

const EditList: NextPage = () => {
  const router = useRouter();
  const { id } = router?.query as { id: string };

  const { data: list, isLoading, isError } = api.list.getById.useQuery({
    id,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !list) {
    return <div>Something broke.</div>;
  }

  return <EditListComponent list={list} />;
};

export default EditList;
