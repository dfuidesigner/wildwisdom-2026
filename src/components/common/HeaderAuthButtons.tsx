import { useAuth } from "@/hooks/useAuth"
import { QueryProvider } from "@/components/providers/QueryProvider"
import { ArrowRight, UserCircle, PlayCircle } from "lucide-react"

function AuthButtonsContent() {
  const { user, isLoading } = useAuth()

  const handlePlayNow = (e: React.MouseEvent) => {
    e.preventDefault()
    window.location.assign(`${import.meta.env.BASE_URL}play/levels`)
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-4">
        <div className="h-10 w-24 animate-pulse rounded-full bg-slate-100"></div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={handlePlayNow}
        className="group flex items-center gap-2 rounded-full bg-emerald-100 px-5 py-2.5 text-sm font-bold text-emerald-700 transition-all hover:bg-emerald-200 hover:shadow-md active:scale-95"
      >
        Play Now
        <PlayCircle
          size={18}
          className="transition-transform group-hover:scale-110"
        />
      </button>

      {user ? (
        <div>
          {user.role === "teacher" && (
            <a
              href={`${import.meta.env.BASE_URL}teacher`}
              className="group flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-200 transition-all hover:-translate-y-0.5 hover:bg-emerald-500 active:scale-95"
            >
              <UserCircle size={18} />
              Portal
              <ArrowRight
                size={16}
                strokeWidth={3}
                className="transition-transform group-hover:translate-x-1"
              />
            </a>
          )}
        </div>
      ) : (
        <>
          <a
            href={`${import.meta.env.BASE_URL}register/school`}
            className="group hidden items-center gap-2 rounded-full bg-slate-900 px-6 py-2.5 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-emerald-600 hover:shadow-emerald-200 active:scale-95 sm:flex"
          >
            Join Now
            <ArrowRight
              size={16}
              strokeWidth={3}
              className="transition-transform group-hover:translate-x-1"
            />
          </a>
        </>
      )}
    </div>
  )
}

export function HeaderAuthButtons() {
  return (
    <QueryProvider>
      <AuthButtonsContent />
    </QueryProvider>
  )
}
