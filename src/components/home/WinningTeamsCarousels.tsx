// import { useState } from "react"
// // import AnimatedBossOctopus from "./AnimatedOctopus"

// export interface TestimonialSlide {
//   title: string
//   positionLabel: string
//   positionSubLabel: string
//   images: string[]
//   quote: string
//   author: string
//   location: string
//   flagCode?: string
// }

// export function WinningTeamsCarousels() {
//   const baseUrl = import.meta.env.BASE_URL || "/"

//   const nationalSlides: TestimonialSlide[] = [
//     {
//       title: "TESTIMONIALS: NATIONAL WINNING TEAMS",
//       positionLabel: "FIRST",
//       positionSubLabel: "POSITION",
//       images: [
//         "images/testimonial/Skandan K S.webp",
//         "images/testimonial/Sathvik.webp",
//       ],
//       quote:
//         "It was a proud moment for us to represent India at the National and International Finals. We thoroughly enjoyed the experience, which gave us the opportunity to showcase our knowledge on a global platform. The exposure was truly enriching and helped us learn more about diverse species. Winning as a team was a proud milestone for all of us.",
//       author: "Skandan K S & Sathwik Sarath",
//       location: "Bhavan's Varuna Vidyalaya\nThrikkakkara, Kerala",
//     },
//     {
//       title: "TESTIMONIALS: NATIONAL WINNING TEAMS",
//       positionLabel: "SECOND",
//       positionSubLabel: "POSITION",
//       images: [
//         "images/testimonial/Gitansh Gulati.webp",
//         "images/testimonial/Daksh.webp",
//       ],
//       quote:
//         "“Participating in the World Wild Wisdom Global Quiz Challenge on the theme Incredible Insects was an exciting and memorable experience for us. While preparing for the quiz, we explored the fascinating world of insects and learned about their life cycles, habitats, adaptations, and their important role in maintaining ecological balance. The questions were challenging, informative, and thought-provoking, encouraging us to research, think critically, and learn beyond our textbooks. The competition also helped us improve our teamwork, confidence, and problem-solving skills. We truly enjoyed being a part of such a well-organized and educational platform. We sincerely thank the organizers of the Wild Wisdom Global Challenge for providing us with this wonderful opportunity to learn, compete, and grow. This experience has inspired us to stay curious and continue learning about nature and wildlife.”",
//       author: "Gitansh Gulati & Daksh Ghiloria",
//       location: "Kasauli International Public School\nHimachal Pradesh",
//     },
//     {
//       title: "TESTIMONIALS: NATIONAL WINNING TEAMS",
//       positionLabel: "THIRD",
//       positionSubLabel: "POSITION",
//       images: [
//         "images/testimonial/Ashwin Anand.webp",
//         "images/testimonial/Anubhadipta Boruah.webp",
//       ],
//       quote:
//         "Participating in WWF-India’s Wild Wisdom Global Challenge 2025 was an inspiring and enriching experience. This year’s theme, Incredible Insects, deepened our understanding of the vital role even the smallest creatures play in maintaining ecological balance. Reaching the National Level strengthened our curiosity, confidence, and commitment to wildlife conservation. We congratulate all the National Level winners and were proud to represent Sarala Birla Gyan Jyoti, Guwahati. We sincerely thank our teachers, principal, and WWF-India for their constant support and this valuable opportunity.",
//       author: "Ashwin Anand & Anubhadipta Boruah",
//       location: "Sarala Birla Gyan Jyoti\nGuwahati, Assam",
//     },
//   ]

//   const internationalSlides: TestimonialSlide[] = [
//     {
//       title: "INTERNATIONAL WINNING TEAMS",
//       positionLabel: "",
//       positionSubLabel: "",
//       images: ["images/country/colombia.webp"],
//       quote:
//         "My experience at the international final of the Wild Wisdom Global Challenge was wonderful. Testing my knowledge about the environment alongside students from different countries was truly exciting, especially because I almost won. Achieving first place at the national level and second place internationally fills me with pride. Knowing that my passion for caring for the planet can contribute to its protection inspires me every day. Without a doubt, it was an incredible experience that I will always carry with me.",
//       author: "COLOMBIA",
//       flagCode: "co",
//       location: "",
//     },
//     {
//       title: "INTERNATIONAL WINNING TEAMS",
//       positionLabel: "",
//       positionSubLabel: "",
//       images: ["images/country/france.webp"],
//       quote:
//         "“We liked the event because the activities were fun and helped us learn new things. It was exciting to join WWF and compete in the final quiz with students from all around the world.”",
//       author: "FRANCE",
//       flagCode: "fr",
//       location: "",
//     },
//     {
//       title: "INTERNATIONAL WINNING TEAMS",
//       positionLabel: "",
//       positionSubLabel: "",
//       images: ["images/country/bhutan.webp"],
//       quote:
//         "I felt that participating in the Wild Wisdom Global Challenge 2025 was an incredible experience. It deepened my appreciation for entomology and connected me with passionate individuals from around the world. Being part of the WWGC 2025 was both stimulating and fulfilling, as it inspired continuous learning and a stronger connection to nature and wildlife.",
//       author: "BHUTAN",
//       flagCode: "bt",
//       location: "",
//     },
//   ]

//   const CustomSlider = ({
//     slides,
//     id,
//     hideTrophy = false,
//   }: {
//     slides: TestimonialSlide[]
//     id: string
//     hideTrophy?: boolean
//   }) => {
//     const [currentIndex, setCurrentIndex] = useState(0)

//     const handleNext = () => {
//       setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length)
//     }

//     const handlePrev = () => {
//       setCurrentIndex((prevIndex) =>
//         prevIndex === 0 ? slides.length - 1 : prevIndex - 1
//       )
//     }

//     const currentSlide = slides[currentIndex]

//     // Logic to determine if we should show the left column at all
//     const hasImages = currentSlide.images && currentSlide.images.length > 0
//     const showLeftColumn = !hideTrophy || hasImages

//     return (
//       <div className="group relative mx-auto w-full">
//         <div className="relative mx-0 flex min-h-112.5 flex-col items-center justify-center overflow-hidden rounded-[52px] border border-white/10 p-8 shadow-2xl md:mx-12 md:px-20 md:py-12 lg:px-14">
//           <div className="pointer-events-none absolute inset-0 z-0 bg-[#004A6B]/60 backdrop-blur-md lg:bg-[#d9d9d9] lg:opacity-60 lg:mix-blend-overlay lg:backdrop-blur-none"></div>

//           <h3 className="relative z-10 mb-10 w-full text-center font-wwf text-3xl tracking-wide text-[#F8A632] drop-shadow-md md:mb-10 md:text-5xl lg:text-[54px]">
//             {slides[0].title}
//           </h3>

//           <div
//             key={currentIndex}
//             className="relative z-10 w-full animate-in duration-700 fade-in"
//           >
//             <div
//               className={`flex flex-col items-center gap-8 lg:flex-row ${
//                 hideTrophy ? "lg:gap-4" : "lg:gap-10"
//               } ${hasImages ? "md:items-stretch" : "md:items-center"}`}
//             >
//               {showLeftColumn && (
//                 <div className="flex flex-col gap-5 lg:flex-row lg:gap-0">
//                   {!hideTrophy && (
//                     <div className="flex min-w-45 flex-col items-center lg:min-w-55">
//                       <img
//                         src={`${baseUrl}images/svgs/trophy.svg`}
//                         alt="Trophy"
//                         className="h-24 w-24 drop-shadow-lg md:h-32 md:w-32 lg:h-25 lg:w-25"
//                         height={300}
//                         width={300}
//                       />
//                       {currentSlide.positionLabel && (
//                         <span className="relative bottom-3 font-wwf text-4xl font-semibold tracking-[5px] text-white drop-shadow-md lg:text-6xl">
//                           {currentSlide.positionLabel}
//                         </span>
//                       )}
//                       {currentSlide.positionSubLabel && (
//                         <span className="cc text-sm tracking-wider text-white uppercase drop-shadow-md lg:text-lg">
//                           {currentSlide.positionSubLabel}
//                         </span>
//                       )}
//                     </div>
//                   )}

//                   {hasImages && (
//                     <div className="flex flex-row justify-center gap-6 lg:flex-col lg:gap-3 xl:justify-start">
//                       {currentSlide.images.map((imgSrc, index) => (
//                         <div
//                           key={index}
//                           className={`shrink-0 overflow-hidden ${
//                             hideTrophy
//                               ? "h-48 w-48 bg-transparent md:h-56 md:w-56 lg:h-64 lg:w-64"
//                               : "h-32 w-32 rounded-[1rem] bg-white shadow-lg md:h-40 md:w-40 lg:h-50 lg:w-50"
//                           }`}
//                         >
//                           <img
//                             src={`${baseUrl}${imgSrc}`}
//                             alt={`Slide visual ${index + 1}`}
//                             width={400}
//                             height={400}
//                             className={`h-full w-full ${
//                               hideTrophy ? "object-contain" : "object-cover"
//                             }`}
//                           />
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               )}

//               <div
//                 className={`flex flex-1 flex-col text-white ${
//                   hideTrophy ? "md:pl-4 lg:px-2" : "md:pl-4 lg:px-10"
//                 } ${hasImages ? "justify-between" : "justify-center gap-8"}`}
//               >
//                 <p className="text-sm leading-relaxed italic opacity-100 drop-shadow-md md:text-lg lg:leading-[1.3]">
//                   {currentSlide.quote}
//                 </p>
//                 <div className="mt-6">
//                   <div className="my-3 h-1.5 w-8 bg-white drop-shadow-md"></div>

//                   {currentSlide.author && (
//                     <div className="flex items-center gap-3">
//                       <p className="text-sm font-bold tracking-widest drop-shadow-md md:text-base lg:text-xl">
//                         {currentSlide.author}
//                       </p>
//                       {currentSlide.flagCode && (
//                         <img
//                           src={`https://flagcdn.com/w40/${currentSlide.flagCode}.png`}
//                           srcSet={`https://flagcdn.com/w80/${currentSlide.flagCode}.png 2x`}
//                           width="40"
//                           height="40"
//                           alt={`${currentSlide.author} flag`}
//                           className="h-auto w-8 rounded-sm drop-shadow-md md:w-10"
//                         />
//                       )}
//                     </div>
//                   )}

//                   {currentSlide.location && (
//                     <p className="text-sea-green mt-1 text-sm font-semibold whitespace-pre-line drop-shadow-md md:text-base lg:text-lg">
//                       {currentSlide.location}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {slides.length > 1 && (
//           <>
//             <button
//               onClick={handlePrev}
//               className="absolute top-1/2 -left-2 z-20 hidden -translate-y-1/2 border-none bg-transparent shadow-none transition-transform hover:scale-110 md:flex lg:-left-6 xl:-left-12"
//               aria-label="Previous slide"
//             >
//               <svg
//                 viewBox="0 0 88 134"
//                 fill="none"
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-auto w-10 md:w-16 lg:w-22"
//               >
//                 <g filter={`url(#filter_prev_${id})`}>
//                   <path d="M66.64 20L20 66.64L67.13 113.77" fill="#8BDEFF" />
//                 </g>
//                 <defs>
//                   <filter
//                     id={`filter_prev_${id}`}
//                     x="0"
//                     y="0"
//                     width="87.13"
//                     height="133.77"
//                     filterUnits="userSpaceOnUse"
//                     colorInterpolationFilters="sRGB"
//                   >
//                     <feFlood floodOpacity="0" result="BackgroundImageFix" />
//                     <feColorMatrix
//                       in="SourceAlpha"
//                       type="matrix"
//                       values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
//                       result="hardAlpha"
//                     />
//                     <feOffset />
//                     <feGaussianBlur stdDeviation="10" />
//                     <feColorMatrix
//                       type="matrix"
//                       values="0 0 0 0 0.152941 0 0 0 0 0.792157 0 0 0 0 0.988235 0 0 0 0.75 0"
//                     />
//                     <feBlend
//                       mode="normal"
//                       in2="BackgroundImageFix"
//                       result="effect1_dropShadow"
//                     />
//                     <feBlend
//                       mode="normal"
//                       in="SourceGraphic"
//                       in2="effect1_dropShadow"
//                       result="shape"
//                     />
//                   </filter>
//                 </defs>
//               </svg>
//             </button>

//             <button
//               onClick={handleNext}
//               className="absolute top-1/2 -right-2 z-20 hidden -translate-y-1/2 border-none bg-transparent shadow-none transition-transform hover:scale-110 md:flex lg:-right-6 xl:-right-12"
//               aria-label="Next slide"
//             >
//               <svg
//                 viewBox="0 0 88 134"
//                 fill="none"
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-auto w-10 md:w-16 lg:w-22"
//               >
//                 <g filter={`url(#filter_next_${id})`}>
//                   <path d="M20.49 20L67.13 66.64L20 113.77" fill="#8BDEFF" />
//                 </g>
//                 <defs>
//                   <filter
//                     id={`filter_next_${id}`}
//                     x="0"
//                     y="0"
//                     width="87.13"
//                     height="133.77"
//                     filterUnits="userSpaceOnUse"
//                     colorInterpolationFilters="sRGB"
//                   >
//                     <feFlood floodOpacity="0" result="BackgroundImageFix" />
//                     <feColorMatrix
//                       in="SourceAlpha"
//                       type="matrix"
//                       values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
//                       result="hardAlpha"
//                     />
//                     <feOffset />
//                     <feGaussianBlur stdDeviation="10" />
//                     <feColorMatrix
//                       type="matrix"
//                       values="0 0 0 0 0.152941 0 0 0 0 0.792157 0 0 0 0 0.988235 0 0 0 0.75 0"
//                     />
//                     <feBlend
//                       mode="normal"
//                       in2="BackgroundImageFix"
//                       result="effect1_dropShadow"
//                     />
//                     <feBlend
//                       mode="normal"
//                       in="SourceGraphic"
//                       in2="effect1_dropShadow"
//                       result="shape"
//                     />
//                   </filter>
//                 </defs>
//               </svg>
//             </button>
//           </>
//         )}
//       </div>
//     )
//   }

//   return (
//     <div className="flex w-full flex-col space-y-15 py-5">
//       <CustomSlider slides={nationalSlides} id="national" />

//       {/* <div className="absolute right-4 bottom-[30%] z-20 max-[480px]:bottom-[34%] md:top-[20%] md:left-[0%] xl:left-[-5%]">
//         <AnimatedBossOctopus />
//       </div> */}

//       <CustomSlider slides={internationalSlides} id="intl" hideTrophy />
//     </div>
//   )
// }
import { useState } from "react"
// import AnimatedBossOctopus from "./AnimatedOctopus"

export interface TestimonialSlide {
  title: string
  positionLabel: string
  positionSubLabel: string
  images: string[]
  quote: string
  author: string
  location: string
  flagCode?: string
}

export function WinningTeamsCarousels() {
  const baseUrl = import.meta.env.BASE_URL || "/"

  const nationalSlides: TestimonialSlide[] = [
    {
      title: "TESTIMONIALS: NATIONAL WINNING TEAMS",
      positionLabel: "FIRST",
      positionSubLabel: "POSITION",
      images: [
        "images/testimonial/Skandan K S.webp",
        "images/testimonial/Sathvik.webp",
      ],
      quote:
        "It was a proud moment for us to represent India at the National and International Finals. We thoroughly enjoyed the experience, which gave us the opportunity to showcase our knowledge on a global platform. The exposure was truly enriching and helped us learn more about diverse species. Winning as a team was a proud milestone for all of us.",
      author: "Skandan K S & Sathwik Sarath",
      location: "Bhavan's Varuna Vidyalaya\nThrikkakkara, Kerala",
    },
    {
      title: "TESTIMONIALS: NATIONAL WINNING TEAMS",
      positionLabel: "SECOND",
      positionSubLabel: "POSITION",
      images: [
        "images/testimonial/Gitansh Gulati.webp",
        "images/testimonial/Daksh.webp",
      ],
      quote:
        "“Participating in the World Wild Wisdom Global Quiz Challenge on the theme Incredible Insects was an exciting and memorable experience for us. While preparing for the quiz, we explored the fascinating world of insects and learned about their life cycles, habitats, adaptations, and their important role in maintaining ecological balance. The questions were challenging, informative, and thought-provoking, encouraging us to research, think critically, and learn beyond our textbooks. The competition also helped us improve our teamwork, confidence, and problem-solving skills. We truly enjoyed being a part of such a well-organized and educational platform. We sincerely thank the organizers of the Wild Wisdom Global Challenge for providing us with this wonderful opportunity to learn, compete, and grow. This experience has inspired us to stay curious and continue learning about nature and wildlife.”",
      author: "Gitansh Gulati & Daksh Ghiloria",
      location: "Kasauli International Public School\nHimachal Pradesh",
    },
    {
      title: "TESTIMONIALS: NATIONAL WINNING TEAMS",
      positionLabel: "THIRD",
      positionSubLabel: "POSITION",
      images: [
        "images/testimonial/Ashwin Anand.webp",
        "images/testimonial/Anubhadipta Boruah.webp",
      ],
      quote:
        "Participating in WWF-India’s Wild Wisdom Global Challenge 2025 was an inspiring and enriching experience. This year’s theme, Incredible Insects, deepened our understanding of the vital role even the smallest creatures play in maintaining ecological balance. Reaching the National Level strengthened our curiosity, confidence, and commitment to wildlife conservation. We congratulate all the National Level winners and were proud to represent Sarala Birla Gyan Jyoti, Guwahati. We sincerely thank our teachers, principal, and WWF-India for their constant support and this valuable opportunity.",
      author: "Ashwin Anand & Anubhadipta Boruah",
      location: "Sarala Birla Gyan Jyoti\nGuwahati, Assam",
    },
  ]

  const internationalSlides: TestimonialSlide[] = [
    {
      title: "INTERNATIONAL WINNING TEAMS",
      positionLabel: "",
      positionSubLabel: "",
      images: ["images/country/cyprus.webp"],
      quote:
        "​I was really excited to get points and learn about new insects like beetles, fireflies, and dragonflies. Every new fact made me want to keep researching. When I saw myself take the 5th place out of more than 30 schools worldwide, I felt so proud and surprised. It made me happy just to take part, and this victory has inspired me to keep learning more about nature and how to protect it.",
      author: "Mitt Miron Student & Emin faridovich Sardarov",
      flagCode: "cy",
      location: "Pascal Primary School, Limassol (City Centre), Cyprus",
    },
    {
      title: "INTERNATIONAL WINNING TEAMS",
      positionLabel: "",
      positionSubLabel: "",
      images: ["images/country/france.webp"],
      quote:
        "“We liked the event because the activities were fun and helped us learn new things. It was exciting to join WWF and compete in the final quiz with students from all around the world.”",
      author: "Edouard Genevier & Scarlett Simpson",
      flagCode: "fr",
      location: "Mougins British International School, France",
    },
    {
      title: "INTERNATIONAL WINNING TEAMS",
      positionLabel: "",
      positionSubLabel: "",
      images: ["images/country/bhutan.webp"],
      quote:
        "I felt that participating in the Wild Wisdom Global Challenge 2025 was an incredible experience. It deepened my appreciation for entomology and connected me with passionate individuals from around the world. Being part of the WWGC 2025 was both stimulating and fulfilling, as it inspired continuous learning and a stronger connection to nature and wildlife.",
      author: "Ugyen Choden and Sonam Choden",
      flagCode: "bt",
      location: "Minjiwoong Central School, Bhutan",
    },
  ]

  const CustomSlider = ({
    slides,
    id,
    hideTrophy = false,
  }: {
    slides: TestimonialSlide[]
    id: string
    hideTrophy?: boolean
  }) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isExpanded, setIsExpanded] = useState(false)

    const handleNext = () => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length)
      setIsExpanded(false)
    }

    const handlePrev = () => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? slides.length - 1 : prevIndex - 1
      )
      setIsExpanded(false)
    }

    const currentSlide = slides[currentIndex]

    const hasImages = currentSlide.images && currentSlide.images.length > 0
    const showLeftColumn = !hideTrophy || hasImages

    return (
      <div className="group relative mx-auto w-full">
        <div className="relative mx-0 flex min-h-112.5 flex-col items-center justify-center overflow-hidden rounded-[52px] border border-white/10 p-8 shadow-2xl md:mx-12 md:px-20 md:py-12 lg:px-14">
          <div className="pointer-events-none absolute inset-0 z-0 bg-[#004A6B]/60 backdrop-blur-md lg:bg-[#d9d9d9] lg:opacity-60 lg:mix-blend-overlay lg:backdrop-blur-none"></div>

          <h3 className="relative z-10 mb-10 w-full text-center font-wwf text-3xl tracking-wide text-[#F8A632] drop-shadow-md md:mb-10 md:text-5xl lg:text-[54px]">
            {slides[0].title}
          </h3>

          <div
            key={currentIndex}
            className="relative z-10 w-full animate-in duration-700 fade-in"
          >
            <div
              className={`flex flex-col items-center gap-8 lg:flex-row ${
                hideTrophy ? "lg:gap-4" : "lg:gap-10"
              } lg:items-center`}
            >
              {showLeftColumn && (
                <div className="flex flex-col items-center gap-5 lg:flex-row lg:gap-8">
                  {!hideTrophy && (
                    <div className="flex min-w-45 flex-col items-center lg:min-w-55">
                      <img
                        src={`${baseUrl}images/svgs/trophy.svg`}
                        alt="Trophy"
                        className="h-24 w-24 drop-shadow-lg md:h-32 md:w-32 lg:h-25 lg:w-25"
                        height={300}
                        width={300}
                      />
                      {currentSlide.positionLabel && (
                        <span className="relative bottom-3 font-wwf text-4xl font-semibold tracking-[5px] text-white drop-shadow-md lg:text-6xl">
                          {currentSlide.positionLabel}
                        </span>
                      )}
                      {currentSlide.positionSubLabel && (
                        <span className="cc text-sm tracking-wider text-white uppercase drop-shadow-md lg:text-lg">
                          {currentSlide.positionSubLabel}
                        </span>
                      )}
                    </div>
                  )}

                  {hasImages && (
                    <div className="flex flex-row justify-center gap-6 lg:flex-col lg:gap-3 xl:justify-start">
                      {currentSlide.images.map((imgSrc, index) => (
                        <div
                          key={index}
                          className={`shrink-0 overflow-hidden ${
                            hideTrophy
                              ? "h-48 w-48 bg-transparent md:h-56 md:w-56 lg:h-64 lg:w-64"
                              : "h-32 w-32 rounded-[1rem] bg-white shadow-lg md:h-40 md:w-40 lg:h-50 lg:w-50"
                          }`}
                        >
                          <img
                            src={`${baseUrl}${imgSrc}`}
                            alt={`Slide visual ${index + 1}`}
                            width={400}
                            height={400}
                            className={`h-full w-full ${
                              hideTrophy ? "object-contain" : "object-cover"
                            }`}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div
                className={`flex flex-1 flex-col justify-center gap-6 text-white ${
                  hideTrophy ? "md:pl-4 lg:px-2" : "md:pl-4 lg:px-10"
                }`}
              >
                <div className="flex flex-col items-start">
                  <p
                    className={`text-sm leading-relaxed italic opacity-100 drop-shadow-md transition-all duration-300 md:text-base lg:text-[17px] lg:leading-[1.55] ${
                      !isExpanded ? "line-clamp-5" : ""
                    }`}
                  >
                    {currentSlide.quote}
                  </p>

                  {currentSlide.quote.length > 600 && (
                    <button
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="mt-2 text-sm font-bold tracking-wide text-[#F8A632] drop-shadow-md transition-colors hover:text-white focus:outline-none"
                    >
                      {isExpanded ? "Show Less" : "Read More..."}
                    </button>
                  )}
                </div>

                <div className="flex flex-col">
                  <div className="mb-4 h-1.5 w-8 bg-white drop-shadow-md"></div>

                  {currentSlide.author && (
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-bold drop-shadow-md md:text-base lg:text-xl">
                        {currentSlide.author}
                      </p>
                      {currentSlide.flagCode && (
                        <img
                          src={`https://flagcdn.com/w40/${currentSlide.flagCode}.png`}
                          srcSet={`https://flagcdn.com/w80/${currentSlide.flagCode}.png 2x`}
                          width="40"
                          height="40"
                          alt={`${currentSlide.author} flag`}
                          className="h-auto w-8 rounded-sm drop-shadow-md md:w-10"
                        />
                      )}
                    </div>
                  )}

                  {currentSlide.location && (
                    <p className="text-sea-green mt-1 text-sm font-semibold whitespace-pre-line drop-shadow-md md:text-base lg:text-lg">
                      {currentSlide.location}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {slides.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute top-1/2 -left-2 z-20 flex -translate-y-1/2 border-none bg-transparent shadow-none transition-transform hover:scale-110 lg:-left-6 xl:-left-12"
              aria-label="Previous slide"
            >
              <svg
                viewBox="0 0 88 134"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-auto w-10 md:w-16 lg:w-22"
              >
                <g filter={`url(#filter_prev_${id})`}>
                  <path d="M66.64 20L20 66.64L67.13 113.77" fill="#8BDEFF" />
                </g>
                <defs>
                  <filter
                    id={`filter_prev_${id}`}
                    x="0"
                    y="0"
                    width="87.13"
                    height="133.77"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                  >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feOffset />
                    <feGaussianBlur stdDeviation="10" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0.152941 0 0 0 0 0.792157 0 0 0 0 0.988235 0 0 0 0.75 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="BackgroundImageFix"
                      result="effect1_dropShadow"
                    />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="effect1_dropShadow"
                      result="shape"
                    />
                  </filter>
                </defs>
              </svg>
            </button>

            <button
              onClick={handleNext}
              className="absolute top-1/2 -right-2 z-20 flex -translate-y-1/2 border-none bg-transparent shadow-none transition-transform hover:scale-110 lg:-right-6 xl:-right-12"
              aria-label="Next slide"
            >
              <svg
                viewBox="0 0 88 134"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-auto w-10 md:w-16 lg:w-22"
              >
                <g filter={`url(#filter_next_${id})`}>
                  <path d="M20.49 20L67.13 66.64L20 113.77" fill="#8BDEFF" />
                </g>
                <defs>
                  <filter
                    id={`filter_next_${id}`}
                    x="0"
                    y="0"
                    width="87.13"
                    height="133.77"
                    filterUnits="userSpaceOnUse"
                    colorInterpolationFilters="sRGB"
                  >
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix
                      in="SourceAlpha"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                      result="hardAlpha"
                    />
                    <feOffset />
                    <feGaussianBlur stdDeviation="10" />
                    <feColorMatrix
                      type="matrix"
                      values="0 0 0 0 0.152941 0 0 0 0 0.792157 0 0 0 0 0.988235 0 0 0 0.75 0"
                    />
                    <feBlend
                      mode="normal"
                      in2="BackgroundImageFix"
                      result="effect1_dropShadow"
                    />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="effect1_dropShadow"
                      result="shape"
                    />
                  </filter>
                </defs>
              </svg>
            </button>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col space-y-15 py-5">
      <CustomSlider slides={nationalSlides} id="national" />
      <CustomSlider slides={internationalSlides} id="intl" hideTrophy />
    </div>
  )
}
