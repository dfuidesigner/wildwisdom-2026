import React, { useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { ShieldAlert, Loader2 } from "lucide-react"
import { QueryProvider } from "@/components/providers/QueryProvider"
import type { User } from "@/types/auth"

interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles: Array<User["role"]>
}

function GuardContent({ children, allowedRoles }: RoleGuardProps) {
  const { user, isLoading, isError } = useAuth()

  // Safely check if they are authorized
  const isAuthorized =
    !isLoading && !isError && user && allowedRoles.includes(user.role)

  useEffect(() => {
    if (!isLoading && !isAuthorized) {
      if (typeof window !== "undefined") {
        // FIX: Use BASE_URL to ensure they redirect to the subfolder login
        // This changes "/login" to "/vishal/wildswisdom/login"
        window.location.replace(`${import.meta.env.BASE_URL}login`)
      }
    }
  }, [isLoading, isAuthorized])

  // SHOW LOADER IF:
  // 1. We are still fetching the user
  // 2. Or they are unauthorized (keep the loader on screen while the redirect happens to prevent a white flash)
  if (isLoading || !isAuthorized) {
    return (
      <div className="fixed inset-0 z-999 flex flex-col items-center justify-center bg-slate-50/90 backdrop-blur-sm">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-xl">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <div className="flex w-64 flex-col gap-4 text-center">
          <div>
            <h2 className="text-[10px] font-black tracking-[0.3em] text-slate-400 uppercase">
              Security Protocol
            </h2>
            <p className="text-sm font-bold text-slate-900">
              Verifying Access Credentials
            </p>
          </div>
          <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
            <div className="absolute h-full w-1/3 animate-[loading_1.5s_infinite_linear] rounded-full bg-primary"></div>
          </div>
          <div className="flex justify-between text-[10px] font-bold tracking-widest text-slate-400 uppercase">
            <span>Encrypted Tunnel</span>
            <Loader2 className="h-3 w-3 animate-spin" />
          </div>
        </div>

        <style
          dangerouslySetInnerHTML={{
            __html: `
          @keyframes loading {
            0% { left: -33%; }
            100% { left: 100%; }
          }
        `,
          }}
        />
      </div>
    )
  }

  // SUCCESS: They are fully verified! Reveal the page.
  return <>{children}</>
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  return (
    <QueryProvider>
      <GuardContent allowedRoles={allowedRoles}>{children}</GuardContent>
    </QueryProvider>
  )
}
