import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function createClient() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  });
  return new PrismaClient({ adapter });
}

// In dev, the global PrismaClient can become stale after `prisma generate`.
// Recreate it if it doesn't have newer model delegates (e.g. `suggestions`).
const prisma =
  process.env.NODE_ENV === "production"
    ? createClient()
    : globalForPrisma.prisma && (globalForPrisma.prisma as any).suggestions
      ? globalForPrisma.prisma
      : createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
export default prisma;
