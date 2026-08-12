import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Level } from "@/pages/index.astro"

export function LevelModal({
  level,
  baseUrl,
}: {
  level: Level
  baseUrl: string
}) {
  return (
    <Dialog>
      <DialogTrigger className="group text-left transition-all duration-500 outline-none hover:-translate-y-2 active:scale-95">
        <div
          className={`flex w-full items-start justify-center gap-2 rounded-2xl p-3 transition-colors duration-300 sm:w-70 group-hover:bg-white/5 ${level.extraClasses || ""}`}
        >
          <img
            src={`${baseUrl}images/svgs/${level.icon}`}
            alt={`Level ${level.number}`}
            className="h-14 w-14 object-contain transition-all duration-500 sm:h-18 sm:w-18 xl:mr-4 group-hover:scale-110 group-hover:drop-shadow-[0_0_15px_rgba(160,245,255,0.6)]"
          />
          <span className="-mt-4 font-wwf text-[80px] leading-none text-white transition-all duration-500 [text-shadow:0_0_15px_#95DDEA,0_0_30px_#95DDEA] sm:-mt-5.75 sm:text-[100px] lg:text-[115px] group-hover:[text-shadow:0_0_20px_#95DDEA,0_0_40px_#95DDEA]">
            {level.number}
          </span>
          <div className="flex flex-col justify-center gap-1 sm:gap-2">
            <span className="group-hover:text-sea-green font-wwf text-lg leading-none text-white transition-colors duration-300 md:text-3xl">
              {level.title}
            </span>
            <div className="flex items-center gap-2 xl:-mt-1.5">
              <span className="font-wwf text-lg leading-none text-white md:text-3xl">
                LEVEL
              </span>
              <svg
                viewBox="0 0 34 34"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="relative top-1 h-5 w-5 transition-transform duration-500 md:h-8.5 md:w-8.5 group-hover:rotate-90"
              >
                <path
                  d="M16.76 0C7.51 0 0 7.51 0 16.76C0 26.01 7.51 33.52 16.76 33.52C26.01 33.52 33.52 26.01 33.52 16.76C33.52 7.51 26.02 0 16.76 0ZM12.52 24.61C12.52 16.38 12.52 17.16 12.52 8.92L24.87 16.76L12.52 24.6V24.61Z"
                  fill="#A0F5FF"
                />
              </svg>
            </div>
            <span className="text-[10px] font-semibold tracking-[0.15em] text-white/80 transition-colors duration-300 sm:text-[11.5px] group-hover:text-white">
              {level.type}
            </span>
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className="bg-ocean border-ocean-light w-[95vw] overflow-hidden rounded-3xl border-2 p-0 text-white shadow-[0_0_50px_rgba(0,49,64,0.8)] sm:max-w-3xl md:max-w-4xl lg:max-w-4xl">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="border-b-2 border-white/20 pb-3 font-wwf text-2xl text-white md:text-4xl">
            {level.modal.title} ({" "}
            {level.duration && (
              <span className="relative bottom-[2px] text-2xl font-medium tracking-[0.02em]">
                {level.duration}
              </span>
            )}
            )
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] px-6 pb-6">
          <div className="space-y-6 py-2 pr-4 text-[16px] leading-relaxed font-medium md:text-[18px]">
            {/* Who can participate */}
            <div>
              <strong className="text-sea-green mb-1 block text-lg font-bold md:text-xl">
                Who can participate?
              </strong>
              <p className="text-gray-100">{level.modal.who}</p>
            </div>

            {level.modal.how && level.modal.how.length > 0 && (
              <div>
                <strong className="text-sea-green mb-1 block text-lg font-bold md:text-xl">
                  How to participate?
                </strong>
                <ul className="ml-5 list-outside list-decimal space-y-2 text-gray-100">
                  {level.modal.how.map((step: string, i: number) => (
                    <li key={i} className="pl-1">
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {level.modal.where && (
              <div>
                <strong className="text-sea-green mb-1 block text-lg font-bold md:text-xl">
                  Where?
                </strong>
                <p className="text-gray-100">{level.modal.where}</p>
              </div>
            )}

            {/* Bonus (if exists) */}
            {level.modal.bonus && (
              <div className="bg-ocean-deep/40 border-sea-green/30 mt-4 rounded-2xl border p-5 backdrop-blur-sm">
                <strong className="text-sea-green mb-2 block text-lg font-bold md:text-xl">
                  {level.modal.bonus.title}
                </strong>
                <p className="text-gray-100">{level.modal.bonus.desc}</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
