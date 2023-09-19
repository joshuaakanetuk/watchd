import { type Media, type List, type User } from "@prisma/client";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { MediaHero } from "~/components/MediaHero/MediaHero";
import { Poster } from "~/components/Poster/Poster";
import { api } from "~/utils/api";
import { sortByIDs } from "~/utils/utils";

const ListDetailComponent = ({
  list,
}: {
  list: List & { media: Media[]; user: User };
}) => {
  const mediaList = sortByIDs(list.media, list.order);
  const { data: sessionData } = useSession();
  const router = useRouter();
  return (
    <div className="bg-[#14181c] px-4 text-white">
      <MediaHero url={mediaList[0]?.backdrop ?? ""} />
      <div className="relative z-10 mx-auto -mt-48 mb-4 flex max-w-2xl flex-col gap-2">
        <div className="text-2xl font-bold text-white">{list?.title} <span className="text-lg text-gray-400">by {list?.user?.name}</span></div>
        <div className="">
          {list?.description}
          
        </div>
        
        {list.userId === sessionData?.user?.id && (
          <button
            className="rounded bg-indigo-500 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            onClick={() => {
              void router.push("/lists/" + list.id + "/edit");
            }}
          >
            Edit List
          </button>
        )}
      </div>
      <div className="m-auto grid max-w-2xl grid-cols-5 gap-4">
        {list &&
          mediaList.map((item) => {
            return (
              <div key={item.id}>
                <Poster
                  size="fill"
                  onClick={() =>
                    void router.push(
                      `/${item?.type === "show" ? "show" : "film"}/${
                        item?.tmdbId
                      }`
                    )
                  }
                  url={item?.poster ?? ""}
                  progress={0}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
};

const ListDetail: NextPage = () => {
  const router = useRouter();
  const { id } = router?.query as { id: string };

  const {
    data: list,
    isLoading,
    isError,
  } = api.list.getById.useQuery(
    {
      id,
    },
    { enabled: !!id }
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !list) {
    return <div>Something broke.</div>;
  }

  return <ListDetailComponent list={list} />;
};

export default ListDetail;
