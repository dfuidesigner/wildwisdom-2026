import { useState } from "react"
import { Plus, Minus, HelpCircle } from "lucide-react"

// Structured FAQ Data
const faqs = [
  {
    question: "What is the theme for the Wild Wisdom Global Challenge 2026?",
    answer:
      "The theme for Wild Wisdom Global Challenge 2026 is Marine theme “From the Coastline to the Seafloor: An Ocean Odyssey.” The challenge takes students on an exciting journey through the oceans—exploring marine life, ecosystems, adaptations, human-ocean connections, and the urgent need for conservation.",
    link: { text: "View Theme Document", url: "#" }, // Add actual link here
  },
  {
    question: "Is there any fee for participating in the Challenge?",
    answer:
      "The Wild Wisdom Global Challenge 2026 is absolutely free of cost. The schools can register for FREE to join the biggest challenge across the globe.",
  },
  {
    question: "Which classes can participate in the Challenge?",
    answer: "Students from Classes 6 to 9 are eligible to participate.",
  },
  {
    question: "Is there a limit on the number of students from a school?",
    answer:
      "There is no maximum limit on participation. However, a minimum of 40 students per school is required to register for the challenge.",
  },
  {
    question: "Where can students access learning material for the Challenge?",
    answer:
      "Students can access learning resources, articles, videos, and practice quizzes related to the Marine theme on itza.io, prior to and during the challenge period.",
  },
  {
    question: "What are the key sub-themes covered under the Marine theme?",
    answer: "The Challenge is structured around six key sub-themes:",
    list: [
      "Marine Diversity and Distribution",
      "World Beneath the Waves: Ocean Ecosystems, Habitats and Interdependence",
      "Life Functions Underwater: Anatomy and Life Processes of Marine Organisms",
      "Adaptations and Behaviour",
      "Challenges to Ocean Health",
      "Human–Ocean Interactions and Conservation Stewardship",
    ],
  },
  {
    question: "How many rounds are there in the Challenge?",
    answer:
      "The Wild Wisdom Global Challenge 2026 will be conducted in five levels:",
    list: [
      "Classroom Level (Virtual)",
      "State Level (Virtual)",
      "Zonal Level (On-Ground)",
      "National Level (On-Ground)",
      "International Level (Digital)",
    ],
  },
  {
    question: "What is the format of the Classroom Level Challenge?",
    answer:
      "The Classroom Level will be conducted virtually and will consist of Multiple Choice Questions (MCQs) based on the Marine theme.",
  },
  {
    question: "How are students selected at the Classroom Level?",
    answer:
      "Students will participate in a series of online quizzes, with scores accumulating over time. Based on cumulative performance, top-performing students will qualify for the next level.",
  },
  {
    question: "How do teams qualify for the State and Zonal Levels?",
    answer:
      "Winning teams from the State Level will advance to the Zonal Level, where teams compete regionally across five zones: North, South, East, West, and North-East.",
  },
  {
    question: "Where will the Zonal and National Level rounds be held?",
    answer:
      "Both the Zonal and National Levels will be conducted as on-ground events. Zonal Level will be held regionally, and the National Level will take place in Delhi. Exact dates and venues will be shared with qualifying teams.",
  },
  {
    question: "What is the International Level of the Challenge?",
    answer:
      "The International Level is a digital round, bringing together top student teams from different countries to compete on a global platform.",
  },
  {
    question: "How can students access itza.io?",
    answer:
      "Students can sign up on itza.io using their email ID and the unique school code provided after registration.",
  },
  {
    question: "What awards and recognition are offered in the Challenge?",
    answer: "Participants have the chance to win several exciting awards:",
    list: [
      "State, Zonal & National Levels: Trophy for the Winning Team",
      "State, Zonal & National Levels: Medals for 1st Runner-up, 2nd Runner-up, and Consolation Teams",
      "State, Zonal & National Levels: Certificates and exciting Wild Experience prizes",
      "Classroom & State Levels: Participation Certificates for all eligible students",
    ],
  },
  {
    question:
      "Why should students participate in Wild Wisdom Global Challenge 2026?",
    answer: "The Challenge helps students:",
    list: [
      "Discover the wonders of marine life and ocean ecosystems",
      "Understand why oceans are vital to life on Earth",
      "Learn about real-world conservation challenges and solutions",
      "Build critical thinking, teamwork, and environmental awareness",
    ],
  },
  {
    question: "What is the last date for registration?",
    answer:
      "The last date to register for this challenge is 15th August, 2026 which will be announced on the official Wild Wisdom Global Challenge platforms.",
  },
]

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="mx-auto w-full space-y-4">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index

        return (
          <div
            key={index}
            className={`group overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
              isOpen
                ? "border-(--wwf-ocean) bg-white shadow-(--wwf-ocean-deep)/5 shadow-xl"
                : "border-(--wwf-ocean)/20 bg-(--wwf-ocean) hover:border-(--wwf-ocean)/40 hover:bg-(--wwf-ocean)/10"
            }`}
          >
            <button
              onClick={() => toggleAccordion(index)}
              className="group flex w-full items-center justify-between gap-4 px-6 py-5 text-left focus:outline-none"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors ${
                    isOpen
                      ? "bg-(--wwf-coral) text-white shadow-(--wwf-coral)/20 shadow-md"
                      : "bg-white text-(--wwf-ocean) shadow-sm group-hover:bg-(--wwf-ocean) group-hover:text-white"
                  }`}
                >
                  <HelpCircle size={20} />
                </div>
                <h3
                  className={`font-wwf text-xl tracking-wide transition-colors sm:text-2xl ${
                    isOpen
                      ? "text-(--wwf-ocean-deep)"
                      : "text-white group-hover:text-(--wwf-ocean-dark)"
                  }`}
                >
                  {faq.question}
                </h3>
              </div>

              {/* PLUS / MINUS ICONS */}
              <div className="shrink-0 transition-all duration-300">
                {isOpen ? (
                  <Minus size={24} className="text-(--wwf-coral)" />
                ) : (
                  <Plus
                    size={24}
                    className="text-white group-hover:text-(--wwf-ocean-dark)"
                  />
                )}
              </div>
            </button>

            {/* SMOOTH COLLAPSE ANIMATION USING GRID */}
            <div
              className={`grid transition-all duration-300 ease-in-out ${
                isOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="px-2 pt-2 pb-6 pl-18 sm:px-6">
                  <p className="text-base leading-relaxed font-medium text-slate-700">
                    {faq.answer}
                  </p>

                  {/* Render Bullet Points if they exist */}
                  {faq.list && (
                    <ul className="mt-4 space-y-3 text-base font-medium text-slate-700">
                      {faq.list.map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-(--wwf-coral)" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Render Link if it exists */}
                  {faq.link && (
                    <div className="mt-5">
                      <a
                        href={faq.link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center rounded-full bg-(--wwf-ocean)/10 px-4 py-2 font-bold text-(--wwf-ocean-deep) transition-colors hover:bg-(--wwf-ocean) hover:text-white"
                      >
                        {faq.link.text} &rarr;
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
