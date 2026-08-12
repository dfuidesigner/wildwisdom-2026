import { useState, useEffect, useRef, useCallback } from "react"
import { useQuery, useMutation } from "@tanstack/react-query"
import api from "@/lib/axios"
import type { AxiosError } from "axios"
import type { ValidationErrorResponse } from "@/types/api"

export function useGameplayEngine(levelId: string | null) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [abandonDialogOpen, setAbandonDialogOpen] = useState(false)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)

  const isSubmittingRef = useRef(false)
  const PLATFORM_SLUG = import.meta.env.PUBLIC_PLATFORM_SLUG || "wildwisdom"

  const isTouchDevice =
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0)

  const MAX_FOCUS_VIOLATIONS = 5
  const [focusViolationCount, setFocusViolationCount] = useState(0)
  const [focusViolationMessage, setFocusViolationMessage] = useState<
    string | null
  >(null)
  const lastViolationAtRef = useRef(0)
  const focusViolationCountRef = useRef(0)
  const didEnterFullscreenRef = useRef(false)

  const {
    data: levelData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["playQuestions", levelId, PLATFORM_SLUG],
    queryFn: async () => {
      const response = await api.get(
        `/play/${PLATFORM_SLUG}/levels/${levelId}/questions`
      )
      return response.data.data
    },
    enabled: !!levelId,
    staleTime: Infinity,
    retry: false,
  })

  const submitMutation = useMutation({
    mutationFn: async () => {
      const formattedAnswers = Object.entries(answers).map(([qId, oId]) => ({
        question_id: parseInt(qId),
        option_id: oId,
      }))
      return await api.post(`/play/${PLATFORM_SLUG}/levels/${levelId}/submit`, {
        answers: formattedAnswers,
      })
    },
    onSuccess: (response) => {
      isSubmittingRef.current = true
      const score = response.data.data.score_achieved
      const isCompleted = response.data.data.is_completed
      const nextLevelId = response.data.data.next_level_id
      const base = import.meta.env.BASE_URL
      let redirectUrl = `${base}play/leaderboards?success=true&score=${score}&levelId=${levelId}&completed=${isCompleted}`
      if (nextLevelId) {
        redirectUrl += `&nextLevelId=${nextLevelId}`
      }

      window.location.assign(redirectUrl)
    },
    onError: (err: AxiosError<ValidationErrorResponse>) => {
      isSubmittingRef.current = false
      setSubmitError(
        err.response?.data?.message || "Failed to submit. Please try again."
      )
      setAbandonDialogOpen(false)
    },
  })

  // 3. Browser Traps (Back button & Refresh)
  useEffect(() => {
    window.history.pushState(null, "", window.location.href)
    const handlePopState = () => {
      if (!isSubmittingRef.current) {
        window.history.pushState(null, "", window.location.href)
        setAbandonDialogOpen(true)
      }
    }
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isSubmittingRef.current) {
        e.preventDefault()
        e.returnValue =
          "Your timer will keep ticking. Are you sure you want to leave?"
      }
    }
    window.addEventListener("popstate", handlePopState)
    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => {
      window.removeEventListener("popstate", handlePopState)
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [])

  const registerFocusViolation = useCallback(
    (reason: string) => {
      if (isSubmittingRef.current) return

      const now = Date.now()

      if (now - lastViolationAtRef.current < 1500) return

      lastViolationAtRef.current = now

      const next = focusViolationCountRef.current + 1

      focusViolationCountRef.current = next
      setFocusViolationCount(next)

      if (next > MAX_FOCUS_VIOLATIONS) {
        setFocusViolationMessage(
          "Focus rule broken. Your quiz is being submitted."
        )

        isSubmittingRef.current = true
        submitMutation.mutate()

        return
      }

      setFocusViolationMessage(
        `${reason}. Warning ${next}/${MAX_FOCUS_VIOLATIONS}. Please stay on the quiz screen.`
      )
    },
    [submitMutation]
  )

  const startTimer = useCallback(() => {
    setHasStarted(true)
  }, [])

  // useEffect(() => {
  //   const handleVisibilityChange = () => {
  //     if (document.hidden) {
  //       registerFocusViolation("You switched away from the quiz tab")
  //     }
  //   }

  //   const handleBlur = () => {
  //     registerFocusViolation("Quiz window lost focus")
  //   }

  //   const handleFullscreenChange = () => {
  //     if (!document.fullscreenElement) {
  //       registerFocusViolation("Fullscreen mode was exited")
  //     }
  //   }

  //   document.addEventListener("visibilitychange", handleVisibilityChange)
  //   window.addEventListener("blur", handleBlur)
  //   document.addEventListener("fullscreenchange", handleFullscreenChange)

  //   return () => {
  //     document.removeEventListener("visibilitychange", handleVisibilityChange)
  //     window.removeEventListener("blur", handleBlur)
  //     document.removeEventListener("fullscreenchange", handleFullscreenChange)
  //   }
  // }, [registerFocusViolation])

  useEffect(() => {
    if (!hasStarted) return

    const handleVisibilityChange = () => {
      if (document.hidden) {
        registerFocusViolation("You switched tabs or apps")
      }
    }

    const handleBlur = () => {
      registerFocusViolation("Quiz window lost focus")
    }

    const handleFullscreenChange = () => {
      // Only count exiting fullscreen if fullscreen was actually entered
      if (didEnterFullscreenRef.current && !document.fullscreenElement) {
        registerFocusViolation("You exited fullscreen")
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    document.addEventListener("fullscreenchange", handleFullscreenChange)

    // Desktop only
    if (!isTouchDevice) {
      window.addEventListener("blur", handleBlur)
    }

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)

      document.removeEventListener("fullscreenchange", handleFullscreenChange)

      if (!isTouchDevice) {
        window.removeEventListener("blur", handleBlur)
      }
    }
  }, [hasStarted, isTouchDevice, registerFocusViolation])

  // 4. Timer Logic
  const timeLeft =
    levelData?.time_limit_seconds != null
      ? Math.max(0, levelData.time_limit_seconds - elapsedSeconds)
      : null

  useEffect(() => {
    if (
      !hasStarted ||
      levelData?.time_limit_seconds == null ||
      isSubmittingRef.current
    ) {
      return
    }

    const timerId = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(timerId)
  }, [hasStarted, levelData?.time_limit_seconds])

  useEffect(() => {
    if (timeLeft === 0 && !isSubmittingRef.current) {
      isSubmittingRef.current = true
      submitMutation.mutate()
    }
  }, [timeLeft, submitMutation])

  const handleAbandon = () => {
    isSubmittingRef.current = true
    submitMutation.mutate()
  }

  const formatTime = (rawSeconds: number) => {
    const cleanSeconds = Math.round(rawSeconds)

    const m = Math.floor(cleanSeconds / 60)
      .toString()
      .padStart(2, "0")

    const s = (cleanSeconds % 60).toString().padStart(2, "0")

    return `${m}:${s}`
  }

  const questions = levelData?.questions || []
  const currentQuestion = questions[currentIndex]
  const isLastQuestion = currentIndex === questions.length - 1
  const hasAnsweredCurrent = currentQuestion
    ? !!answers[currentQuestion.id]
    : false
  const progress =
    questions.length > 0
      ? Math.round((currentIndex / questions.length) * 100)
      : 0

  return {
    state: {
      isLoading,
      isError,
      error,
      questions,
      currentQuestion,
      currentIndex,
      isLastQuestion,
      hasAnsweredCurrent,
      progress,
      answers,
      submitError,
      abandonDialogOpen,
      timeLeft,
      isSubmitting: submitMutation.isPending,
      focusViolationCount,
      focusViolationMessage,
      maxFocusViolations: MAX_FOCUS_VIOLATIONS,
    },
    actions: {
      setAnswers,
      setCurrentIndex,
      setAbandonDialogOpen,
      handleAbandon,
      formatTime,
      enterFocusMode: async () => {
        if (!document.fullscreenElement) {
          try {
            await document.documentElement.requestFullscreen()
            didEnterFullscreenRef.current = true
          } catch {
            // Browser blocked fullscreen (iOS Safari etc.)
            // Do not mark fullscreen as entered.
          }
        }
      },
      submitLevel: () => {
        isSubmittingRef.current = true
        submitMutation.mutate()
      },
      startTimer,
    },
  }
}
