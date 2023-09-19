import { type User } from "@prisma/client";
import { TRPCError } from "@trpc/server";
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

export const userRouter = createTRPCRouter({
  /**
   * Get's all information related to the profile page.
   */
  getProfile: publicProcedure
    .input(
      z.object({
        username: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx?.prisma?.user.findUnique({
        where: {
          name: input.username,
        },
        include: {
          Lists: {
            where: {
              type: "favorite",
            },
            include: {
              media: true,
            },
          },
          Watch: {
            take: 5,
            include: {
              media: true,
            },
          },
        },
      });
      return user;
    }),

  update: protectedProcedure
    .input(
      z.object({
        username: z.string(),
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.username === ctx.session.user.name) {
        const user = await ctx.prisma.user.update({
          where: {
            id: ctx.session.user.id,
          },
          data: {
            name: input.name,
          },
        });
        return user;
      } else {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to update this user.",
        });
      }
    }),
});
