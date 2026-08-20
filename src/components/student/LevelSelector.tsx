import { useQuery } from "@tanstack/react-query"
import api from "@/lib/axios"
import { useAuth } from "@/hooks/useAuth"

import { QueryProvider } from "@/components/providers/QueryProvider"
import {
  CheckCircle2,
  Play,
  ShieldAlert,
  Lock,
  ListOrdered,
  GraduationCap,
  Target,
  Trophy,
  Info,
} from "lucide-react"
import OceanElement from "../home/OceanElement"
const baseUrl = import.meta.env.BASE_URL

interface Level {
  id: number
  level_number: number
  title: string
  time_limit: number | null
  is_completed: boolean
  score: number | null
  completed_at: string | null
  is_locked: boolean
  unlocks_at: string | null
}

interface LevelSelectorResponse {
  quiz: {
    title: string
    slug: string
    description: string | null
  }
  levels: Level[]
}

function LevelSelectorContent() {
  const { user } = useAuth()
  const PLATFORM_SLUG = import.meta.env.PUBLIC_PLATFORM_SLUG || "wildwisdom"

  const { data, isLoading, isError } = useQuery({
    queryKey: ["studentLevels", PLATFORM_SLUG],
    queryFn: async () => {
      const response = await api.get<{ data: LevelSelectorResponse }>(
        `/play/${PLATFORM_SLUG}/levels`
      )
      return response.data.data
    },
  })

  if (isLoading) {
    return (
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 pt-10">
        <div className="h-125 w-full animate-pulse rounded-[2.5rem] bg-(--wwf-ocean-light)/10" />
        <div className="mx-auto w-full max-w-4xl space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 w-full animate-pulse rounded-2xl bg-(--wwf-ocean-light)/10"
            />
          ))}
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="mx-auto mt-24 flex max-w-lg flex-col items-center justify-center rounded-[2.5rem] border-2 border-(--wwf-octopus) bg-white px-4 py-16 text-center shadow-lg">
        <ShieldAlert className="mb-4 h-16 w-16 text-(--wwf-octopus)" />
        <h3 className="font-wwf text-3xl text-(--wwf-ocean-deep)">
          Connection Error
        </h3>
        <p className="mt-2 font-medium text-(--wwf-ocean)">
          Failed to load the quizzes. Please try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-8 rounded-full bg-(--wwf-coral) px-10 py-4 font-bold text-white shadow-lg hover:bg-(--wwf-orange) active:scale-95"
        >
          Reload Page
        </button>
      </div>
    )
  }

  const levels = data?.levels || []
  const nextLevel = levels.find((l) => !l.is_completed && !l.is_locked)
  const isQuizComplete =
    levels.length > 0 && levels.every((l) => l.is_completed)

  return (
    <div className="mx-auto space-y-12">
      <div className="relative flex w-full flex-col items-center overflow-hidden bg-slate-900 py-16 max-lg:px-5 md:py-20">
        <OceanElement
          src={`${baseUrl}images/two-fish.webp`}
          type="fish"
          delay={0.2}
          className="absolute right-0 bottom-10 w-12 opacity-70 sm:w-20 md:bottom-0 md:w-30 md:opacity-100 lg:w-30 xl:right-30"
        />
        <OceanElement
          src={`${baseUrl}images/pink-weed.webp`}
          type="coral"
          delay={1.2}
          className="absolute bottom-[20%] w-15 max-[769px]:rotate-y-180! md:top-40 md:right-0 md:w-20"
        />
        <OceanElement
          src={`${baseUrl}images/svgs/orange-stick.svg`}
          type="float"
          delay={0.2}
          className="absolute top-10 left-0 w-12 opacity-70 sm:w-20 md:top-15 md:w-30 md:opacity-100 lg:w-30"
        />
        <OceanElement
          src={`${baseUrl}images/svgs/dark-blue-coral.svg`}
          type="coral"
          delay={0.5}
          className="absolute -bottom-16 -left-5 w-25 md:-bottom-25 md:left-5 md:w-40 lg:-bottom-35 lg:left-0 lg:w-auto"
        />
        <OceanElement
          src={`${baseUrl}images/blue-fish.webp`}
          type="fish"
          delay={0}
          className="absolute top-10 left-20 z-0 w-18 sm:left-[40%] md:left-[30%] md:w-25 lg:left-[10%] lg:w-40 xl:top-[40%] xl:left-[3%] xl:w-35"
        />

        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: `url('${import.meta.env.BASE_URL}images/quiz-bg.png')`,
          }}
        />

        <div className="relative z-10 mx-4 mt-6 w-full max-w-5xl rounded-[2.5rem] bg-white px-6 py-10 text-center shadow-2xl md:px-12 md:py-12">
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2.5rem]">
            <OceanElement
              src={`${baseUrl}images/blue-fish.webp`}
              type="fish"
              delay={0.7}
              className="absolute top-10 -right-4 w-20 opacity-[0.15] md:top-16 md:right-4 md:w-28 md:opacity-20"
            />
            <OceanElement
              src={`${baseUrl}images/pink-weed.webp`}
              type="coral"
              delay={1.5}
              className="absolute right-0 -bottom-4 w-20 opacity-20 md:bottom-4 md:w-28 md:opacity-[0.25]"
            />
            <OceanElement
              src={`${baseUrl}images/svgs/orange-stick.svg`}
              type="float"
              delay={1.0}
              className="absolute top-1/2 left-0 w-12 -translate-y-1/2 opacity-[0.15] md:w-16 md:opacity-20"
            />
          </div>

          <div className="absolute -top-5 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border-2 border-(--wwf-border) bg-white px-8 py-2.5 text-sm font-black tracking-widest whitespace-nowrap text-(--wwf-ocean-deep) uppercase shadow-lg md:text-base">
            <GraduationCap size={20} className="text-(--wwf-sea-green)" />
            {data?.quiz.title || "Wild Wisdom QUIZ 2026"}
          </div>

          <div className="relative z-10 mx-auto max-w-3xl space-y-4">
            <h1 className="font-wwf text-3xl leading-tight font-bold text-(--wwf-ocean-deep) md:text-4xl lg:text-5xl">
              WWGC Classroom Challenge
            </h1>
            <p className="text-sm leading-relaxed font-medium text-slate-600 md:text-base lg:text-lg">
              The WWGC Classroom Challenge is the first round of the competition
              and will be conducted virtually through participating schools.
            </p>
            <p className="text-sm leading-relaxed font-medium text-slate-600 md:text-base lg:text-lg">
              The challenge consists of a series of four online quiz levels, and
              all registered students are required to attempt each level. The
              cumulative score across all four quizzes will be used to identify
              the top two students from every participating school. These
              students will then qualify for the next stage of the competition —
              the State Level Round.
            </p>
            <p className="mb-5 text-sm leading-relaxed font-medium text-slate-600 md:text-base lg:text-lg">
              The challenge is open to all registered students and will be
              hosted entirely online through the Wild Wisdom Quiz Platform.
            </p>

            <div className="mt-6 flex items-center justify-center">
              <a
                href={`${baseUrl}student/guidelines`}
                className="guidelines-blink relative flex items-center gap-2 rounded-xl bg-[#F78623] px-8 py-4 text-base font-black tracking-wide text-white uppercase shadow-lg transition-transform hover:scale-105 active:scale-95 md:text-lg"
              >
                <span className="pointer-events-none absolute -inset-1 rounded-xl bg-[#F78623] opacity-40 blur-md" />
                <Info size={20} className="relative z-10" />
                <span className="relative z-10">View Challenge Guidelines</span>
              </a>
            </div>

            {/* <div className="relative z-20 mt-6 rounded-2xl border-2 border-amber-300 bg-amber-50 p-5 text-left shadow-md md:p-6">
              <div className="mb-3 flex items-center justify-center gap-2 text-amber-900">
                <ShieldAlert size={20} className="shrink-0" />
                <h3 className="text-sm font-black tracking-wide uppercase md:text-base">
                  Important Notice for Students
                </h3>
              </div>
              <div className="space-y-3 text-sm leading-relaxed font-semibold text-amber-950 md:text-[15px]">
                <p>
                  This quiz platform is designed for WWGC participants to Test
                  and enhance their knowledge on Oceans.
                </p>
                <p>
                  Therefore, please attempt all questions independently and do
                  not use AI tools, search engines, or any other unfair means to
                  obtain answers.
                </p>
                <p>
                  Clearing this round using outside assistance may not help you
                  in the subsequent rounds, which may use different formats and
                  platforms. Your performance in later rounds will depend on
                  your genuine understanding and ability.
                </p>
                <p className="border-t border-amber-300 pt-3 font-black text-(--wwf-ocean-deep)">
                  Give it your best effort, play fair, and let your knowledge
                  speak for itself.
                </p>
              </div>
            </div> */}

            {!user ? (
              <div className="relative z-20 mt-6 rounded-2xl border-2 border-amber-300 bg-amber-50 p-5 text-left shadow-md md:p-6">
                <div className="mb-3 flex items-center justify-center gap-2 text-amber-900">
                  <ShieldAlert size={20} className="shrink-0" />
                  <h3 className="text-sm font-black tracking-wide uppercase md:text-base">
                    Important Notice for Students
                  </h3>
                </div>

                <div className="space-y-3 text-sm leading-relaxed font-semibold text-amber-950 md:text-[15px]">
                  <p>
                    This quiz platform is designed for WWGC participants to Test
                    and enhance their knowledge on Oceans.
                  </p>
                  <p>
                    Therefore, please attempt all questions independently and do
                    not use AI tools, search engines, or any other unfair means
                    to obtain answers.
                  </p>
                  <p>
                    Clearing this round using outside assistance may not help
                    you in the subsequent rounds, which may use different
                    formats and platforms. Your performance in later rounds will
                    depend on your genuine understanding and ability.
                  </p>
                  <p className="border-t border-amber-300 pt-3 font-black text-(--wwf-ocean-deep)">
                    Give it your best effort, play fair, and let your knowledge
                    speak for itself.
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative z-20 mt-6 rounded-2xl border-2 border-amber-200 bg-amber-50/80 p-6 text-left shadow-md">
                <div className="mb-3 flex items-center gap-2 text-amber-800">
                  <ShieldAlert size={22} className="shrink-0" />
                  <h3 className="text-base font-bold tracking-wide uppercase">
                    Disclaimer
                  </h3>
                </div>

                <div className="space-y-3 text-sm leading-relaxed font-semibold text-amber-900">
                  <p>
                    The quiz platform actively monitors browser activity
                    throughout the session.
                  </p>

                  <p className="font-bold">
                    Switching tabs, minimizing the browser window, or navigating
                    away from the quiz page may result in the quiz being
                    automatically submitted, and your one attempt will be
                    considered complete.
                  </p>

                  <p>
                    Students will not be given a second attempt for the same
                    quiz under any circumstances. Each quiz level must be
                    completed in a single attempt.
                  </p>

                  <p className="border-t border-amber-300 pt-2 font-bold text-(--wwf-ocean-deep)">
                    Students are strongly advised to remain on the quiz page
                    throughout the session to ensure a smooth and uninterrupted
                    experience.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* STATUS AND PLAY BUTTONS — hidden for guests (no "Sign in to Play") */}
          {user && (
            <div className="relative z-10 mt-8 border-t-2 border-slate-100 pt-8">
              {isQuizComplete ? (
                <div className="mx-auto w-full max-w-sm animate-in duration-700 fade-in slide-in-from-bottom-4">
                  <div className="flex flex-col items-center bg-white p-10 text-center sm:p-7">
                    <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-(--wwf-coral)/5 ring-1 ring-(--wwf-coral)/20">
                      <div className="absolute inset-2 rounded-full bg-(--wwf-coral)/10" />
                      <Trophy
                        className="relative z-10 h-10 w-10 text-(--wwf-coral)"
                        strokeWidth={1.5}
                      />
                    </div>
                    <h3 className="font-wwf text-4xl tracking-wide text-(--wwf-ocean-deep)">
                      Quiz Completed!
                    </h3>
                    <p className="mt-3">
                      Results to be declared on 22nd september so all the
                      answers will be revealed on that day itself
                    </p>
                  </div>
                </div>
              ) : nextLevel ? (
                <div className="flex flex-col items-center">
                  {user?.role === "teacher" ||
                  user?.role === "admin" ||
                  user?.role === "state_admin" ? (
                    <div className="flex w-full max-w-sm cursor-not-allowed flex-col items-center justify-center rounded-xl border-2 border-(--wwf-border) bg-slate-50 py-4 text-(--wwf-ocean)">
                      <span className="flex items-center gap-2 text-sm font-black tracking-widest uppercase">
                        <ShieldAlert size={16} /> Teacher View
                      </span>
                    </div>
                  ) : (
                    <button
                      onClick={() =>
                        window.location.assign(
                          `${import.meta.env.BASE_URL}play/game?levelId=${nextLevel.id}`
                        )
                      }
                      className="btn-wwf-secondary group flex w-full max-w-lg items-center justify-center gap-4 rounded-2xl py-6 text-2xl font-black tracking-wide uppercase shadow-xl transition-all hover:scale-[1.03] active:scale-95 md:py-7 md:text-4xl"
                    >
                      Play Now
                      <Play className="h-8 w-8 fill-current transition-transform md:h-10 md:w-10 group-hover:translate-x-1" />
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Lock className="mb-3 h-10 w-10 text-slate-400" />
                  <h3 className="font-wwf text-xl text-slate-500">
                    More Levels Coming Soon
                  </h3>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* DASHBOARD LIST SECTION REMAINS THE SAME */}
      {user && levels.length > 0 && (
        <div className="mx-auto mb-24 w-full max-w-4xl px-4 sm:px-10 lg:px-0">
          <div className="mb-6 flex flex-wrap items-center gap-3 border-b-2 border-slate-100 pb-3">
            <ListOrdered size={26} className="text-(--wwf-coral)" />
            <h3 className="font-wwf text-2xl text-(--wwf-ocean-deep)">
              My Dashboard
            </h3>
          </div>

          <div className="flex flex-col gap-3">
            {levels.map((level) => {
              const isCompleted = level.is_completed
              const isCurrent = nextLevel?.id === level.id
              const isLocked = level.is_locked && !isCurrent

              return (
                <div
                  key={level.id}
                  className={`flex flex-col justify-between gap-4 rounded-[1.25rem] border-2 p-4 transition-all sm:flex-row sm:items-center ${
                    isCompleted
                      ? "border-(--wwf-teal)/30 bg-(--wwf-sea-green)/5"
                      : isCurrent
                        ? "scale-[1.01] border-(--wwf-ocean-deep) bg-white shadow-xl"
                        : "border-slate-100 bg-slate-50 opacity-80 hover:opacity-100"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${isCompleted ? "bg-(--wwf-ocean-deep) text-white shadow-lg" : isCurrent ? "bg-(--wwf-ocean-deep) text-white shadow-lg" : "bg-slate-200 text-slate-400"}`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 size={20} />
                      ) : isCurrent ? (
                        <Play size={20} className="ml-0.5 fill-current" />
                      ) : (
                        <Lock size={18} />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        {/* <span className="text-[10px] font-black tracking-widest text-(--wwf-ocean-light) uppercase">
                          Level {level.level_number}
                        </span> */}
                        {isCurrent && (
                          <span className="animate-pulse rounded bg-(--wwf-coral) px-2 py-0.5 text-[9px] font-black tracking-widest text-white uppercase shadow-sm">
                            Up Next
                          </span>
                        )}
                      </div>
                      <h4
                        className={`mt-0.5 font-wwf text-lg md:text-xl ${isLocked ? "text-slate-500" : "text-(--wwf-ocean-deep)"}`}
                      >
                        {level.title}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center border-t border-slate-100 pt-3 sm:justify-end sm:border-0 sm:pt-0">
                    {isCompleted ? (
                      <div className="flex flex-col items-stretch gap-4 max-sm:w-full sm:flex-row sm:items-center">
                        {level.score !== null && (
                          <div className="flex flex-col justify-center sm:items-end">
                            <div className="flex items-center gap-1.5 text-sm font-bold text-(--wwf-ocean-deep)">
                              <Target
                                size={16}
                                className="text-(--wwf-coral)"
                              />
                              {level.score} Pts
                            </div>
                            {level.completed_at && (
                              <span className="mt-0.5 text-[10px] font-bold tracking-widest text-(--wwf-ocean-light) uppercase">
                                {new Date(
                                  level.completed_at
                                ).toLocaleDateString(undefined, {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </span>
                            )}
                          </div>
                        )}
                        <span className="flex items-center gap-1.5 rounded-full bg-(--wwf-octopus) px-3 py-1.5 text-sm font-bold text-white">
                          <CheckCircle2 size={16} />
                          Completed
                        </span>
                      </div>
                    ) : isCurrent ? (
                      user?.role === "teacher" ||
                      user?.role === "admin" ||
                      user?.role === "state_admin" ? (
                        <span className="text-sm font-bold text-(--wwf-ocean-deep)">
                          Ready
                        </span>
                      ) : (
                        <button
                          onClick={() =>
                            window.location.assign(
                              user
                                ? `${import.meta.env.BASE_URL}play/game?levelId=${level.id}`
                                : `${import.meta.env.BASE_URL}login`
                            )
                          }
                          className="btn-wwf-primary flex w-full items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-base font-black shadow-md sm:w-auto md:text-lg"
                        >
                          Play Now <Play size={18} className="fill-current" />
                        </button>
                      )
                    ) : (
                      <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-400">
                        {level.unlocks_at
                          ? `Unlocks ${new Date(level.unlocks_at).toLocaleDateString()}`
                          : "Locked"}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export function LevelSelector() {
  return (
    <QueryProvider>
      <LevelSelectorContent />
    </QueryProvider>
  )
}
