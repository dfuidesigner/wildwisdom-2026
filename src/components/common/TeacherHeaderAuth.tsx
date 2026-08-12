import { useAuth } from "@/hooks/useAuth"
import { LogoutButton } from "@/components/common/LogoutButton"
import { QueryProvider } from "@/components/providers/QueryProvider"
import { User } from "lucide-react"

function TeacherHeaderAuthContent() {
  const { user, isLoading } = useAuth()
  if (isLoading) {
    return (
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 animate-pulse rounded-full bg-(--wwf-ocean-light)/10"></div>
        <div className="hidden flex-col gap-1 md:flex">
          <div className="h-4 w-24 animate-pulse rounded bg-(--wwf-ocean-light)/10"></div>
          <div className="h-2 w-16 animate-pulse rounded bg-(--wwf-ocean-light)/10"></div>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="flex items-center gap-3 sm:gap-4">
      <a
        href={`${import.meta.env.BASE_URL}teacher/profile`}
        className="group flex items-center gap-3 transition-transform active:scale-95"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-(--wwf-ocean-light)/10 to-(--wwf-ocean-deep)/5 text-(--wwf-ocean-deep) shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:text-(--wwf-ocean)">
          <User size={18} />
        </div>

        {/* Text Container */}
        <div className="hidden flex-col justify-center text-left md:flex">
          <p className="text-sm font-bold text-(--wwf-ocean-deep) transition-colors group-hover:text-(--wwf-ocean)">
            {user?.name || "Educator"}
          </p>
          <p className="text-[10px] font-black tracking-widest text-(--wwf-ocean-light)/70 uppercase">
            Teacher Account
          </p>
        </div>
      </a>
      <div className="hidden h-8 w-px bg-(--wwf-ocean-light)/15 md:block"></div>
      <div className="transition-transform active:scale-95">
        <LogoutButton />
      </div>
    </div>
  )
}

export function TeacherHeaderAuth() {
  return (
    <QueryProvider>
      <TeacherHeaderAuthContent />
    </QueryProvider>
  )
}
