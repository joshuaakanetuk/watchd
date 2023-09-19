import { type Media } from "@prisma/client";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { MediaDetail } from "~/components/MediaDetail/MediaDetail";
import { MediaHero } from "~/components/MediaHero/MediaHero";
import { Poster } from "~/components/Poster/Poster";
import { SectionHeader } from "~/components/SectionHeader/SectionHeader";
import { api } from "~/utils/api";

const ShowComponent = ({ show }: { show: Media }) => {
  console.log(show);
  let cast, crew;
  if (show?.cast) {
    // cast = show?.cast.split(',')
  }
  if (show?.crew) {
    // crew = JSON.parse(film?.crew) as Crew[];
  }
  return (
    <div className="bg-[#14181c] px-4">
      {show?.backdrop && (
        <MediaHero url={show?.backdrop}>
          <div className="flex flex-col text-white">
            <Poster size="default" url={show?.poster ?? ""} progress={0} />
            Add Watch
          </div>
          <MediaDetail
            title={show.name}
            year={new Date(show?.first_released).getFullYear()}
            cast={cast}
            // crew={crew}
            creators={show?.creator ?? ""}
            description={show?.overview ?? ""}
            type={"show"}
          />
        </MediaHero>
      )}
      <div className="mx-auto max-w-5xl">
        <SectionHeader label="TOP REVIEWS" />
        {/* <Review /> */}
      </div>
    </div>
  );
};

const Show: NextPage = () => {
  const router = useRouter();
  const { id } = router?.query as { id: string };

  const { data: show, isLoading, isError } = api.example.media.useQuery(
    {
      type: "tv",
      id,
    },
    { enabled: !!id }
  );

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Something broke.</div>
  }

  return <ShowComponent show={show} />;
};

export default Show;
