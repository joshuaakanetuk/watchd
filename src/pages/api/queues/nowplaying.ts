// import { CronJob } from "quirrel/next-pages";
import { env } from "~/env.mjs";
import { TMDB } from "tmdb-ts";
import { prisma } from "../../../server/db";
import { CronJob } from 'quirrel/next-pages'
import { apiMovieResultsToNowPlayingModel } from "~/utils/utils";

// Initialize TMDB API Client
const tmdb = new TMDB(env.TMDB_API_KEY);
const BASE_IMAGE_PREFIX = "https://image.tmdb.org/t/p/w342";

/**
 * Retrieves the latest movies showing in theatres
 * via TMDB API.
 */
export default CronJob("api/queues/nowplaying", "0 0 1 * *", async () => {
  try {
    const movies = await tmdb.movies.nowPlaying();
    if (movies.results) {
      await prisma.nowPlaying.deleteMany({});
      for (const movie of movies.results) {
        const nowM = apiMovieResultsToNowPlayingModel(movie);
        await prisma?.nowPlaying.create({
          data: {
            ...nowM,
            poster: BASE_IMAGE_PREFIX + nowM?.poster ?? ''
          },
        });
      }
    }
  } catch (err) {
    // handle error
  }
});
