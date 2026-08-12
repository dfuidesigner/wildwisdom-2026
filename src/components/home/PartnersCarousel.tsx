import * as React from "react"
import Autoplay from "embla-carousel-autoplay"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"

interface PartnersCarouselProps {
  baseUrl: string
}

interface Partner {
  folder?: string
  file?: string
  name: string
  type: string
  svg?: React.ReactNode
}

const ItzaSvg = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 130 40"
    className="h-8 w-auto md:h-10"
    role="img"
    aria-label="ITZA logo"
  >
    <path
      fill="white"
      clipRule="evenodd"
      fillRule="evenodd"
      d="M16.8512 12.1982C15.8813 12.1982 15.0878 11.3496 15.0878 10.3125V1.88564C15.0878 0.848536 15.8813 0 16.8512 0H43.2248C44.1947 0 44.9882 0.848536 44.9882 1.88564V10.3125C44.9882 11.3496 44.1947 12.1982 43.2248 12.1982H37.6824C36.7125 12.1982 35.919 13.0467 35.919 14.0838V38.1144C35.919 39.1515 35.1254 40 34.1556 40H26.2749C25.305 40 24.5115 39.1515 24.5115 38.1144V14.0838C24.5115 13.0467 23.7179 12.1982 22.748 12.1982H16.8512ZM1.76341 0.105594H9.64411C10.618 0.105594 11.4075 0.949822 11.4075 1.99123V38.1144C11.4075 39.1558 10.618 40 9.64411 40H1.76341C0.789507 40 0 39.1558 0 38.1144V1.99123C0 0.949822 0.789507 0.105594 1.76341 0.105594ZM81.1205 0.0226276C82.0904 0.0226276 82.4766 0.752369 81.9775 1.6405L68.2652 26.101C67.7662 26.991 68.1524 27.7189 69.1223 27.7189H82.1962C83.1661 27.7189 83.9596 28.5674 83.9596 29.6045V38.0314C83.9596 39.0685 83.1661 39.917 82.1962 39.9151L48.9964 39.8963C48.0266 39.8963 47.6404 39.1684 48.1394 38.2784L61.8535 13.8142C62.3525 12.9242 61.9663 12.1963 60.9965 12.1963H50.7069C49.7371 12.1963 48.9435 11.3478 48.9435 10.3107V1.88564C48.9453 0.848536 49.7388 0 50.7087 0L81.1205 0.020742V0.0226276ZM128.927 40C129.897 40 130.281 39.2721 129.78 38.384H129.782L109.215 1.84604C108.714 0.956019 107.896 0.956019 107.397 1.84604L86.9857 38.1936C86.4866 39.0817 86.871 39.8095 87.8409 39.8095H97.6843C98.6542 39.8095 99.855 39.0817 100.352 38.1917L107.394 25.6069C107.893 24.7169 108.707 24.7169 109.206 25.6069L116.368 38.3821C116.867 39.2721 118.068 40 119.037 40H128.927Z"
    />
  </svg>
)

export function PartnersCarousel({ baseUrl }: PartnersCarouselProps) {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false })
  )

  const partners: Partner[] = [
    {
      folder: "supporters",
      file: "supporter-3.webp",
      name: "Ministry of Education, Government of India",
      type: "Outreach Partner",
    },
    {
      folder: "supporters",
      file: "supporter-2.webp",
      name: "CBSE",
      type: "Outreach Partner",
    },
    {
      folder: "supporters",
      file: "supporter-1.webp",
      name: "KVS",
      type: "Outreach Partner",
    },
    {
      folder: "supporters",
      file: "supporter-4.webp",
      name: "Directorate of Education, Chandigarh",
      type: "Outreach Partner",
    },
    {
      folder: "supporters",
      file: "supporter-5.webp",
      name: "Directorate of Education, Haryana",
      type: "Outreach Partner",
    },
    {
      folder: "supporters",
      file: "supporter-6.webp",
      name: " Directorate of Education, Punjab",
      type: "Outreach Partner",
    },

    // ITZA — inline SVG (white fill, needs dark background instead of white)
    { name: "ITZA", type: "Digital Resource Partner", svg: ItzaSvg },
  ]

  return (
    <Carousel
      plugins={[plugin.current]}
      className="mx-auto w-full max-w-6xl px-4 max-[1281px]:mt-5 min-[1281px]:mt-12"
      onMouseEnter={() => plugin.current.stop()}
      onMouseLeave={() => plugin.current.play()}
      opts={{
        align: "start",
        loop: true,
      }}
    >
      <CarouselContent className="-ml-4 py-4 md:-ml-6">
        {partners.map((partner, index) => (
          <CarouselItem
            key={index}
            className="basis-1/2 pl-4 md:basis-1/3 md:pl-6 lg:basis-1/4"
          >
            <div className="group relative flex h-full flex-col overflow-hidden rounded-[20px] bg-[#253D70] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgb(0,0,0,0.16)]">
              <div
                className={`relative flex h-[130px] w-full shrink-0 flex-col items-center justify-center overflow-hidden px-4 pt-4 pb-2 md:h-[150px] ${
                  partner.svg ? "bg-[#253D70]" : "bg-white"
                }`}
              >
                {partner.svg ? (
                  partner.svg
                ) : (
                  <img
                    src={`${baseUrl}images/${partner.folder}/${partner.file}`}
                    alt={`${partner.name} logo`}
                    className="relative z-15 max-h-20 max-w-[100%] object-contain md:max-h-20"
                    loading="lazy"
                    height={500}
                    width={500}
                  />
                )}

                {/* Hover overlay: shows partner type */}
                <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-[#253D70]/92 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <span className="px-3 text-center text-[11px] leading-tight font-semibold tracking-wide text-white uppercase md:text-xs">
                    {partner.type}
                  </span>
                </div>
              </div>

              <div className="relative z-10 w-full shrink-0">
                <img
                  src={`${baseUrl}images/wave-part.webp`}
                  alt=""
                  className="wave-part block h-auto w-full object-cover"
                  aria-hidden="true"
                  width={500}
                  height={40}
                />
              </div>
              <div className="flex flex-1 items-center justify-center px-2 py-3 text-center">
                <p className="relative bottom-1 line-clamp-3 text-xs leading-tight font-bold text-white md:text-[16px]">
                  {partner.name}
                </p>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}
