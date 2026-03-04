import { createTRPCRouter } from "@/server/trpc/trpc";
import { suggestionsRouter } from "@/server/routers/suggestions";

export const appRouter = createTRPCRouter({
  suggestions: suggestionsRouter,
});

export type AppRouter = typeof appRouter;

