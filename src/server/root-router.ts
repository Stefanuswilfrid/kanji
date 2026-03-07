import { createTRPCRouter } from "@/server/trpc/trpc";
import { flashcardRouter } from "@/server/routers/flashcard";
import { suggestionsRouter } from "@/server/routers/suggestions";

export const appRouter = createTRPCRouter({
  flashcard: flashcardRouter,
  suggestions: suggestionsRouter,
});

export type AppRouter = typeof appRouter;

