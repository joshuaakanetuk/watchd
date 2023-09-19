import { type Media } from "@prisma/client";
import { TMDB } from "tmdb-ts";
import { z } from "zod";
import { env } from "~/env.mjs";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const listRouter = createTRPCRouter({
  getAll: protectedProcedure
  .query(async ({ ctx }) => {
    const lists = await ctx?.prisma?.list.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        media: true,
      },
    });
    return lists;
  }),

  /**
   * Get all of the lists that the logged in user
   * isn't the owner of. 
   */
  getAllNotUser: protectedProcedure
  .query(async ({ ctx }) => {
    const lists = await ctx?.prisma?.list.findMany({
      where: {
        userId: {
          not: ctx.session.user.id
        }
      },
      include: {
        media: true,
      },
    });
    return lists;
  }),

  /**
   * Get specific list via id.
   */
  getById: publicProcedure
  .input(z.object({
    id: z.string()
  }))
  .query(async ({ ctx, input }) => {
    const list = await ctx?.prisma?.list.findFirst({
      where: {
        id: input.id
      },
      include: {
        media: true,
        user: true
      },
    });
    return list;
  }),

  create: protectedProcedure
    .input(
      z.object({
        type: z.enum(["watch", "like", "default", "favorite"]),
        title: z.string({ required_error: "A title for list is required." }),
        description: z.string(),
        mediaIds: z.array(z.string()).optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      const list = ctx?.prisma?.list.create({
        data: {
          userId: ctx?.session?.user?.id,
          dateCreated: new Date(),
          type: input?.type,
          title: input?.title,
          order: input?.mediaIds,
          description: input?.description,
          media: {
            connect: input?.mediaIds?.map((item) => ({ tmdbId: item })),
          },
        },
      });
      return list;
    }),

  update: protectedProcedure
    .input(
      z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        mediaIds: z.array(z.string()).optional(),
        order: z.array(z.string()).optional(),
        id: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      const list = ctx?.prisma?.list.update({
        where: {
          id: input?.id,
          userId: ctx?.session?.user?.id,
        },
        data: {
          userId: ctx?.session?.user?.id,
          title: input?.title,
          description: input?.description,
          order: input?.order,
          media: {
            connect: input?.mediaIds?.map((item) => ({ tmdbId: item })),
          },
        },
        include:{
          user: true,
          media: true,
        }
      });
      return list;
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
