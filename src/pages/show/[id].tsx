import { type Media } from "@prisma/client";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { MediaDetail } from "~/components/MediaDetail/MediaDetail";
import { MediaHero } from "~/components/MediaHero/MediaHero";
import { Poster } from "~/components/Poster/Poster";
import { Review } from "~/components/Review/Review";
import { SectionHeader } from "~/components/SectionHeader/SectionHeader";
import { api } from "~/utils/api";
import { type Cast, type Crew } from "tmdb-ts";

const ShowComponent = ({ show }: { show: Media }) => {
  let cast, crew;
  const detailStyleString = show?.backdrop ? 'flex flex-row gap-4 mt-[-12rem] mx-auto max-w-5xl' : "flex flex-row gap-4 py-4 mx-auto max-w-5xl"
  if (show?.cast) {
    cast = JSON.parse(show?.cast) as Cast[];
  }
  if (show?.crew) {
    crew = JSON.parse(show?.crew) as Crew[];
  }
  return (
    <div className="bg-[#14181c] px-4">
      {show?.backdrop && <MediaHero url={show?.backdrop} />}
      <div className={detailStyleString}>
      <div className="flex flex-col text-white">
            <Poster size="default" url={show?.poster ?? ""} progress={0} />
          </div>
          <MediaDetail
            title={show.name}
            year={new Date(show?.first_released).getFullYear()}
            cast={cast}
            crew={crew}
            creators={show?.creator ?? ""}
            description={show?.overview ?? ""}
            type={"show"}
          />
      </div>
      <div className="mx-auto max-w-3xl mt-5">
        <SectionHeader label="TOP REVIEWS" />
        <Review />
        <Review />
        <Review />
      </div>

      </div>
      

  );
};

const Show: NextPage = () => {
  const router = useRouter();
  const { id } = router?.query as { id: string };

  const {
    data: show,
    isLoading,
    isError,
  } = api.example.media.useQuery(
    {
      type: "tv",
      id,
    },
    { enabled: !!id }
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Something broke.</div>;
  }

  return <ShowComponent show={show} />;
};

export default Show;
