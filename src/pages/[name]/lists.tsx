import { type NextPage } from "next";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { SectionHeader } from "~/components/SectionHeader/SectionHeader";
import { List } from "~/components/List/List";
import { format } from "date-fns";
import { useRouter } from "next/router";
import { sortByIDs } from "~/utils/utils";

// TODO: Render empty form no matter what
const UserLists: NextPage = () => {
  const router = useRouter();
  const { data: sessionData } = useSession();
  const { data: userLists } = api.list.getAll.useQuery(undefined, {
    enabled: sessionData?.user !== undefined,
  });

  return (
    <div className="min-h-screen bg-[#14181c] text-white p-4">
      <div className="flex flex-col gap-5 max-w-3xl m-auto">
      <button
            className="rounded bg-indigo-500 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            onClick={() =>
              void router.push('/lists/new')
            }
          >
            Create List
          </button>
        <SectionHeader label="YOUR LISTS" />
        <div className="grid w-full grid-cols-3 gap-7">
          {userLists
            // ?.filter((item) => item?.media.length !== 0)
            ?.map((list) => (
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
    </div>
  );
};

export default UserLists;
