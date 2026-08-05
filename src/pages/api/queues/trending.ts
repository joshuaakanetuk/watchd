import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "~/env.mjs";
import { TMDB } from "tmdb-ts";
import { prisma } from "../../../server/db";
import { apiShowResultsToModel } from "~/utils/utils";

// Initialize TMDB API Client
const tmdb = new TMDB(env.TMDB_API_KEY);
const BASE_IMAGE_PREFIX = "https://image.tmdb.org/t/p/w342";

/**
 * Cron job endpoint: Retrieves popular/trending TV shows via TMDB API
 * and updates the Trending table with the top 5 shows.
 *
 * Authentication: Requires CRON_SECRET in Authorization header
 * Usage: POST /api/queues/trending
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
    console.error("[Trending] Unauthorized request attempt");
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    console.log("[Trending] Starting job execution");

    // Fetch popular TV shows from TMDB
    const shows = await tmdb.tvShows.popular();

    if (shows.results) {
      // Clear existing data
      await prisma.trending.deleteMany({});
      console.log("[Trending] Cleared existing data");

      // Take top 5 shows and insert
      const arr = shows.results.slice(0, 5);
      for (const show of arr) {
        const trending = apiShowResultsToModel(show);
        await prisma.trending.create({
          data: {
            ...trending,
            poster: BASE_IMAGE_PREFIX + (trending?.poster ?? ""),
          },
        });
      }

      console.log(`[Trending] Successfully processed ${arr.length} shows`);

      return res.status(200).json({
        success: true,
        processed: arr.length,
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
    console.error("[Trending] Job execution failed:", error);

    return res.status(500).json({
      success: false,
      error: "Failed to process trending shows",
    });
  }
}
