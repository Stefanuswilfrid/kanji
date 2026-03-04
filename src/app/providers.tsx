"use client";

import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/modules/auth/auth-provider";
import { TRPCProvider } from "@/trpc/client";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        <TRPCProvider>{children}</TRPCProvider>
      </AuthProvider>
    </SessionProvider>
  );
}

