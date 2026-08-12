import React, { useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { Loader2 } from "lucide-react"
import { QueryProvider } from "@/components/providers/QueryProvider"

function GuestGuardContent({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && user) {
      if (typeof window !== "undefined") {
        const base = import.meta.env.BASE_URL
        if (user.role === "teacher") {
          window.location.replace(`${base}teacher`)
        } else if (user.role === "student") {
          window.location.replace(`${base}play/levels`)
        } else if (user.role === "state_admin") {
          window.location.replace(`${base}state-admin`)
        } else {
          window.location.replace(base)
        }
      }
    }
  }, [user, isLoading])

  // While we check their token (or if we are currently redirecting them),
  // hide the login form so we don't get an ugly UI flicker.
  if (isLoading || user) {
    return (
      <div className="fixed inset-0 z-999 flex items-center justify-center bg-slate-50 backdrop-blur-sm">
        <Loader2
          className="h-8 w-8 animate-spin text-primary"
          strokeWidth={3}
        />
      </div>
    )
  }

  // SUCCESS: No active session found. Reveal the login form!
  return <>{children}</>
}

export function GuestGuard({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <GuestGuardContent>{children}</GuestGuardContent>
    </QueryProvider>
  )
}
