import React from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

 const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Don't refetch every time they switch browser tabs
      retry: false, // Don't auto-retry failed requests (especially useful for 401/403 errors)
      staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    },
  },
})

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
