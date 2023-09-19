/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { debounce } from "lodash";
import React, { useRef, useState, useEffect } from "react";
import Select, {
  type ControlProps,
  type InputActionMeta,
  type OptionProps,
  components,
} from "react-select";
import { Poster } from "../Poster/Poster";
import { api } from "~/utils/api";
import { type MultiSearchResult } from "tmdb-ts";
import Link from "next/link";

const TMDB_POSTER = "https://image.tmdb.org/t/p/w92";

interface SearchProps {
  options?: {
    label: string;
    value: string;
    poster: string;
    year: string;
  }[];
  /**
   * Optional click handler
   */
  onClick?: () => void;
}

/**
 * Search component used in <Header/>
 */
export const Search = ({ options }: SearchProps) => {
  const [searchText, setSearchText] = useState<string>("");

  const res = api.example.search.useQuery(
    { q: searchText },
    { enabled: !!searchText }
  );

  const Control = ({
    children,
    ...props
  }: ControlProps<{
    poster: string;
    year: string;
    id: string;
    type: string;
  }>) => (
    <components.Control className="pl-2" {...props}>
      <MagnifyingGlassIcon className="h-5 w-5 fill-gray-600" /> {children}
    </components.Control>
  );

  type ExtendedOptionProps = OptionProps<{
    poster: string;
    year: string;
    id: string;
    type: string;
  }>;

  const Option = (props: ExtendedOptionProps) => (
    <Link
      href={`/${props?.data?.type === "tv" ? "show" : "film"}/${
        props?.data?.id
      }`}
    >
      <div
        {...props?.innerProps}
        className="h-13 flex flex-row gap-2 px-4 py-1 hover:bg-gray-100"
      >
        <div className="h">
          <Poster
            size="tiny"
            url={
                props?.data?.poster
            }
            progress={0}
          />
        </div>
        <div className="flex flex-col justify-center text-black">
          <div>
            {" "}
            {props?.label} {`(${props?.data?.year})`}
          </div>
          {/* <div className="text-xs">{props?.data?.creators}</div> */}
        </div>
      </div>
    </Link>
  );

  const handleSearchDebounced = useRef(
    debounce((searchText: string) => setSearchText(searchText), 1000)
  ).current;

  const handleInputChange = (inputText: string, meta: InputActionMeta) => {
    if (
      meta.action !== "input-blur" &&
      meta.action !== "menu-close" &&
      !options
    ) {
      handleSearchDebounced(inputText);
    }
  };

  type Option = {
    poster: string;
    year: string;
    label: string;
    value: number;
    id: string;
    type: string;
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

  return (
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
      onInputChange={handleInputChange}
      id="long-value-select"
      instanceId="long-value-select"
      components={{
        DropdownIndicator: null,
        Control,
        Option,
      }}
      isLoading={res.isFetching}
      placeholder={"Search for shows and movies."}
    />
  );
};
