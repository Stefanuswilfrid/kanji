import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/trpc/trpc";
import { TRPCError } from "@trpc/server";

export const suggestionsRouter = createTRPCRouter({
  submit: publicProcedure
    .input(
      z.object({
        text: z.string().trim().min(25).max(500),
        category: z.number().int().min(0).max(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.userId) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      try {
        await ctx.prisma.suggestions.create({
          data: {
            text: input.text,
            category: input.category,
            userId: ctx.userId,
          },
        });
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to save suggestion. Did you run `npx prisma db push`?",
          cause: err,
        });
      }

      return { ok: true as const };
    }),
});

