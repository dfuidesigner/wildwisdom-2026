import { useQuery } from "@tanstack/react-query"
import api from "@/lib/axios"
import type { User } from "@/types/auth"

export function useAuth() {
  const getCachedUser = () => {
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("ws_user")
      if (cached) {
        try {
          return JSON.parse(cached) as User
        } catch (e) {
          console.error(
            "Failed to parse cached user profile, clearing cache.",
            e
          )
          return undefined
        }
      }
    }
    return undefined
  }

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery<User | null>({
    queryKey: ["authUser"],
    queryFn: async () => {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("ws_token") : null

      if (!token) {
        if (typeof window !== "undefined") localStorage.removeItem("ws_user")
        return null
      }

      const response = await api.get<User>("/user")
      if (typeof window !== "undefined") {
        localStorage.setItem("ws_user", JSON.stringify(response.data))
      }

      return response.data
    },
    initialData: getCachedUser(),
    retry: false,
    staleTime: 1000 * 60 * 5,
  })

  return {
    user,
    isLoading,
    isError,
  }
}
