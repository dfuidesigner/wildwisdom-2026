"use client"

import * as React from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

interface Reward {
  id: string
  title: string
  desc: string
  hasSlider?: boolean
  sliderImages?: string[]
}

const rewards: Reward[] = [
  {
    id: "item-1",
    title: "GRAND PRIZE - SIGNATURE WILD EXPERIENCE",
    desc: "Step out of the classroom and into the wild! Top teams securing 1st, 2nd and 3rd positions at the National level will win an exclusive, fully sponsored learning expedition to a premier wildlife landscape in India — an unforgettable experience of discovery, adventure, and conservation in action!",
    hasSlider: true,
    sliderImages: [
      "images/rewards/g21.webp",
      "images/rewards/g22.webp",
      "images/rewards/g23.webp",
      "images/rewards/g24.webp",
      "images/rewards/g25.webp",
      "images/rewards/g26.webp",
      "images/rewards/g27.webp",
      "images/rewards/g28.webp",
      "images/rewards/g29.webp",
    ],
  },
  {
    id: "item-2",
    title: "STATE, ZONAL & NATIONAL LEVEL AWARDS",
    desc: "Trophy for the Winning Team. Medals for 1st Runner-up, 2nd Runner-up, and Consolation Teams Certificates and exciting Wild Experience prizes",
    hasSlider: true,
    sliderImages: [
      "images/rewards/s1.webp",
      "images/rewards/s2.webp",
      "images/rewards/s3.webp",
      "images/rewards/s4.webp",
      "images/rewards/s5.webp",
      "images/rewards/p1.webp",
      "images/rewards/p2.webp",
      "images/rewards/p3.webp",
      "images/rewards/i1.webp",
      "images/rewards/i2.webp",
      "images/rewards/i3.webp",
      "images/rewards/i4.webp",
      "images/rewards/i5.webp",
      "images/rewards/i6.webp",
      "images/rewards/i7.webp",
      "images/rewards/i8.webp",
      "images/rewards/g1.webp",
      "images/rewards/g2.webp",
    ],
  },
  {
    id: "item-3",
    title: "PARTICIPATION RECOGNITION",
   desc: "Participation Certificates for Classroom and State level students. Appreciation certificate for the teacher coordinator.",
    hasSlider: false,
    // sliderImages: [

    // ],
  },
  {
    id: "item-4",
    title: "INTERNATIONAL LEVEL PRIZE",
    desc: "Panda Trophy for the winning school. Certificates and curated prizes for students",
    hasSlider: false,
    // sliderImages: [

    // ],
  },
]

const TrophyIcon = () => (
  <svg
    width="31"
    height="32"
    viewBox="0 0 31 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="shrink-0"
  >
    <g clipPath="url(#clip0_1_1430)">
      <path
        d="M25.36 2.64C26.51 2.75 27.92 2.49 29.04 2.64C29.35 2.68 29.69 2.87 29.85 3.15C30.1 3.58 30.05 5.15 30.02 5.71C29.79 9.46 26.78 12.32 23.04 12.44C21.91 15.28 20.08 18.27 17.51 20C17.01 20.33 15.62 21.1 15.06 21.13C14.59 21.15 13.33 20.47 12.89 20.2C10.11 18.49 8.19 15.42 7.02 12.44C3.27 12.32 0.270002 9.46 0.0300023 5.71C2.34507e-06 5.17 -0.0299977 4.21 0.0300023 3.69C0.100002 3.09 0.480002 2.71 1.08 2.64C2.21 2.52 3.54 2.73 4.69 2.64C4.63 1.87 4.88 0.15 5.82 0H24.22C25.17 0.15 25.39 1.86 25.35 2.64H25.36ZM15.11 3.57C14.93 3.54 14.99 3.57 14.94 3.67C14.75 4.01 13.9 6.05 13.74 6.14C12.91 6.37 12.02 6.34 11.19 6.52C11.08 6.54 10.99 6.52 10.92 6.64L12.93 8.68L12.48 11.5L15.02 10.2L17.61 11.5L17.16 8.68L19.17 6.64C19.1 6.51 19.01 6.55 18.9 6.52C18.08 6.34 17.17 6.34 16.35 6.14L15.13 3.57H15.11ZM4.85 4.66H2.05V5.94C2.05 6.21 2.31 6.99 2.42 7.27C3.04 8.84 4.58 10.05 6.24 10.32C5.6 8.48 5.09 6.58 4.84 4.65L4.85 4.66ZM28.01 4.66H25.21C24.97 6.6 24.44 8.49 23.81 10.33C25.48 10.07 27 8.84 27.63 7.28C27.74 7 28 6.21 28 5.95V4.67L28.01 4.66Z"
        fill="white"
      />
      <path
        d="M26.22 31.0698H3.84V27.9998C3.84 27.9998 4.05 27.4698 4.09 27.3898C4.42 26.7798 5.12 26.3298 5.82 26.3198H24.39C25.03 26.3898 25.67 26.8198 25.97 27.3898C26.01 27.4698 26.22 27.9598 26.22 27.9998V31.0698Z"
        fill="white"
      />
      <path
        d="M19.38 25.5601H10.68L11.69 24.7501C12.19 24.1701 12.67 23.5601 12.97 22.8401C13.17 22.3601 13.23 21.8401 13.44 21.3701C13.86 21.5601 14.54 21.9001 15 21.9101C15.48 21.9201 16.19 21.5701 16.63 21.3701C16.83 21.8201 16.89 22.3201 17.08 22.7901C17.54 23.9601 18.39 24.8401 19.39 25.5701L19.38 25.5601Z"
        fill="white"
      />
    </g>
    <defs>
      <clipPath id="clip0_1_1430">
        <rect width="30.06" height="31.07" fill="white" />
      </clipPath>
    </defs>
  </svg>
)

export function RewardsSection({ baseUrl = "/" }: { baseUrl?: string }) {
  return (
    <div className="flex w-full max-w-6xl min-w-[90vw] flex-col rounded-[32px] border border-cyan-400/40 bg-white/10 px-6 py-8 shadow-2xl backdrop-blur-md min-[1300px]:px-24 md:rounded-[25px] md:px-20 md:py-12 xl:min-w-6xl">
      <Accordion
        type="single"
        collapsible
        defaultValue="item-1"
        className="w-full"
      >
        {rewards.map((reward) => (
          <AccordionItem
            key={reward.id}
            value={reward.id}
            className="border-b border-white py-4 last:border-none"
          >
            <AccordionTrigger className="flex items-center gap-4 text-left hover:text-white/80 hover:no-underline [&>svg]:h-8! [&>svg]:w-8! [&>svg]:text-white! [&[data-state=open]>svg]:rotate-180">
              <div className="flex flex-1 items-center gap-4 md:gap-6">
                <TrophyIcon />
                <h3 className="m-0 text-lg font-semibold tracking-wide text-[#8BDEFF] uppercase drop-shadow-md md:text-xl lg:text-2xl">
                  {reward.title}
                </h3>
              </div>
            </AccordionTrigger>

            <AccordionContent className="pt-2 pb-4 pl-0 text-white md:pl-14">
              <div className="flex flex-col gap-10 lg:items-center">
                <p
                  className={`text-left text-base leading-relaxed md:text-lg ${"w-full"}`}
                >
                  {reward.desc}
                </p>

                {reward.hasSlider && reward.sliderImages && (
                  <div className="relative w-full">
                    <Carousel
                      opts={{ loop: true, align: "start", duration: 40 }}
                      className="w-full px-8 md:px-12"
                    >
                      <CarouselContent>
                        {reward.sliderImages.map((imgSrc, index) => (
                          <CarouselItem key={index} className="md:basis-1/2">
                            <div className="flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl border border-white/20 bg-[#004A6B]/40 shadow-inner">
                              <img
                                src={`${baseUrl}${imgSrc}`}
                                alt={`Reward experience preview ${index + 1}`}
                                className="h-full w-full object-cover"
                                loading="lazy"
                                height="350"
                                width="400"
                              />
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>

                      <CarouselPrevious className="left-0 border-none bg-transparent text-[#8BDEFF] drop-shadow-[0_0_8px_rgba(139,222,255,0.8)] transition-transform hover:scale-125 hover:bg-transparent">
                        <svg
                          width="18"
                          height="26"
                          viewBox="0 0 14 22"
                          fill="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <polygon points="14,0 0,11 14,22" />
                        </svg>
                      </CarouselPrevious>
                      <CarouselNext className="right-0 border-none bg-transparent text-[#8BDEFF] drop-shadow-[0_0_8px_rgba(139,222,255,0.8)] transition-transform hover:scale-125 hover:bg-transparent">
                        <svg
                          width="18"
                          height="26"
                          viewBox="0 0 14 22"
                          fill="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <polygon points="0,0 14,11 0,22" />
                        </svg>
                      </CarouselNext>
                    </Carousel>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
