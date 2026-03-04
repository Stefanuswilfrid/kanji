import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server/root-router";
import { createTRPCContext } from "@/server/trpc/context";

function handler(req: Request) {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: (opts) => createTRPCContext({ req: opts.req }),
    onError({ error, path, type }) {
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.error("tRPC error", { path, type, error });
      }
    },
  });
}

export { handler as GET, handler as POST };

