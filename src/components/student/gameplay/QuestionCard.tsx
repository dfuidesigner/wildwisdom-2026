import type { Option, Question } from "@/types/admin"

interface QuestionCardProps {
  question: Question
  selectedOptionId: number | undefined
  onSelect: (optionId: number) => void
}

const backendUrl =
  import.meta.env.PROD === true
    ? import.meta.env.PUBLIC_BACKEND_URL
    : "http://localhost:8000"

const getStorageUrl = (path: string) => {
  if (!path) return ""
  const cleanPath = path.startsWith("/") ? path.slice(1) : path
  return `${backendUrl}/${cleanPath}`
}

export function QuestionCard({
  question,
  selectedOptionId,
  onSelect,
}: QuestionCardProps) {
  if (!question) return null

  return (
    <div className="flex animate-in flex-col items-center duration-500 fade-in slide-in-from-right-4">
      {question.image_url && (
        <div className="mb-8 flex w-full justify-center">
          <div className="flex flex-col items-center gap-1.5">
            <img
              src={getStorageUrl(question.image_url)}
              alt="Reference"
              className="max-h-64 w-auto rounded-xl border border-slate-200 object-contain shadow-md"
            />
            {question.image_copyright_url && (
              <a
                href={question.image_copyright_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-slate-400 underline decoration-dotted hover:text-slate-600"
              >
                Image source
              </a>
            )}
          </div>
        </div>
      )}

      <h2 className="mb-10 max-w-3xl text-center font-wwf text-3xl leading-tight text-(--wwf-ocean-deep) md:text-4xl">
        {question.content}
      </h2>

      <div className="grid w-full max-w-3xl gap-4 sm:grid-cols-2">
        {question?.options?.map((option: Option, index: number) => {
          const isSelected = selectedOptionId === option.id
          const optionLetter = ["A", "B", "C", "D"][index]

          return (
            <button
              key={option.id}
              onClick={() => onSelect(option.id)}
              className={`group flex min-h-20 w-full items-center rounded-2xl border-2 px-5 py-3 transition-all active:scale-[0.98] ${
                isSelected
                  ? "border-(--wwf-sea-green) bg-(--wwf-sea-green)/5"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                  isSelected
                    ? "bg-(--wwf-sea-green) text-(--wwf-ocean-deep)"
                    : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                }`}
              >
                {optionLetter}
              </div>

              <div className="ml-4 flex-1 text-left">
                {question.type === "text_image" ? (
                  <img
                    src={getStorageUrl(option.content)}
                    alt={`Option ${optionLetter}`}
                    className="max-h-24 rounded-lg object-contain"
                  />
                ) : (
                  <span
                    className={`text-base font-bold ${isSelected ? "text-(--wwf-ocean-deep)" : "text-slate-600"}`}
                  >
                    {option.content}
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
