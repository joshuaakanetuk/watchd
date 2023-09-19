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

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  createWatch: protectedProcedure
    .input(
      z.object({
        rating: z.number(),
        review: z.string(),
        tmdbId: z.string(),
        dateCreated: z.date(),
      })
    )
    .mutation(({ ctx, input }) => {
      const watch = ctx?.prisma?.watch.create({
        data: {
          userId: ctx?.session?.user?.id,
          dateFinished: input?.dateCreated,
          type: 'movie',
          mediaId: input?.tmdbId,
        },
      });
      return watch;
    }),

  getAll: publicProcedure.query(() => {
    return;
  }),

  nowPlaying: publicProcedure.query(async ({ ctx }) => {
    const nowPlaying = await ctx?.prisma?.nowPlaying.findMany();
    return nowPlaying;
  }),

  trending: publicProcedure.query(async ({ ctx }) => {
    const trending = await ctx?.prisma?.trending.findMany();
    return trending;
  }),

  search: publicProcedure
    .input(z.object({ q: z.string() }))
    .query(async ({ input }) => {
      const movies = await tmdb.search.multi({ query: input?.q });
      return movies.results;
    }),

  media: publicProcedure
    .input(z.object({ id: z.string(), type: z.enum(["tv", "film"]) }))
    .query(async ({ input }) => {
      // search prisma for media
      // return if exists
      // else 'build' it and return it

      const result = await prisma.media.findFirst({
        where: {
          tmdbId: input.id,
        },
      });

      if (!result) {
        if (input?.type === "film") {
          const movie = await tmdb.movies.details(Number(input?.id), [
            "credits",
          ]);
          const newMovie = await prisma.media.create({
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

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
