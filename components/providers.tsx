"use client";

import { ThemeProvider } from "next-themes";
import { ReactNode, useCallback } from "react";
import { useAuthStore } from "@/lib/store/authStore";
import { useSessionTimeout } from "@/lib/hooks/useSessionTimeout";
import { SessionTimeoutModal } from "@/components/SessionTimeoutModal";

export function Providers({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);

  const handleTimeout = useCallback(() => {
    logout();
    window.location.href = "/auth/login";
  }, [logout]);

  const { showWarning, secondsRemaining, dismissWarning } = useSessionTimeout({
    onTimeout: handleTimeout,
  });

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark" enableSystem={false}>
      {children}
      {isAuthenticated && (
        <SessionTimeoutModal
          open={showWarning}
          secondsRemaining={secondsRemaining}
          onDismiss={dismissWarning}
        />
      )}
    </ThemeProvider>
  );
}
