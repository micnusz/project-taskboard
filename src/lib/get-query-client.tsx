// lib/get-query-client.ts
import { QueryClient } from "@tanstack/react-query";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000,
        gcTime: 2 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
      },
    },
  });
}

// Global cache for browser (Client Components)
let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  // typeof window === "undefined" => ssr
  if (typeof window === "undefined") {
    return makeQueryClient();
  }

  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }

  return browserQueryClient;
}
