import { type Media, type Prisma } from "@prisma/client";
import { type PopularTvShowResult, type Movie } from "tmdb-ts";

const BASE_IMAGE_PREFIX = "https://image.tmdb.org/t/p/w342";

/**
 * This converts the results of a movie[] of the TMDB API.
 * @param result
 * @returns Media object
 */
export function apiShowResultsToModel(
  result: PopularTvShowResult
): Prisma.TrendingCreateInput {
  //   }
  const { backdrop_path, overview, poster_path, name, first_air_date, id } =
    result;

  return {
    title: name,
    type: "show",
    backdrop: backdrop_path,
    overview: overview,
    firstReleased: new Date(first_air_date),
    tmdbId: String(id),
    poster: poster_path,
  };
}

/**
 * This converts the results of a show of the TMDB API to a
 * model-ready object.
 * @param result
 * @returns Media object
 */
export function apiMovieResultsToModel(
  result: TMDBShow
): Prisma.MediaCreateInput {
  // {
  //     "backdrop_path": "/6LWy0jvMpmjoS9fojNgHIKoWL05.jpg",
  //     "last_air_date": "2019-05-19",
  //     "name": "Game of Thrones",
  //     "number_of_episodes": 73,
  //     "number_of_seasons": 8,
  //     "overview": "Seven noble families fight for control of the mythical land of Westeros. Friction between the houses leads to full-scale war. All while a very ancient evil awakens in the farthest north. Amidst the war, a neglected military order of misfits, the Night's Watch, is all that stands between the realms of men and icy horrors beyond.",
  //     "poster_path": "/1XS1oqL89opfnbLl8WnZY1O1uJx.jpg",
  //     "tagline": "Winter Is Coming",
  //   }
  const {
    backdrop_path,
    overview,
    poster_path,
    last_air_date,
    first_air_date,
    number_of_episodes,
    number_of_seasons,
    tagline,
    name,
    id,
  } = result;

  return {
    name: name,
    type: "show",
    backdrop: backdrop_path,
    overview: overview,
    first_released: first_air_date,
    last_released: last_air_date,
    number_of_episodes,
    number_of_seasons,
    tagline,
    tmdbId: String(id),
    poster: poster_path,
  };
}

/**
 * Takes in the TMDB Client's movie result and returns
 * an object conforming to the Now Playing model.
 * @param result
 * @returns A media object ready for prisma model creation.
 */
export function apiMovieResultsToNowPlayingModel(result: Partial<Movie>) {
  const { backdrop_path, overview, poster_path, release_date, title, id } =
    result;

  return {
    title: title ? title : "title",
    type: "film",
    backdrop: BASE_IMAGE_PREFIX + backdrop_path ?? null,
    overview: overview ?? null,
    firstReleased: release_date ? new Date(release_date) : null,
    poster: poster_path ?? null,
    tmdbId: String(id),
  };
}

/**
 * Returns a ordered Media array based on a list of tmdbIds.
 * @param array Array of media objects.
 * @param idList Array of string tmdb ids.
 * @returns An array of media objects ordered by the idlist.
 */
export function sortByIDs(array: Media[], idList: string[]): Media[] {
  // Early return if no order.
  if (!idList) return array;

  const arr: Media[] = [];

  // Iterate through list and find id in media.
  idList.forEach((id) => {
    const i = array.find((item) => item?.tmdbId == id);
    if (i) arr.push(i);
  });

  // Return ordered media.
  return arr;
}
