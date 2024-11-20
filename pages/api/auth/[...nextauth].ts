import { prisma } from "@/utils/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";


export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    jwt: async ({ token, user, trigger, session }) => {
      if (trigger === "update") {
        const username = session.user.username;

        const prismaUser = await prisma.user.update({
          where: {
            id: token.user.id,
          },
          data: {
            username,
          },
        });

        if (token.user) {
          token.user = {
            ...token.user,
            username,
            createdAt: prismaUser.createdAt,
          };
        }
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        user && (token.user = user);
      }
      return token;
    },
    session: async ({ session, token }) => {
      session.user = token.user;

      return session;
    },
  },
  pages: {
    signIn: "/",
    error: "/",
    verifyRequest: "/",
  },
  // debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
