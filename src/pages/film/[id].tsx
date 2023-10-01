import { type Media } from "@prisma/client";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { type Cast, type Crew } from "tmdb-ts";
import { MediaDetail } from "~/components/MediaDetail/MediaDetail";
import { MediaHero } from "~/components/MediaHero/MediaHero";
import { Poster } from "~/components/Poster/Poster";
import { Review } from "~/components/Review/Review";
import { SectionHeader } from "~/components/SectionHeader/SectionHeader";
import { api } from "~/utils/api";

const image = "https://image.tmdb.org/t/p/w1280";


const FilmComponent = ({ film }: { film: Media }) => {
  let cast, crew;
  const detailStyleString = film?.backdrop ? 'flex flex-row gap-4 mt-[-12rem] mx-auto max-w-5xl' : "flex flex-row gap-4 py-4 mx-auto max-w-5xl"
  if (film?.cast) {
    cast = JSON.parse(film?.cast) as Cast[];
  }
  if (film?.crew) {
    crew = JSON.parse(film?.crew) as Crew[];
  }
  return (
    <div className="bg-[#14181c] px-4">
      {film?.backdrop && <MediaHero url={image + film?.backdrop}></MediaHero>}
      <div className={detailStyleString}>
        <div className="flex flex-col text-white">
          <Poster size="default" url={image + film.poster} progress={0} />
        </div>
        <MediaDetail
          title={film.name}
          year={new Date(film?.first_released).getFullYear()}
          cast={cast}
          crew={crew}
          creators={film?.creator ?? ""}
          description={film?.overview ?? ""}
          type={"movie"}
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

const Film: NextPage = () => {
  const router = useRouter();
  const { id } = router?.query as { id: string };

  const {
    data: film,
    isLoading,
    isError,
  } = api.example.media.useQuery({
    type: "film",
    id,
  });

  if (isLoading) {
    return <div></div>;
  }

  if (isError) {
    return <div>Something broke.</div>;
  }

  return <FilmComponent film={film} />;
};

export default Film;
