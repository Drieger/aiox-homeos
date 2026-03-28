"use client";

import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";

/**
 * Compõe todos os providers globais do app em um único Client Component.
 *
 * Ordem de composição:
 *   ThemeProvider (next-themes) → QueryClientProvider (@tanstack/react-query)
 *
 * @design QueryClient criado com useState(() => new QueryClient()) para
 * evitar compartilhamento de estado entre requisições em SSR.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
