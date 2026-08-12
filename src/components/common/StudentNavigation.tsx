import { Trophy, ArrowLeft } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { QueryProvider } from "@/components/providers/QueryProvider"

interface Props {
  currentPath: string
  base: string
}

function StudentNavigationContent({ currentPath, base }: Props) {
  const { user, isLoading } = useAuth()

  const isLeaderboardActive = currentPath.startsWith(
    `${base}/play/leaderboards`
  )

  return (
    <nav className="flex items-center gap-2">
      <a
        href={`${base}/`}
        className="text- hidden items-center gap-2 rounded-xl px-4 py-2 font-wwf font-normal tracking-wider transition-all hover:bg-slate-100 hover:text-(--wwf-ocean-deep) lg:flex lg:text-xl"
      >
        <ArrowLeft size={16} strokeWidth={2} /> Wild Wisdom Global Challenge
        2026
      </a>

      {!isLoading && user && user.role === "student" && (
        <>
          <div className="mx-1 h-6 w-px bg-slate-200"></div>
          <a
            href={`${base}/play/leaderboards`}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all ${
              isLeaderboardActive
                ? "bg-(--wwf-sea-green)/15 text-(--wwf-ocean-deep) shadow-sm ring-1 ring-(--wwf-sea-green)/40"
                : "text-(--wwf-ocean) hover:bg-(--wwf-sea-green)/10 hover:text-(--wwf-ocean-deep)"
            }`}
          >
            <Trophy size={16} strokeWidth={isLeaderboardActive ? 3 : 2} />
            <span className="hidden md:inline"> Go To Leaderboard</span>
          </a>
        </>
      )}
    </nav>
  )
}

export function StudentNavigation(props: Props) {
  return (
    <QueryProvider>
      <StudentNavigationContent {...props} />
    </QueryProvider>
  )
}
