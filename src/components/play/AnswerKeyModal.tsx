// src/components/play/AnswerKeyModal.tsx

import { useQuery } from "@tanstack/react-query"
import { CheckCircle2, Loader2, X, XCircle } from "lucide-react"
import api from "@/lib/axios"
import type { Question } from "@/types/admin"

interface AnswerOption {
  id: number
  question_id: number
  content: string
  image_url?: string | null
  is_correct?: boolean
}

interface AnswerQuestion extends Omit<Question, "options"> {
  image_url: string | null
  options?: AnswerOption[]
  selected_option_id?: number | null
  trivia?: string | null
}

interface Props {
  levelId: string | number | null
  open: boolean
  onClose: () => void
}

const backendUrl =
  import.meta.env.PROD === true
    ? import.meta.env.PUBLIC_BACKEND_URL
    : "http://localhost:8000"

const getStorageUrl = (path?: string | null) => {
  if (!path) return ""

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path
  }

  const cleanPath = path.startsWith("/") ? path.slice(1) : path
  return `${backendUrl}/${cleanPath.startsWith("storage/") ? cleanPath : `storage/${cleanPath}`}`
}

export function AnswerKeyModal({ levelId, open, onClose }: Props) {
  const PLATFORM_SLUG = import.meta.env.PUBLIC_PLATFORM_SLUG || "wildwisdom"

  const { data, isLoading, isError } = useQuery({
    queryKey: ["levelAnswers", PLATFORM_SLUG, levelId],
    queryFn: async () => {
      const response = await api.get(
        `/play/${PLATFORM_SLUG}/levels/${levelId}/answers`
      )

      return response.data.data as {
        level: {
          id: number
          level_number: number
          title: string
          score: number
        }
        questions: AnswerQuestion[]
      }
    },
    enabled: open && !!levelId,
  })

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 px-4 py-8">
      <div className="max-h-[75vh] lg:max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h3 className="font-wwf text-3xl tracking-wide text-[#003140]">
              Level Answers
            </h3>
            {data?.level && (
              <p className="text-sm font-bold text-slate-500">
                Level {data.level.level_number}: {data.level.title}
              </p>
            )}
          </div>

          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
          >
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[72vh] overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-slate-500">
              <Loader2 className="mr-2 animate-spin" size={20} />
              Loading answers...
            </div>
          ) : isError ? (
            <div className="py-16 text-center font-bold text-red-500">
              Answers are available only after completing this level.
            </div>
          ) : (
            <div className="space-y-6">
              {data?.questions.map((question, index) => (
                <div
                  key={question.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                >
                  <div className="mb-4 flex gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#003140] text-sm font-black text-white">
                      {index + 1}
                    </span>

                    <div className="flex-1">
                      <h4 className="text-base font-black text-[#003140]">
                        {question.content}
                      </h4>

                      {question.image_url && (
                        <img
                          src={getStorageUrl(question.image_url)}
                          alt="Question reference"
                          className="mt-4 max-h-64 rounded-xl border border-slate-200 bg-white object-contain shadow-sm"
                        />
                      )}
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {question.options?.map((option) => {
                      const optionImageUrl = option.image_url || option.content
                      const isCorrect = !!option.is_correct
                      const isUserSelection =
                        option.id === question.selected_option_id

                      const styles = isCorrect
                        ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                        : isUserSelection
                          ? "border-red-300 bg-red-50 text-red-700"
                          : "border-slate-200 bg-white text-slate-500"

                      return (
                        <div
                          key={option.id}
                          className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-bold ${styles}`}
                        >
                          {isCorrect ? (
                            <CheckCircle2 size={18} className="shrink-0" />
                          ) : isUserSelection ? (
                            <XCircle size={18} className="shrink-0" />
                          ) : null}

                          {question.type === "text_image" ? (
                            <img
                              src={getStorageUrl(optionImageUrl)}
                              alt="Answer option"
                              className="max-h-32 w-full rounded-lg object-contain"
                            />
                          ) : (
                            <span>{option.content}</span>
                          )}

                          {isUserSelection && (
                            <span className="ml-auto shrink-0 rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-black tracking-wide uppercase">
                              Your answer
                            </span>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {!question.selected_option_id && (
                    <p className="mt-3 text-xs font-bold text-amber-600">
                      You didn't answer this question.
                    </p>
                  )}
                  {question.trivia && (
                    <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                      <span className="text-lg leading-none">💡</span>
                      <p className="text-sm font-semibold text-amber-800">
                        {question.trivia}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
