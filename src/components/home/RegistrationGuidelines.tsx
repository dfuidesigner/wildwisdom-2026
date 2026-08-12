"use client"

import * as React from "react"
import AnimatedStarfish from "./AnimatedStarfish"

interface RegistrationGuidelinesProps {
  baseUrl?: string
}

export function RegistrationGuidelines({
  baseUrl = "/",
}: RegistrationGuidelinesProps) {
  const guidelines = [
    {
      id: 1,
      icon: "re-i (7).webp",
      text: (
        <>
          <strong className="text-orange text-lg md:text-xl">
            FREE
            <br />
            Registration
          </strong>
        </>
      ),
    },
    {
      id: 2,
      icon: "re-i (6).webp",
      text: (
        <>
          Minimum 50
          <br />
          <strong>students</strong> per school
        </>
      ),
    },
    {
      id: 3,
      icon: "re-i (5).webp",
      text: (
        <>
          Open to students
          <br />
          from <strong>Classes 6–9</strong>
        </>
      ),
    },
    {
      id: 4,
      icon: "re-i (1).webp",
      text: (
        <>
          1 Teacher Coordinator
          <br />
          per school <strong>(mandatory)</strong>
        </>
      ),
    },
    {
      id: 5,
      icon: "re-i (2).webp",
      text: (
        <>
          Last date to register
          <br />
          is <strong>15th August, 2026</strong>
        </>
      ),
    },
    {
      id: 6,
      icon: "re-i (3).webp",
      text: (
        <>
          <strong>E-certificates</strong> for
          <br />
          all participating
          <br />
          students
        </>
      ),
    },
    {
      id: 7,
      icon: "re-i (4).webp",
      text: (
        <>
          <strong>Certificate of</strong>
          <br />
          <strong>Recognition</strong> for Teacher
          <br />
          Coordinator (1 per school)
        </>
      ),
    },
  ]

  return (
    <div className="mt-20 flex flex-col items-center justify-center gap-10">
      <h2 className="mb-3 font-wwf text-4xl tracking-wider text-white uppercase md:text-[54px]">
        Key Details
      </h2>

      <div className="relative mx-auto flex w-full max-w-275 flex-wrap justify-center gap-4 md:gap-6">
        <div className="pointer-events-none absolute top-0 right-0 rotate-15 max-[992px]:overflow-hidden md:top-0 md:-right-6">
          <AnimatedStarfish />
        </div>

        {guidelines.map((item) => (
          <div
            key={item.id}
            className="guideline-card flex w-full flex-col items-center justify-start rounded-3xl py-6 transition-transform duration-300 hover:-translate-y-1 hover:bg-[#004A6B]/40 hover:shadow-lg max-[1281px]:bg-[var(--wwf-ocean-deep)]/60 max-[1281px]:backdrop-blur-sm sm:w-[calc(50%-1rem)] md:w-[calc(33.333%-1rem)] lg:w-60"
          >
            <div className="mb-5 flex h-16 w-16 items-center justify-center">
              <img
                src={`${baseUrl}images/${item.icon}`}
                alt="Guideline Icon"
                className="h-full w-full object-contain drop-shadow-md"
                loading="lazy"
                height="100"
                width="100"
              />
            </div>
            <p className="text-center text-sm leading-relaxed font-medium text-white md:text-lg">
              {item.text}
            </p>
          </div>
        ))}
      </div>

      <a
        href={`${baseUrl}register/school`}
        className="group bg-orange hover:bg-coral relative inline-flex items-center overflow-hidden rounded-full border border-solid border-black px-5 py-2 font-wwf text-2xl tracking-wide text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:scale-95"
      >
        <div className="absolute inset-0 flex justify-center">
          <div className="animate-shimmer h-full w-1/4 -skew-x-12 bg-linear-to-r from-transparent via-white/40 to-transparent"></div>
        </div>

        <span className="wwf-span-font relative z-10"> REGISTER NOW </span>
      </a>
    </div>
  )
}
