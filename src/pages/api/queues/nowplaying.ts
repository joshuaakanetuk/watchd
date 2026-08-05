import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "~/env.mjs";
import { TMDB } from "tmdb-ts";
import { prisma } from "../../../server/db";
import { apiMovieResultsToNowPlayingModel } from "~/utils/utils";

// Initialize TMDB API Client
const tmdb = new TMDB(env.TMDB_API_KEY);
const BASE_IMAGE_PREFIX = "https://image.tmdb.org/t/p/w342";

/**
 * Cron job endpoint: Retrieves the latest movies showing in theatres via TMDB API
 * and updates the NowPlaying table.
 *
 * Authentication: Requires CRON_SECRET in Authorization header
 * Usage: POST /api/queues/nowplaying
 * Header: Authorization: Bearer <CRON_SECRET>
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only accept POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Authenticate request
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.substring(7)
    : null;

  if (!token || token !== env.CRON_SECRET) {
    console.error("[NowPlaying] Unauthorized request attempt");
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    console.log("[NowPlaying] Starting job execution");

    // Fetch now playing movies from TMDB
    const movies = await tmdb.movies.nowPlaying();

    if (movies.results) {
      // Clear existing data
      await prisma.nowPlaying.deleteMany({});
      console.log("[NowPlaying] Cleared existing data");

      // Insert new data
      for (const movie of movies.results) {
        const nowM = apiMovieResultsToNowPlayingModel(movie);
        await prisma.nowPlaying.create({
          data: {
            ...nowM,
            poster: BASE_IMAGE_PREFIX + (nowM?.poster ?? ""),
          },
        });
      }

      console.log(`[NowPlaying] Successfully processed ${movies.results.length} movies`);

      return res.status(200).json({
        success: true,
        processed: movies.results.length,
        timestamp: new Date().toISOString(),
      });
    }

    return res.status(200).json({
      success: true,
      processed: 0,
      message: "No results from TMDB",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[NowPlaying] Job execution failed:", error);

    return res.status(500).json({
      success: false,
      error: "Failed to process now playing movies",
    });
  }
}
