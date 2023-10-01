/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { format } from "date-fns";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { EmptyState } from "~/components/EmptyState/EmptyState";
import { List } from "~/components/List/List";
import { SectionHeader } from "~/components/SectionHeader/SectionHeader";
import { api } from "~/utils/api";
import { sortByIDs } from "~/utils/utils";

const Lists: NextPage = () => {
  const router = useRouter();
  const { data: sessionData } = useSession();

  const { data: userLists } = api.list.getAll.useQuery(undefined, {
    enabled: sessionData?.user !== undefined,
  });

  const { data: nonUserLists } = api.list.getAllNotUser.useQuery(undefined, {
    enabled: sessionData?.user !== undefined,
  });

  return (
    <div className="min-h-screen bg-[#14181c] text-white">
      <div className="m-auto flex max-w-3xl flex-col gap-5 p-4 ">
        {sessionData?.user && (
          <button
            className="rounded bg-indigo-500 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            onClick={() => void router.push("/lists/new")}
          >
            Create List
          </button>
        )}
        {sessionData?.user && (
          <div className="flex flex-col gap-5">
            <SectionHeader label="YOUR LISTS" />
            <div className="grid w-full grid-cols-3 gap-7">
              {userLists
                ?.filter((item) => item?.media.length !== 0)
                .map((list) => (
                  <div key={list.id} className="flex flex-col gap-1">
                    <List id={list.id} items={sortByIDs(list.media, list.order)} />
                    <span className="font-bold">{list.title}</span>
                    <span className="text-xs text-gray-500">
                      Created: {format(list.dateCreated, "PP")}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
        <div className="flex flex-col gap-5">
          <SectionHeader label="POPULAR LISTS" />
          {nonUserLists && nonUserLists?.length > 0 ? (
            <div className="grid w-full grid-cols-3 gap-7">
              {nonUserLists
                ?.filter((item) => item?.media.length !== 0)
                .map((list) => (
                  <div key={list.id} className="flex flex-col gap-1">
                    <List id={list.id} items={sortByIDs(list.media, list.order)} />
                    <span className="font-bold">{list.title}</span>
                    <span className="text-xs text-gray-500">
                      Created: {format(list.dateCreated, "PP")}
                    </span>
                  </div>
                ))}
            </div>
          ) : (
            <div className="mx-auto">
              <EmptyState />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Lists;
