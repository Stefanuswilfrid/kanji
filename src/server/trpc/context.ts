import { getToken } from "next-auth/jwt";

export type TRPCContext = {
  prisma: import("@/generated/prisma/client").PrismaClient;
  userId: string | null;
};

async function getPrismaForRequest() {
  const mod = await import("@/lib/prisma");
  const prisma = mod.default as any;

  // In dev, Next can keep an older PrismaClient instance alive after schema changes.
  // If the new delegate (e.g. `suggestions`) is missing, recreate the client.
  if (process.env.NODE_ENV !== "production" && !prisma?.suggestions) {
    const { PrismaClient } = await import("@/generated/prisma/client");
    const { PrismaPg } = await import("@prisma/adapter-pg");
    return new PrismaClient({
      adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
    });
  }

  return prisma as import("@/generated/prisma/client").PrismaClient;
}

export async function createTRPCContext(opts: { req: Request }): Promise<TRPCContext> {
  const token = await getToken({
    req: opts.req as any,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const userId =
    (token as any)?.user?.id ??
    (typeof token?.sub === "string" ? token.sub : null);

  return {
    prisma: await getPrismaForRequest(),
    userId,
  };
}

