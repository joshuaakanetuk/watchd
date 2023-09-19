import { User, type List, type Media, type Watch } from "@prisma/client";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { ProfilePicture } from "~/components/ProfilePicture/ProfilePicture";
import { SectionHeader } from "~/components/SectionHeader/SectionHeader";
import { Shelf } from "~/components/Shelf/Shelf";
import { Watch as WatchComponent } from "~/components/Watch/Watch";
import { api } from "~/utils/api";

interface CombinedList extends List {
  media: Media[];
}

interface CombinedWatch extends Watch {
  media: Media;
}

const UserComponent = ({
  user,
}: {
  user: User & { Lists: CombinedList[]; Watch: CombinedWatch[] };
}) => {
  const favList = user?.Lists[0];

  user.Watch.sort(function compare(a, b) {
    const dateA = new Date(a.dateFinished).valueOf();
    const dateB = new Date(b.dateFinished).valueOf();
    return dateA - dateB;
  });

  return (
    <div className="min-h-screen bg-[#14181c] px-4">
      <div className="m-auto flex max-w-2xl flex-col">
        {/* STUFF */}
        <div className="flex flex-col items-center gap-2 p-4">
          <ProfilePicture size={"profile"} url={user?.image ?? ''} />
          <div>
            <span className="text-center text-2xl text-white">
              @{user?.name}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <SectionHeader label={"FAVORITES"} />
          <Shelf
            items={favList?.media
              .map((item) => ({
                url: item?.poster ?? "",
              }))
              .slice(0, 5)}
          />
          <SectionHeader label={"RECENTLY WATCHED"} />
          {user?.Watch?.map((item: CombinedWatch) => (
            <WatchComponent
              key={item?.id}
              date={new Date(item.dateFinished)}
              title={item?.media?.name}
              image={item?.media?.poster ?? ''}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const User: NextPage = () => {
  const router = useRouter();
  const { name } = router?.query as { name: string };

  const {
    data: user,
    isLoading,
    isError,
  } = api.user.getProfile.useQuery(
    {
      username: name,
    },
    { enabled: !!name }
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !user) {
    return <div>Something broke.</div>;
  }

  return <UserComponent user={user} />;
};

export default User;
