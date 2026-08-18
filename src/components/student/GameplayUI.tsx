import { QueryProvider } from "@/components/providers/QueryProvider"
import { useGameplayEngine } from "@/hooks/useGameplayEngine"
import { useAuth } from "@/hooks/useAuth"
import { QuestionCard } from "./gameplay/QuestionCard"
import { useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Timer,
  AlertCircle,
  X,
  Loader2,
  ShieldAlert,
  Target,
  AlertTriangle,
} from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { ApiError } from "@/types/api"

function GameplayContent() {
  const { user } = useAuth()
  const questionTopRef = useRef<HTMLDivElement>(null)

  const params =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : null
  const levelId = params?.get("levelId") ?? null

  const { state, actions } = useGameplayEngine(levelId)

  useEffect(() => {
    questionTopRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }, [state.currentIndex])
  const [hasStartedFocusMode, setHasStartedFocusMode] = useState(false)
  if (
    user?.role === "teacher" ||
    user?.role === "admin" ||
    user?.role === "state_admin"
  ) {
    return (
      <div className="mx-auto mt-20 flex max-w-lg flex-col items-center justify-center rounded-[2.5rem] border border-(--wwf-border) bg-white p-12 text-center shadow-lg">
        <ShieldAlert
          className="mb-6 h-16 w-16 text-(--wwf-ocean-light)"
          strokeWidth={1.5}
        />
        <h3 className="mb-2 font-wwf text-4xl text-(--wwf-ocean-deep)">
          Restricted Area
        </h3>
        <p className="font-medium text-(--wwf-ocean)">
          Gameplay is restricted to students to ensure fair leaderboards.
        </p>
        <button
          className="btn-wwf-primary mt-8 flex w-full items-center justify-center font-bold"
          onClick={() =>
            window.location.assign(`${import.meta.env.BASE_URL}play/levels`)
          }
        >
          Return to Home
        </button>
      </div>
    )
  }

  if (!levelId) return null

  if (state.isLoading)
    return (
      <div className="mx-auto mt-10 h-150 w-full max-w-4xl animate-pulse rounded-3xl border border-slate-200 bg-white shadow-sm"></div>
    )

  if (state.isError) {
    const errorMsg =
      (state.error as ApiError).response?.data?.message ||
      "Could not load questions."
    return (
      <div className="mx-auto mt-20 flex max-w-lg flex-col items-center justify-center rounded-3xl border-2 border-red-500 bg-white p-10 text-center shadow-lg">
        <AlertCircle className="mb-4 h-16 w-16 text-red-500" />
        <h3 className="mb-2 text-2xl font-black text-slate-900">
          Access Denied
        </h3>
        <p className="font-medium text-slate-600">{errorMsg}</p>
        <Button
          className="mt-8 bg-slate-900 font-bold text-white"
          onClick={() =>
            window.location.assign(`${import.meta.env.BASE_URL}play/levels`)
          }
        >
          Return to Map
        </Button>
      </div>
    )
  }

  if (state.questions.length === 0)
    return (
      <div className="py-12 text-center font-medium text-slate-500">
        No questions found.
      </div>
    )

  if (!hasStartedFocusMode) {
    return (
      <div className="mx-auto mt-20 flex max-w-lg flex-col items-center justify-center rounded-[2.5rem] border border-(--wwf-border) bg-white p-10 text-center shadow-lg">
        <h3 className="mb-3 font-wwf text-4xl text-(--wwf-ocean-deep)">
          Ready to Start?
        </h3>

        <p className="mb-8 font-medium text-(--wwf-ocean)">
          The quiz will open in fullscreen mode. Please stay on this tab until
          you submit.
        </p>

        <button
          className="btn-wwf-primary flex w-full items-center justify-center rounded-xl px-6 py-4 font-bold"
          onClick={async () => {
            await actions.enterFocusMode()
            setHasStartedFocusMode(true)
            actions.startTimer()
          }}
        >
          Start Quiz
        </button>
      </div>
    )
  }

  return (
    <div className="relative z-4 mx-auto flex max-w-4xl justify-center pt-4 pb-24">
      <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg max-[992px]:mx-5">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => actions.setAbandonDialogOpen(true)}
              className="text-slate-400 transition-colors hover:text-slate-800"
            >
              <X size={20} strokeWidth={2.5} />
            </button>
            <h3 className="hidden text-sm font-bold text-slate-700 sm:block">
              Stage Assessment
            </h3>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden animate-in items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600 fade-in slide-in-from-top-2 sm:flex">
              <Target size={14} /> +{state.currentQuestion?.points || 10} Pts
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-200 text-sm font-black text-slate-700">
                {state.currentIndex + 1}
              </div>
              <span className="text-sm font-medium text-slate-500">
                of {state.questions.length}
              </span>
            </div>

            {state.timeLeft !== null && (
              <div
                className={`flex items-center gap-2 rounded-full px-4 py-1.5 font-mono text-sm font-bold transition-colors ${
                  state.timeLeft < 60
                    ? "border border-red-200 bg-red-50 text-red-600"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                <Timer
                  size={16}
                  className={state.timeLeft < 60 ? "animate-pulse" : ""}
                />
                {actions.formatTime(state.timeLeft)}
              </div>
            )}
          </div>
        </div>

        <div className="h-1 w-full bg-slate-100">
          <div
            className="h-full bg-(--wwf-sea-green) transition-all duration-500 ease-out"
            style={{
              width: `${((state.currentIndex + 1) / state.questions.length) * 100}%`,
            }}
          />
        </div>

        <div ref={questionTopRef} className="scroll-mt-24 p-6 sm:p-10">
          {state.focusViolationMessage && (
            <div className="sticky top-4 z-20 mb-6 flex items-center gap-3 rounded-2xl border-2 border-red-700 bg-red-600 px-5 py-4 text-white shadow-xl">
              <AlertTriangle size={26} className="shrink-0 animate-pulse" />
              <p className="text-base leading-snug font-black">
                {state.focusViolationMessage}
              </p>
            </div>
          )}
          <QuestionCard
            question={state.currentQuestion}
            selectedOptionId={state.answers[state.currentQuestion.id]}
            onSelect={(id) =>
              actions.setAnswers((p) => ({
                ...p,
                [state.currentQuestion.id]: id,
              }))
            }
          />

          <div className="mt-10 flex flex-col items-center border-t border-slate-100 pt-8">
            <div className="mb-4 text-sm font-bold text-red-500">
              {state.submitError}
            </div>
            <button
              onClick={() =>
                state.isLastQuestion
                  ? actions.submitLevel()
                  : actions.setCurrentIndex((p) => p + 1)
              }
              disabled={!state.hasAnsweredCurrent || state.isSubmitting}
              className={`flex h-12 min-w-50 items-center justify-center rounded-full px-8 text-sm font-bold text-white transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 ${
                state.isLastQuestion && state.hasAnsweredCurrent
                  ? "bg-emerald-600 shadow-lg shadow-emerald-600/20 hover:bg-emerald-700"
                  : "bg-slate-800 shadow-md hover:bg-slate-900"
              }`}
            >
              {state.isSubmitting ? (
                <Loader2 className="animate-spin" size={18} />
              ) : state.isLastQuestion ? (
                "Submit Answers"
              ) : (
                "Next Question →"
              )}
            </button>
          </div>
        </div>
      </div>

      <AlertDialog
        open={state.abandonDialogOpen}
        onOpenChange={actions.setAbandonDialogOpen}
      >
        <AlertDialogContent className="rounded-3xl border-slate-200 shadow-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-black text-slate-900">
              Surrender Stage?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base font-medium text-slate-600">
              Are you sure you want to leave? Your timer will keep ticking, but
              you will receive points for the questions you have answered so
              far.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 gap-3">
            <AlertDialogCancel className="rounded-xl border-slate-200 font-bold text-slate-700">
              Return to Quiz
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={actions.handleAbandon}
              disabled={state.isSubmitting}
              className="rounded-xl bg-red-500 font-bold text-white hover:bg-red-600"
            >
              {state.isSubmitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Surrender Now"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export function GameplayUI() {
  return (
    <QueryProvider>
      <GameplayContent />
    </QueryProvider>
  )
}
