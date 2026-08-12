import { useAuth } from "@/hooks/useAuth"
import { LogoutButton } from "@/components/common/LogoutButton"
import { QueryProvider } from "@/components/providers/QueryProvider"
import { LogIn, User, UserPlus } from "lucide-react"

function StudentHeaderAuthContent() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="h-10 w-32 animate-pulse rounded-full bg-(--wwf-border)"></div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2 font-wwf tracking-wider sm:gap-4">
        <a
          href={`${import.meta.env.BASE_URL}login`}
          className="flex items-center gap-2 rounded-full px-4 py-2.5 text-xl transition-all hover:bg-slate-100 hover:text-(--wwf-ocean-deep) active:scale-95 max-[480px]:text-sm"
        >
          <LogIn size={16} /> Login
        </a>
        <a
          href={`${import.meta.env.BASE_URL}register/student`}
          className="flex items-center gap-2 rounded-full bg-(--wwf-coral) px-3 py-1.5 text-xl text-white shadow-sm transition-all hover:bg-(--wwf-orange) hover:shadow-(--wwf-coral)/20 active:scale-95 max-[480px]:text-sm"
        >
          <UserPlus size={16} /> Register Here
        </a>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3 sm:gap-4">
      <a
        href={`${import.meta.env.BASE_URL}play/levels`}
        className="flex items-center gap-2 rounded-xl px-4 py-2 font-wwf text-xl font-normal tracking-wider transition-all hover:bg-slate-100 hover:text-(--wwf-ocean-deep)"
      >
        Home
      </a>
      <a
        href={`${import.meta.env.BASE_URL}student/profile`}
        className="group flex items-center gap-3 transition-transform active:scale-95"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-(--wwf-ocean-light)/10 to-(--wwf-ocean-deep)/5 text-(--wwf-ocean-deep) shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:text-(--wwf-ocean)">
          <User size={18} />
        </div>
        <div className="hidden flex-col justify-center text-left xl:flex">
          <p className="text-sm font-bold text-(--wwf-ocean-deep) transition-colors group-hover:text-(--wwf-ocean)">
            {user?.name || "Student"}
          </p>
          <p className="text-[10px] font-black tracking-widest text-(--wwf-ocean-light)/70 uppercase">
            {user?.role === "student" ? "Student Account" : "Teacher Account"}
          </p>
        </div>
      </a>
      <div className="hidden h-8 w-px bg-(--wwf-ocean-light)/15 xl:block"></div>
      <div className="transition-transform active:scale-95">
        <LogoutButton />
      </div>
    </div>
  )
}

export function StudentHeaderAuth() {
  return (
    <QueryProvider>
      <StudentHeaderAuthContent />
    </QueryProvider>
  )
}
