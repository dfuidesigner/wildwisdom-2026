import { useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import api from "@/lib/axios"
import { QueryProvider } from "@/components/providers/QueryProvider"
import {
  Gamepad2,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldAlert,
  Ghost,
  PlayCircle,
  Layers,
  Trophy,
  Loader2,
} from "lucide-react"

interface Quiz {
  id: number
  title: string
  slug: string
  description: string
  total_levels: number
  levels_count: number
}

function QuizSelectionContent() {
  const {
    data: quizzes,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["studentQuizzes"],
    queryFn: async () => {
      const response = await api.get<{ data: Quiz[] }>("/play/quizzes")
      return response.data.data
    },
  })

  useEffect(() => {
    if (quizzes && quizzes.length === 1) {
      window.location.replace(
        `${import.meta.env.BASE_URL}play/levels?quiz=${quizzes[0].slug}`
      )
    }
  }, [quizzes])

  const handlePlayClick = (slug: string) => {
    window.location.assign(
      `${import.meta.env.BASE_URL}play/levels?quiz=${slug}`
    )
  }

  if (isLoading || (quizzes && quizzes.length === 1)) {
    return (
      <div className="flex h-96 items-center justify-center rounded-[2rem] border-2 border-dashed border-(--wwf-border) bg-(--wwf-white)">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-(--wwf-sea-green)" />
          <p className="font-wwf text-xl text-(--wwf-ocean)">
            Loading Arena...
          </p>
        </div>
      </div>
    )
  }

  if (isError || !quizzes) {
    return (
      <div className="mx-auto mt-20 flex max-w-lg flex-col items-center justify-center rounded-[2rem] border-2 border-(--wwf-octopus) bg-rose-50 py-16 text-center">
        <ShieldAlert className="mb-4 h-16 w-16 text-(--wwf-octopus)" />
        <h3 className="font-wwf text-3xl text-(--wwf-ocean-deep)">
          System Glitch
        </h3>
        <p className="mt-2 font-medium text-(--wwf-octopus)">
          We couldn't reach the habitat servers.
        </p>
      </div>
    )
  }

  if (quizzes.length === 0) {
    return (
      <div className="mx-auto mt-20 flex flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-(--wwf-ocean-light) bg-(--wwf-white) py-24 text-center">
        <Ghost className="h-16 w-16 text-(--wwf-ocean-light)" />
        <h3 className="mt-4 font-wwf text-3xl text-(--wwf-ocean-deep)">
          No Challenges Available
        </h3>
        <p className="mt-2 font-medium text-(--wwf-ocean)">
          The animals are resting. Check back soon!
        </p>
      </div>
    )
  }

  const featuredQuiz = quizzes[0]
  const regularQuizzes = quizzes.slice(1)

  return (
    <>
      {/* Dynamic Page Header */}
      <div className="relative z-10 mb-14 flex flex-col items-center text-center md:items-start md:text-left">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-(--wwf-sea-green) bg-(--wwf-sea-green)/10 px-4 py-1.5 text-xs font-bold tracking-widest text-(--wwf-ocean-deep) uppercase backdrop-blur-md">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-(--wwf-sea-green) opacity-75"></span>
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-(--wwf-sea-green)"></span>
          </span>
          Live Challenges Arena
        </div>

        <h1 className="font-wwf text-6xl leading-none font-normal tracking-tight text-(--wwf-ocean-deep) sm:text-7xl md:text-8xl">
          Choose Your <br className="hidden md:block" />
          <span className="text-coral">Next Challenge</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed font-medium text-(--wwf-ocean) md:text-xl">
          Enter the arena. Master new concepts, rack up points, and dominate the
          leaderboard. What are you conquering today?
        </p>
      </div>

      <div className="space-y-16">
        {/* FEATURED CHALLENGE */}
        <div className="bg-ocean-gradient group relative overflow-hidden rounded-[2.5rem] p-8 text-primary shadow-2xl transition-all hover:shadow-(--wwf-sea-green)/20 md:p-14">
          <Trophy className="absolute -right-10 -bottom-10 h-64 w-64 rotate-12 text-white/5 transition-transform group-hover:scale-110 group-hover:rotate-0" />

          <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-(--wwf-coral)/20 px-4 py-1.5 text-xs font-black tracking-[0.2em] text-(--wwf-starfish) uppercase ring-1 ring-(--wwf-coral)/30 backdrop-blur-md">
                <Sparkles size={14} className="fill-(--wwf-starfish)" /> Primary
                Objective
              </div>
              <h2 className="font-wwf text-5xl leading-none font-normal tracking-tight sm:text-7xl">
                {featuredQuiz.title}
              </h2>
              <p className="mt-6 text-lg font-medium text-secondary md:text-xl md:leading-relaxed">
                {featuredQuiz.description ||
                  "Master the wilderness in this elite challenge."}
              </p>

              <div className="mt-8 flex items-center gap-6">
                <div className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 font-mono text-sm font-bold text-(--wwf-sea-green) ring-1 ring-white/20">
                  <Layers size={18} /> {featuredQuiz.levels_count} STAGES
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 font-mono text-sm font-bold text-(--wwf-orange) ring-1 ring-white/20">
                  <Zap size={18} fill="currentColor" /> HIGH XP
                </div>
              </div>
            </div>

            <div className="shrink-0">
              <button
                onClick={() => handlePlayClick(featuredQuiz.slug)}
                className="btn-wwf-primary group flex w-full items-center justify-center gap-3 px-10 py-5 text-xl font-black shadow-xl hover:-translate-y-1 md:w-auto"
              >
                Start Playing
                <PlayCircle className="h-7 w-7 transition-transform group-hover:scale-110" />
              </button>
            </div>
          </div>
        </div>

        {regularQuizzes.length > 0 && (
          <div className="pb-12">
            <h3 className="mb-8 flex items-center gap-3 font-wwf text-3xl font-normal tracking-tight text-(--wwf-ocean-deep)">
              <Gamepad2 className="h-8 w-8 text-(--wwf-coral)" /> More
              Challenges
            </h3>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {regularQuizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="card-wwf group relative flex flex-col justify-between overflow-hidden p-8 shadow-sm transition-all hover:-translate-y-2 hover:border-(--wwf-sea-green) hover:shadow-(--wwf-sea-green)/20 hover:shadow-2xl"
                >
                  <div className="relative z-10">
                    <div className="mb-6 flex items-center justify-between">
                      <div className="inline-flex items-center gap-1.5 rounded-lg bg-(--wwf-ocean)/30 px-3 py-1 text-[10px] font-black tracking-widest text-(--wwf-sea-green) uppercase">
                        <Layers size={12} /> {quiz.levels_count} Levels
                      </div>
                    </div>
                    <h4 className="font-wwf text-3xl leading-none font-normal transition-colors group-hover:text-(--wwf-coral)">
                      {quiz.title}
                    </h4>
                    <p className="mt-4 line-clamp-3 text-sm leading-relaxed font-medium text-secondary">
                      {quiz.description ||
                        "Unlock new knowledge in this wildlife category."}
                    </p>
                  </div>
                  <div className="relative z-10 mt-10">
                    <button
                      onClick={() => handlePlayClick(quiz.slug)}
                      className="btn-wwf-secondary flex w-full items-center justify-center gap-2 hover:bg-(--wwf-coral) hover:text-white"
                    >
                      Enter Arena{" "}
                      <ArrowRight
                        size={18}
                        strokeWidth={2.5}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export function QuizSelection() {
  return (
    <QueryProvider>
      <QuizSelectionContent />
    </QueryProvider>
  )
}
