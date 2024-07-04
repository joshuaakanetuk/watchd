// import { CronJob } from "quirrel/next-pages";
import { env } from "~/env.mjs";
import { TMDB } from "tmdb-ts";
import { prisma } from "../../../server/db";
import { CronJob } from 'quirrel/next-pages'
import { apiShowResultsToModel } from "~/utils/utils";

// Initialize TMDB API Client
const tmdb = new TMDB(env.TMDB_API_KEY);
const BASE_IMAGE_PREFIX = "https://image.tmdb.org/t/p/w342";

/**
 * Retrieves the latest movies showing in theatres
 * via TMDB API.
 */
export default CronJob("api/queues/trending", "0 0 1 * *", async () => {
  try {
    const shows = await tmdb.tvShows.popular();
    if (shows.results) {
      await prisma?.trending.deleteMany({});
      const arr = shows.results.slice(0, 5);
      for (const show of arr) {
        const trending = apiShowResultsToModel(show);
        await prisma?.trending.create({
          data: {
            ...trending,
            poster: BASE_IMAGE_PREFIX + trending?.poster ?? ''
          },
        });
      }
    }
  } catch (err) {
    // handle error
  }
});
