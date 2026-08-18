import { useState, useEffect } from "react"
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
  Eye,
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
import { AnswerKeyModal } from "@/components/play/AnswerKeyModal"

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

const formatTime = (seconds?: number) => {
  if (seconds === undefined || seconds === null) return "0s"
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return m > 0 ? `${m}m ${s}s` : `${s}s`
}

function LeaderboardContent() {
  const { user } = useAuth()

  const [levelId] = useState(() =>
    new URLSearchParams(window.location.search).get("levelId")
  )
  const PLATFORM_SLUG = import.meta.env.PUBLIC_PLATFORM_SLUG || "wildwisdom"
  const [showAnswers, setShowAnswers] = useState(false)

  const [successMsg] = useState(() => {
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
      {successMsg && (
        <div className="relative overflow-hidden rounded-3xl border border-(--wwf-ocean) bg-[#003140] p-6 text-white shadow-xl md:p-8">
          <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-[#95DDEA]/10 blur-3xl"></div>
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-[#F78623]/10 blur-3xl"></div>

          <div className="relative z-10 flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#F78623] text-3xl text-white shadow-lg shadow-[#F78623]/20">
                <Trophy fill="currentColor" size={32} />
              </div>

              <div>
                <h3 className="font-wwf text-3xl tracking-widest text-white">
                  CONGRATULATIONS!
                </h3>
                <p className="text-base font-medium text-[#95DDEA]">
                  {successMsg.completed
                    ? "You have completed all four quiz levels of the Classroom Challenge."
                    : "You have completed the quiz level and are now eligible to access the next quiz."}
                </p>
                <p className="mt-1 text-sm font-bold text-white">
                  Score: {successMsg.score} points
                </p>
              </div>
            </div>

            <button
              className="group flex w-full items-center justify-center gap-2 rounded-full bg-[#F78623] px-8 py-4 font-wwf text-xl tracking-widest text-white shadow-lg transition-all hover:scale-105 md:w-auto"
              onClick={() => {
                const base = import.meta.env.BASE_URL
                if (successMsg?.completed || !successMsg?.nextLevelId) {
                  window.location.assign(`${base}play/levels`)
                } else {
                  window.location.assign(
                    `${base}play/game?levelId=${successMsg.nextLevelId}`
                  )
                }
              }}
            >
              {successMsg.completed ? "RETURN TO MAP" : "NEXT LEVEL"}{" "}
              <ArrowRight
                size={20}
                strokeWidth={3}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>

            <button
              className="flex w-full items-center justify-center gap-2 rounded-full bg-white px-8 py-4 font-wwf text-xl tracking-widest text-[#003140] shadow-lg transition-all hover:scale-105 md:w-auto"
              onClick={() => setShowAnswers(true)}
            >
              VIEW ANSWERS <Eye size={20} strokeWidth={3} />
            </button>
          </div>

          {!successMsg.completed && (
            <div className="relative z-10 mt-6 rounded-2xl border border-[#95DDEA]/30 bg-white/10 p-5 text-center md:text-left">
              <p className="text-sm font-medium text-white md:text-base">
                The quiz link will remain valid until{" "}
                <strong>20th September 2026</strong>.
              </p>
              <p className="mt-2 font-wwf text-xl tracking-wide text-[#F78623]">
                🌊 Prepare Before You Play!
              </p>
              <p className="mt-1 text-sm font-medium text-[#95DDEA] md:text-base">
                Before taking the next <strong>quiz</strong>, make sure you
                prepare well and are ready to take on the challenge!
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
          )}
        </div>
      )}
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
                <p>
                  {myRank?.total_time_taken !== undefined && (
                    <div className="mt-1 flex items-center gap-1.5 text-[10px] font-semibold text-[#003140]/50">
                      <Clock size={12} />
                      Time: {formatTime(myRank.total_time_taken)}
                    </div>
                  )}
                </p>
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

      <AnswerKeyModal
        levelId={levelId}
        open={showAnswers}
        onClose={() => setShowAnswers(false)}
      />
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
