"use client";

import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/modules/auth/auth-provider";
import { TRPCProvider } from "@/trpc/client";
import { ConfettiProvider } from "@/modules/layout/confetti-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ConfettiProvider>
      <AuthProvider>
        <TRPCProvider>{children}</TRPCProvider>
      </AuthProvider>
      </ConfettiProvider>
    </SessionProvider>
  );
}

