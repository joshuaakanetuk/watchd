import { type Media } from "@prisma/client";
import { TMDB } from "tmdb-ts";
import { z } from "zod";
import { env } from "~/env.mjs";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";

// Initialize TMDB API Client
const tmdb = new TMDB(env.TMDB_API_KEY);

export const mediaRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ id: z.string(), type: z.enum(["tv", "film"]).optional() }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.prisma.media.findFirst({
        where: {
          tmdbId: input.id,
        },
      });

      if (!result) {
        if (input?.type === "film") {
          const movie = await tmdb.movies.details(Number(input?.id), [
            "credits",
          ]);
          const newMovie = await ctx.prisma.media.create({
            data: {
              id: undefined,
              tmdbId: String(movie.id),
              first_released: new Date(movie.release_date),
              type: "film",
              name: movie.title,
              tagline: movie.tagline,
              backdrop: movie?.backdrop_path,
              poster: movie?.poster_path,
              overview: movie?.overview,
              runtime: movie?.runtime,
              cast: JSON.stringify(movie?.credits?.cast),
              crew: JSON.stringify(movie?.credits?.crew),
              creator: movie?.credits?.crew
                ?.filter((member) => member.job === "Director")
                .map((item) => item.name)
                .join(", "),
            },
          });
          return newMovie;
        } else {
          const show = await tmdb.tvShows.details(Number(input?.id), [
            "credits",
          ]);
          const newShow = await prisma.media.create({
            data: {
              id: undefined,
              tmdbId: String(show.id),
              backdrop: show?.backdrop_path,
              first_released: new Date(show.first_air_date),
              last_released: new Date(show.last_air_date),
              type: "show",
              name: show.name,
              tagline: show?.tagline,
              poster: show?.poster_path,
              overview: show?.overview,
              cast: JSON.stringify(show?.credits?.cast),
              crew: JSON.stringify(show?.credits?.crew),
              creator: show?.credits?.crew
                ?.filter((member) => member.job === "Director")
                .join(", "),
            },
          });
          return newShow;
        }
      } else {
        return result;
      }
    }),
});
