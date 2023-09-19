import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { listRouter } from "~/server/api/routers/list";
import { mediaRouter } from "./routers/media";
import { userRouter } from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  list: listRouter,
  media: mediaRouter,
  user: userRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
