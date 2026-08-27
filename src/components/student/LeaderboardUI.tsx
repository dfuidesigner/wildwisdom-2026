import { useState, useEffect, type CSSProperties } from "react"
import { useQuery } from "@tanstack/react-query"
import api from "@/lib/axios"
import { useAuth } from "@/hooks/useAuth"
import { QueryProvider } from "@/components/providers/QueryProvider"
import {
  Trophy,
  // Globe2,
  School as SchoolIcon,
  Swords,
  Medal,
  ArrowRight,
  Ghost,
  Clock,
  CalendarDays,
  PartyPopper,
  Eye,
  Users,
  Waves,
} from "lucide-react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

interface UserRef {
  id: number
  name: string
  grade: string | null
}

interface SchoolRef {
  id: number
  school_name: string
}

interface LeaderboardEntry {
  id: number
  user: UserRef
  school?: SchoolRef
  total_score: number
  total_time_taken?: number
  status?: string
  progress_text?: string
  date: string
}

interface MyRank {
  total_score: number
  school_rank: number
  total_time_taken?: number
  date?: string
}

interface SuccessMsg {
  score: string
  completed: boolean
  nextLevelId: string | null
}

const formatTime = (seconds?: number) => {
  if (seconds === undefined || seconds === null) return "0s"
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return m > 0 ? `${m}m ${s}s` : `${s}s`
}

/* -------------------------------------------------------------------- */
/* Blink keyframes (scoped, no tailwind.config / global css edit needed) */
/* -------------------------------------------------------------------- */
function BlinkStyles() {
  return (
    <style>{`
      /* Light-sweep across the text. The text NEVER goes transparent:
         the gradient tiles (repeat) so every letter is always painted,
         and a solid color fallback sits underneath.
         Colours come from --shine-base / --shine-hi per instance. */
      @keyframes wwfShine {
        from { background-position: 0% 0; }
        to   { background-position: -162.5% 0; }
      }
      @keyframes wwfBreathe {
        0%, 100% { transform: scale(1); }
        50%      { transform: scale(1.02); }
      }
      .wwf-blink {
        display: inline-block;
        color: var(--shine-base);
        animation: wwfBreathe 3.4s ease-in-out infinite;
      }
      @supports ((background-clip: text) or (-webkit-background-clip: text)) {
        .wwf-blink {
          background-image: linear-gradient(
            100deg,
            var(--shine-base) 0%,
            var(--shine-base) 42%,
            var(--shine-hi) 50%,
            var(--shine-base) 58%,
            var(--shine-base) 100%
          );
          background-size: 260% 100%;
          background-repeat: repeat;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation:
            wwfShine 3.4s linear infinite,
            wwfBreathe 3.4s ease-in-out infinite;
          will-change: background-position, transform;
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .wwf-blink {
          animation: none;
          background-image: none;
          color: var(--shine-base);
          -webkit-text-fill-color: var(--shine-base);
        }
      }
    `}</style>
  )
}

/* -------------------------------------------------------------------- */
/* ALL LEVELS CLEARED — final completion banner                          */
/* -------------------------------------------------------------------- */
function AllLevelsClearedBanner({ score }: { score: string }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-(--wwf-ocean) bg-[#003140] p-6 text-white shadow-xl md:p-8">
      <BlinkStyles />

      {/* ambient glows */}
      <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-[#95DDEA]/15 blur-3xl"></div>
      <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-[#F78623]/15 blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#95DDEA]/5 blur-3xl"></div>

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Trophy badge */}
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F78623] text-white shadow-lg shadow-[#F78623]/30">
          <Trophy fill="currentColor" size={32} />
        </div>

        <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#95DDEA]/40 bg-white/10 px-4 py-1.5 text-[10px] font-black tracking-[0.2em] text-[#95DDEA] uppercase md:text-xs">
          <PartyPopper size={12} /> All 4 Quizzes Complete
        </span>

        <h3
          className="wwf-blink font-wwf text-3xl tracking-widest text-white md:text-4xl lg:text-5xl"
          style={
            {
              "--shine-base": "#FFFFFF",
              "--shine-hi": "#F78623",
            } as CSSProperties
          }
        >
          CONGRATULATIONS!
        </h3>

        <p className="mt-3 max-w-2xl text-base leading-relaxed font-semibold text-[#95DDEA] md:text-lg">
          You have successfully completed all four challenge quizzes!
        </p>

        {/* Score pill */}
        <div className="mt-5 inline-flex flex-wrap items-center justify-center gap-2.5 rounded-2xl border border-[#F78623]/40 bg-[#F78623]/10 px-5 py-3">
          <Medal size={18} className="text-[#F78623]" />
          <span className="text-xs font-bold tracking-widest text-white/70 uppercase">
            Final Level Score
          </span>
          <span className="font-wwf text-2xl tracking-widest text-[#F78623] md:text-3xl">
            {score}
          </span>
        </div>
      </div>

      {/* Info cards */}
      <div className="relative z-10 mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-[#95DDEA]/25 bg-white/10 p-5 text-left">
          <div className="mb-2 flex items-center gap-2 text-[#F78623]">
            <CalendarDays size={15} />
            <span className="text-[10px] font-black tracking-[0.2em] uppercase">
              Results
            </span>
          </div>
          <p className="text-sm leading-relaxed font-medium text-white md:text-base">
            The results will be declared on{" "}
            <strong className="text-[#95DDEA]">22nd September 2026</strong>.
          </p>
        </div>

        <div className="rounded-2xl border border-[#95DDEA]/25 bg-white/10 p-5 text-left">
          <div className="mb-2 flex items-center gap-2 text-[#F78623]">
            <Users size={15} />
            <span className="text-[10px] font-black tracking-[0.2em] uppercase">
              Teacher Dashboard
            </span>
          </div>
          <p className="text-sm leading-relaxed font-medium text-white md:text-base">
            The top two scorers will also be reflected on the Teacher Dashboard
            once the quiz window closes on{" "}
            <strong className="text-[#95DDEA]">20th September 2026</strong>.
          </p>
        </div>

        <div className="rounded-2xl border border-[#95DDEA]/25 bg-white/10 p-5 text-left">
          <div className="mb-2 flex items-center gap-2 text-[#F78623]">
            <Eye size={15} />
            <span className="text-[10px] font-black tracking-[0.2em] uppercase">
              Answer Key
            </span>
          </div>
          <p className="text-sm leading-relaxed font-medium text-white md:text-base">
            Please note that the answers to all the questions will be revealed
            on the Students’ Dashboard on the same day.
          </p>
        </div>
      </div>

      {/* Closing note + CTA */}
      <div className="relative z-10 mt-6 flex flex-col items-center justify-between gap-5 rounded-2xl border border-[#95DDEA]/30 bg-white/5 p-5 text-center md:flex-row md:p-6 md:text-left">
        <div className="flex items-start gap-3">
          <Waves
            size={20}
            className="mt-1 hidden shrink-0 text-[#95DDEA] md:block"
          />
          <div>
            <p className="text-sm leading-relaxed font-medium text-white md:text-base">
              Until then, keep learning, keep exploring, and continue to dive
              deep into the amazing world of oceans!
            </p>
            <p className="mt-2 font-wwf text-xl tracking-widest text-[#F78623] md:text-2xl">
              GOOD LUCK!
            </p>
          </div>
        </div>

        <button
          className="group flex w-full shrink-0 items-center justify-center gap-2 rounded-full bg-[#F78623] px-7 py-3.5 font-wwf text-lg tracking-widest text-white shadow-lg transition-all hover:scale-105 md:w-auto md:text-xl"
          onClick={() => {
            const base = import.meta.env.BASE_URL
            window.location.assign(`${base}play/levels`)
          }}
        >
          RETURN TO MAP
          <ArrowRight
            size={18}
            strokeWidth={3}
            className="transition-transform group-hover:translate-x-1"
          />
        </button>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------- */
/* LEVEL CLEARED (more levels remaining)                                 */
/* -------------------------------------------------------------------- */
function LevelClearedBanner({
  score,
  nextLevelId,
}: {
  score: string
  nextLevelId: string | null
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-(--wwf-ocean) bg-[#003140] p-6 text-white shadow-xl md:p-8">
      <BlinkStyles />

      <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-[#95DDEA]/10 blur-3xl"></div>
      <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-[#F78623]/10 blur-3xl"></div>

      <div className="relative z-10 flex flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#F78623] text-3xl text-white shadow-lg shadow-[#F78623]/20">
            <Trophy fill="currentColor" size={32} />
          </div>

          <div>
            <h3
              className="wwf-blink font-wwf text-3xl tracking-widest text-white md:text-4xl"
              style={
                {
                  "--shine-base": "#FFFFFF",
                  "--shine-hi": "#F78623",
                } as CSSProperties
              }
            >
              CONGRATULATIONS!
            </h3>
            <p className="mt-1 text-sm font-medium text-[#95DDEA] md:text-base">
              You have completed the quiz level and are now eligible to access
              the next quiz.
            </p>
            <p className="mt-2 text-sm font-bold text-white md:text-base">
              Score: {score} points
            </p>
          </div>
        </div>

        <button
          className="group flex w-full items-center justify-center gap-2 rounded-full bg-[#F78623] px-7 py-3.5 font-wwf text-lg tracking-widest text-white shadow-lg transition-all hover:scale-105 md:w-auto md:text-xl"
          onClick={() => {
            const base = import.meta.env.BASE_URL
            if (nextLevelId) {
              window.location.assign(`${base}play/game?levelId=${nextLevelId}`)
            } else {
              window.location.assign(`${base}play/levels`)
            }
          }}
        >
          {nextLevelId ? "NEXT LEVEL" : "RETURN TO MAP"}{" "}
          <ArrowRight
            size={18}
            strokeWidth={3}
            className="transition-transform group-hover:translate-x-1"
          />
        </button>
      </div>

      <div className="relative z-10 mt-6 rounded-2xl border border-[#95DDEA]/30 bg-white/10 p-5 text-center md:text-left">
        <p className="text-sm font-medium text-white md:text-base">
          The quiz link will remain valid until{" "}
          <strong>20th September 2026</strong>.
        </p>
        <p className="mt-2 font-wwf text-xl tracking-wide text-[#F78623] md:text-2xl">
          🌊 Prepare Before You Play!
        </p>
        <p className="mt-2 text-sm font-medium text-[#95DDEA] md:text-base">
          Before taking the next <strong>quiz</strong>, make sure you prepare
          well and are ready to take on the challenge!
        </p>
        <p className="mt-2 text-sm font-medium break-all text-[#95DDEA] md:text-base">
          Link:{" "}
          <a
            href="https://wildwisdom.wwfindia.org/resources/"
            className="font-bold text-white underline underline-offset-4 hover:text-[#F78623]"
          >
            https://wildwisdom.wwfindia.org/resources/
          </a>
        </p>
      </div>
    </div>
  )
}

function LeaderboardContent() {
  const { user } = useAuth()

  const [levelId] = useState(() =>
    new URLSearchParams(window.location.search).get("levelId")
  )
  const PLATFORM_SLUG = import.meta.env.PUBLIC_PLATFORM_SLUG || "wildwisdom"

  const [successMsg] = useState<SuccessMsg | null>(() => {
    const params = new URLSearchParams(window.location.search)
    return params.get("success") === "true"
      ? {
          score: params.get("score") || "0",
          completed: params.get("completed") === "true",
          nextLevelId: params.get("nextLevelId"),
        }
      : null
  })

  const [view, setView] = useState<"global" | "school" | "level">(
    levelId ? "level" : "school"
  )

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.has("success")) {
      params.delete("success")
      params.delete("score")
      params.delete("levelId")
      params.delete("completed")
      params.delete("nextLevelId")
      const newUrl = params.toString()
        ? `${window.location.pathname}?${params.toString()}`
        : window.location.pathname
      window.history.replaceState({}, document.title, newUrl)
    }
  }, [])

  const { data: myRank, isLoading: loadingMe } = useQuery({
    queryKey: ["leaderboardMe", PLATFORM_SLUG],
    queryFn: async () => {
      const res = await api.get(`/play/${PLATFORM_SLUG}/leaderboards/me`)
      return res.data.data as MyRank
    },
  })

  const { data: globalBoard, isLoading: loadingGlobal } = useQuery({
    queryKey: ["leaderboardGlobal", PLATFORM_SLUG],
    queryFn: async () => {
      const res = await api.get(`/play/${PLATFORM_SLUG}/leaderboards/global`)
      return res.data.data as LeaderboardEntry[]
    },
    enabled: view === "global",
  })

  const { data: schoolBoard, isLoading: loadingSchool } = useQuery({
    queryKey: ["leaderboardSchool", PLATFORM_SLUG],
    queryFn: async () => {
      const res = await api.get(`/play/${PLATFORM_SLUG}/leaderboards/school`)
      return res.data.data as LeaderboardEntry[]
    },
  })

  const { data: levelBoard, isLoading: loadingLevel } = useQuery({
    queryKey: ["leaderboardLevel", levelId, PLATFORM_SLUG],
    queryFn: async () => {
      const res = await api.get(
        `/play/${PLATFORM_SLUG}/leaderboards/levels/${levelId}`
      )
      return res.data.data as LeaderboardEntry[]
    },
    enabled: !!levelId,
  })

  const currentBoard =
    view === "global"
      ? globalBoard
      : view === "school"
        ? schoolBoard
        : levelBoard

  const isLoadingBoard =
    view === "global"
      ? loadingGlobal
      : view === "school"
        ? loadingSchool
        : loadingLevel

  const renderRank = (index: number) => {
    if (index === 0)
      return (
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F78623]/20 font-bold text-[#F78623] ring-2 ring-[#F78623]/30">
          🥇
        </span>
      )
    if (index === 1)
      return (
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200/50 font-bold text-slate-700 ring-2 ring-slate-200">
          🥈
        </span>
      )
    if (index === 2)
      return (
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#CD7F32]/10 font-bold text-[#CD7F32] ring-2 ring-[#CD7F32]/20">
          🥉
        </span>
      )

    return (
      <span className="flex h-8 w-8 items-center justify-center font-wwf text-xl text-[#003140]/60">
        {index + 1}
      </span>
    )
  }

  return (
    <div className="space-y-6 pb-24 md:space-y-8">
      {successMsg &&
        (successMsg.completed ? (
          <AllLevelsClearedBanner score={successMsg.score} />
        ) : (
          <LevelClearedBanner
            score={successMsg.score}
            nextLevelId={successMsg.nextLevelId}
          />
        ))}

      <div className="grid gap-4 md:grid-cols-3 md:gap-6">
        <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:col-span-1 md:p-6">
          <div className="mb-4 flex items-center gap-2">
            <Medal size={16} className="text-[#F78623]" />
            <h3 className="text-[10px] font-black tracking-[0.2em] text-[#F78623] uppercase">
              My Standing
            </h3>
          </div>
          {loadingMe ? (
            <div className="flex items-end justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-24" />
              </div>
              <div className="space-y-2 text-right">
                <Skeleton className="ml-auto h-4 w-16" />
                <Skeleton className="ml-auto h-8 w-16" />
              </div>
            </div>
          ) : (
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold text-[#003140]/60">
                  Total Score
                </p>
                <p className="font-wwf text-5xl tracking-widest text-[#F78623]">
                  {myRank?.total_score || 0}
                </p>
                {myRank?.total_time_taken !== undefined && (
                  <div className="mt-1 flex items-center gap-1.5 text-[10px] font-semibold text-[#003140]/50">
                    <Clock size={12} />
                    Time: {formatTime(myRank.total_time_taken)}
                  </div>
                )}
                {myRank?.date && (
                  <div className="mt-1 flex items-center gap-1.5 text-[10px] font-semibold text-[#003140]/50">
                    <CalendarDays size={12} />
                    Last played: {myRank.date}
                  </div>
                )}
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-[#003140]/60">
                  School Rank
                </p>
                <p className="font-wwf text-4xl tracking-widest text-[#003140]">
                  {myRank?.school_rank ? `#${myRank.school_rank}` : "-"}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:col-span-2">
          <div className="flex w-full flex-col gap-2 rounded-2xl bg-slate-50 p-1.5 sm:flex-row">
            {levelId && (
              <button
                onClick={() => setView("level")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all ${view === "level" ? "bg-[#003140] text-white shadow-sm" : "text-[#003140]/60 hover:text-[#003140]"}`}
              >
                <Swords size={16} /> <span>Level Results</span>
              </button>
            )}
            <button
              onClick={() => setView("school")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all ${view === "school" ? "bg-[#003140] text-white shadow-sm" : "text-[#003140]/60 hover:text-[#003140]"}`}
            >
              <SchoolIcon size={16} /> <span>My School</span>
            </button>

            {/* --- GLOBAL LEADERBOARD TAB (Commented Out) --- 
            <button
              onClick={() => setView("global")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all ${view === "global" ? "bg-[#003140] text-white shadow-sm" : "text-[#003140]/60 hover:text-[#003140]"}`}
            >
              <Globe2 size={16} /> <span>Global Ranks</span>
            </button>
            */}
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-[#F4FBFC] px-5 py-4 md:px-8 md:py-6">
          <h3 className="font-wwf text-3xl tracking-wider text-[#F78623] uppercase">
            {view === "global"
              ? "Global Top 100"
              : view === "school"
                ? "School Top 100"
                : "Level Top Scores"}
          </h3>
          <p className="mt-1 text-xs font-medium text-[#003140]/70">
            {view === "global"
              ? "The highest scoring students worldwide."
              : view === "school"
                ? "Top performers in your school."
                : "Top scores for this specific Level."}
          </p>
        </div>

        <div className="overflow-x-auto">
          <Table className="w-full min-w-187.5 text-left text-sm">
            <TableHeader className="bg-white">
              <TableRow className="border-b border-slate-100 hover:bg-transparent">
                <TableHead className="px-6 py-4 text-left text-[11px] font-bold tracking-widest whitespace-nowrap text-[#003140] uppercase md:px-8">
                  Date
                </TableHead>
                <TableHead className="w-24 px-6 py-4 text-center text-[11px] font-bold tracking-widest whitespace-nowrap text-[#003140] uppercase md:px-8">
                  Rank
                </TableHead>
                <TableHead className="px-6 py-4 text-left text-[11px] font-bold tracking-widest whitespace-nowrap text-[#003140] uppercase md:px-8">
                  Student Name
                </TableHead>
                {view !== "school" && (
                  <TableHead className="hidden px-6 py-4 text-left text-[11px] font-bold tracking-widest whitespace-nowrap text-[#003140] uppercase md:table-cell md:px-8">
                    School Name
                  </TableHead>
                )}
                <TableHead className="px-6 py-4 text-center text-[11px] font-bold tracking-widest whitespace-nowrap text-[#003140] uppercase md:px-8">
                  Status
                </TableHead>
                <TableHead className="px-6 py-4 text-right text-[11px] font-bold tracking-widest whitespace-nowrap text-[#F78623] uppercase md:px-8">
                  Score & Time
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-slate-100">
              {isLoadingBoard ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow
                    key={i}
                    className="border-slate-100 hover:bg-transparent"
                  >
                    <TableCell className="px-6 py-4 md:px-8">
                      <Skeleton className="h-4 w-20 rounded-md" />
                    </TableCell>
                    <TableCell className="px-6 py-4 md:px-8">
                      <Skeleton className="mx-auto h-8 w-8 rounded-full" />
                    </TableCell>
                    <TableCell className="px-6 py-4 md:px-8">
                      <Skeleton className="h-5 w-32" />
                    </TableCell>
                    {view !== "school" && (
                      <TableCell className="hidden px-6 py-4 md:table-cell md:px-8">
                        <Skeleton className="h-4 w-40" />
                      </TableCell>
                    )}
                    <TableCell className="px-6 py-4 md:px-8">
                      <Skeleton className="mx-auto h-5 w-20 rounded-full" />
                    </TableCell>
                    <TableCell className="px-6 py-4 md:px-8">
                      <div className="flex flex-col items-end space-y-2">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-4 w-12" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : currentBoard?.length === 0 || !currentBoard ? (
                <TableRow className="border-slate-100 hover:bg-transparent">
                  <TableCell
                    colSpan={view !== "school" ? 6 : 5}
                    className="py-24 text-center"
                  >
                    <div className="flex flex-col items-center justify-center text-[#003140]/40">
                      <Ghost
                        className="mb-3 h-10 w-10 text-[#003140]/30"
                        strokeWidth={2}
                      />
                      <p className="text-sm font-bold tracking-tight text-[#003140]/60">
                        No scores recorded yet. Claim the top spot!
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                currentBoard?.map((entry, index) => {
                  const isCurrentUser = user?.id === entry.user?.id

                  return (
                    <TableRow
                      key={entry.id}
                      className={`group transition-colors ${
                        isCurrentUser
                          ? "border-l-4 border-[#F78623] bg-[#F78623]/5 hover:bg-[#F78623]/10"
                          : "border-slate-100 hover:bg-slate-50"
                      }`}
                    >
                      <TableCell className="px-6 py-4 text-left text-sm font-medium whitespace-nowrap text-slate-500 md:px-8">
                        {entry.date}
                      </TableCell>

                      <TableCell className="px-6 py-4 whitespace-nowrap md:px-8">
                        <div className="flex justify-center">
                          {renderRank(index)}
                        </div>
                      </TableCell>

                      <TableCell
                        className={`px-6 py-4 text-left text-base font-bold whitespace-nowrap md:px-8 ${
                          isCurrentUser
                            ? "text-[#F78623]"
                            : "text-[#003140] group-hover:text-[#F78623]"
                        }`}
                      >
                        {entry.user?.name}
                        {isCurrentUser && (
                          <span className="ml-3 inline-flex items-center rounded-full bg-[#F78623] px-2.5 py-0.5 text-[10px] font-black tracking-widest text-white uppercase shadow-sm">
                            You
                          </span>
                        )}
                      </TableCell>

                      {view !== "school" && (
                        <TableCell className="hidden px-6 py-4 text-left text-sm font-medium whitespace-nowrap text-slate-500 md:table-cell md:px-8">
                          {entry.school?.school_name || "Unknown"}
                        </TableCell>
                      )}

                      <TableCell className="px-6 py-4 text-center whitespace-nowrap md:px-8">
                        <span
                          className={`inline-flex items-center justify-center rounded-full px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase ${
                            entry.status === "Completed"
                              ? "bg-[#95DDEA]/20 text-[#003140]"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {entry.progress_text || "Active"}
                        </span>
                      </TableCell>

                      <TableCell className="px-6 py-4 text-right whitespace-nowrap md:px-8">
                        <div className="flex flex-col items-end gap-0.5">
                          <div className="font-wwf text-3xl tracking-widest text-[#F78623] tabular-nums">
                            {entry.total_score.toLocaleString()}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                            <Clock size={12} />
                            {formatTime(entry.total_time_taken)}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

export function LeaderboardUI() {
  return (
    <QueryProvider>
      <LeaderboardContent />
    </QueryProvider>
  )
}
