import {
  ClipboardList,
  HelpCircle,
  Clock,
  Award,
  Info,
  Check,
  FileText,
  Medal,
  ShieldAlert,
  ArrowLeft,
} from "lucide-react"
import OceanElement from "../home/OceanElement"

const baseUrl = import.meta.env.BASE_URL

export function QuizGuidelines() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-slate-900 py-12 md:py-16">
      <OceanElement
        src={`${baseUrl}images/two-fish.webp`}
        type="fish"
        delay={0.2}
        className="absolute right-0 bottom-20 w-16 opacity-50 sm:w-20 md:bottom-10 md:w-30 md:opacity-80 lg:w-30 xl:right-30"
      />
      <OceanElement
        src={`${baseUrl}images/pink-weed.webp`}
        type="coral"
        delay={1.2}
        className="absolute bottom-[20%] w-15 max-[769px]:rotate-y-180! md:top-40 md:right-0 md:w-20"
      />
      <OceanElement
        src={`${baseUrl}images/svgs/dark-blue-coral.svg`}
        type="coral"
        delay={0.5}
        className="absolute -bottom-16 -left-5 w-25 opacity-70 md:-bottom-25 md:left-5 md:w-40 lg:-bottom-35 lg:left-0 lg:w-auto"
      />
      <OceanElement
        src={`${baseUrl}images/blue-fish.webp`}
        type="fish"
        delay={0}
        className="absolute top-10 left-20 z-0 w-18 opacity-50 sm:left-[40%] md:left-[30%] md:w-25 lg:left-[10%] lg:w-40 xl:top-[20%] xl:left-[5%] xl:w-35"
      />

      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage: `url('${import.meta.env.BASE_URL}images/quiz-bg.png')`,
        }}
      />

      {/* FOREGROUND CARD */}
      <div className="relative z-10 mx-auto max-w-6xl space-y-12 rounded-[2.5rem] bg-white px-6 py-12 shadow-2xl sm:px-10 lg:px-12">
        {/* Header Utilities */}
        <div className="flex flex-col gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-wwf text-3xl text-(--wwf-ocean-deep) md:text-4xl">
              Classroom Challenge Round Instructions
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Classroom Challenge Round - structure & instructions.
            </p>
          </div>
          <a
            href={`${baseUrl}play/levels`}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-(--wwf-ocean-deep) shadow-sm transition-all hover:bg-slate-50 active:scale-95"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </a>
        </div>

        {/* Round Overview */}
        <div className="-mt-6 space-y-3 text-sm leading-relaxed text-slate-600 md:text-base">
          <p>
            The Classroom Challenge is the opening round of the Wild Wisdom
            Global Challenge, conducted entirely online for the WWGC registered
            schools via the quiz platform.
          </p>
          <p>
            Every registered student takes part in a series of{" "}
            <strong>four online quiz levels</strong>, attempting each one in
            turn. Scores from all four quizzes are added up to calculate a
            cumulative total for each student.
          </p>
          <p>
            At the end of the round, the{" "}
            <strong>top two scorers from every participating school</strong>{" "}
            advance to the next stage — the <strong>State Level Round</strong>.
          </p>
          <p>
            Since the entire challenge runs online, students can log in and
            complete their quizzes right from their classroom or school portal
            or at home, with no separate registration needed beyond being an
            already-registered participant.
          </p>
          <p>
            It is mandatory for students to complete{" "}
            <strong>all four quiz rounds</strong> to be eligible for the{" "}
            <strong>State Level Round</strong>. Skipping{" "}
            <strong>any round</strong> will result in{" "}
            <strong>disqualification</strong>, regardless of the scores achieved
            in the completed rounds.
          </p>
        </div>

        {/* Instructions Modules (Format, Ranking, Metrics) */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <HelpCircle size={24} className="text-(--wwf-ocean-deep)" />
            <h3 className="text-xl font-bold text-(--wwf-ocean-deep) md:text-2xl">
              Instructions for Students
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Card Module 1: Format & Scoring */}
            <div className="flex flex-col justify-between rounded-2xl border-2 border-(--wwf-ocean-light)/20 bg-slate-50/50 p-6 shadow-sm transition-all hover:shadow-md">
              <div>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-(--wwf-ocean)/10 text-(--wwf-ocean)">
                  <Clock size={20} />
                </div>
                <h4 className="mb-3 text-lg font-bold text-(--wwf-ocean-deep)">
                  Quiz Format & Scoring
                </h4>
                <ul className="space-y-3 text-sm leading-relaxed text-slate-600">
                  <li className="flex gap-2">
                    <Check
                      size={16}
                      className="mt-0.5 shrink-0 text-(--wwf-ocean-deep)"
                    />
                    <span>
                      The Classroom Challenge consists of four quiz rounds.
                      Students must attempt all four rounds to be eligible for
                      qualification to the State Level Round.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <Check
                      size={16}
                      className="mt-0.5 shrink-0 text-(--wwf-ocean-deep)"
                    />
                    <span>
                      Each quiz round will include 15 questions, with 15 points
                      awarded for every correct answer.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <Check
                      size={16}
                      className="mt-0.5 shrink-0 text-(--wwf-ocean-deep)"
                    />
                    <span>Time to complete each quiz round is 8 minutes.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-2xl border-2 border-(--wwf-coral)/20 bg-slate-50/50 p-6 shadow-sm transition-all hover:shadow-md">
              <div>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-(--wwf-coral)/10 text-(--wwf-coral)">
                  <Award size={20} />
                </div>
                <h4 className="mb-3 text-lg font-bold text-(--wwf-ocean-deep)">
                  Ranking & Qualification
                </h4>
                <ul className="space-y-3 text-sm leading-relaxed text-slate-600">
                  <li className="flex gap-2">
                    <Check
                      size={16}
                      className="mt-0.5 shrink-0 text-(--wwf-coral)"
                    />
                    <span>
                      The final score will be calculated based on the cumulative
                      score across all four quiz rounds.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <Check
                      size={16}
                      className="mt-0.5 shrink-0 text-(--wwf-coral)"
                    />
                    <span>
                      In the event of a tie, the student who completes the quiz
                      in the shortest time will be ranked higher.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <Check
                      size={16}
                      className="mt-0.5 shrink-0 text-(--wwf-coral)"
                    />
                    <span>
                      The top two students from each participating school, based
                      on the cumulative score across all four rounds, will
                      advance to the State Level Round.
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-2xl border-2 border-(--wwf-orange)/20 bg-slate-50/50 p-6 shadow-sm transition-all hover:shadow-md">
              <div>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-(--wwf-orange)/10 text-(--wwf-orange)">
                  <FileText size={20} />
                </div>
                <h4 className="mb-3 text-lg font-bold text-(--wwf-ocean-deep)">
                  Important Metrics
                </h4>
                <ul className="space-y-3 text-sm leading-relaxed text-slate-600">
                  <li className="flex gap-2">
                    <Check
                      size={16}
                      className="mt-0.5 shrink-0 text-(--wwf-orange)"
                    />
                    <p>
                      It is mandatory for students to complete{" "}
                      <strong>all four quiz rounds</strong> to be eligible for
                      the <strong>State Level Round</strong>. Skipping
                      <strong> any round</strong> will result in
                      <strong> disqualification</strong>, regardless of the
                      scores achieved in the completed rounds.
                    </p>
                  </li>
                  <li className="flex gap-2">
                    <Check
                      size={16}
                      className="mt-0.5 shrink-0 text-(--wwf-orange)"
                    />
                    <p>
                      <strong>Eligibility Note:</strong> It is mandatory for a
                      school to have{" "}
                      <strong>at least two participating students</strong> to be
                      eligible for the State Level Round. If only one student
                      from a school takes part, that school will{" "}
                      <strong>not qualify</strong> for the next round.
                    </p>
                  </li>
                  <li className="flex gap-2">
                    <Check
                      size={16}
                      className="mt-0.5 shrink-0 text-(--wwf-orange)"
                    />
                    <p>
                      <strong>Tie-Breaker Rule:</strong> In case two or more
                      students have the same cumulative score, the student with
                      the <strong>lesser cumulative time taken</strong> across
                      the four quizzes will be given preference in the
                      selection.
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Dashboard Context Bar */}
          <div className="grid grid-cols-1 gap-4 rounded-2xl border-2 border-(--wwf-ocean-light)/10 bg-(--wwf-ocean)/5 p-4 text-sm text-slate-600 md:grid-cols-2">
            <div className="flex items-start gap-2 rounded-xl bg-white p-3 shadow-sm">
              <Info size={16} className="mt-0.5 shrink-0 text-(--wwf-ocean)" />
              <span>
                <strong>Student Dashboard:</strong> Students can track their
                quiz progress and view their scores through the dashboard.
              </span>
            </div>
            <div className="flex items-start gap-2 rounded-xl bg-white p-3 shadow-sm">
              <Info size={16} className="mt-0.5 shrink-0 text-(--wwf-ocean)" />
              <span>
                <strong>Teacher Dashboard:</strong> Teachers can monitor the
                participation and performance of students from their school
                through the dashboard.
              </span>
            </div>
          </div>
        </div>

        {/* Procedural Steps, Leaderboards, & Warnings Split Container */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Step Workflow System */}
          <div className="rounded-[2rem] border-2 border-slate-100 bg-white p-6 shadow-sm md:p-8 lg:col-span-2">
            <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4">
              <ClipboardList size={26} className="text-(--wwf-ocean-deep)" />
              <h3 className="text-xl font-bold text-(--wwf-ocean-deep) md:text-2xl">
                WWGC Quiz Portal – Student Registration &amp; Quiz Instructions
              </h3>
            </div>

            <div className="relative ml-4 space-y-6 pl-6">
              {[
                {
                  step: "1",
                  title: "Visit the Quiz Platform",
                  desc: "Open the quiz platform link provided by your teacher coordinator.",
                },
                {
                  step: "2",
                  title: "Sign Up / Register",
                  desc: "Click \u201cSign Up\u201d on the home screen and enter the required details:",
                  list: [
                    "Unique School Code",
                    "Email ID",
                    "Mobile Number",
                    "Class",
                    "Section",
                  ],
                  note: "Get your School Code from your teacher or school coordinator. Entering the correct code ensures that your participation and scores are linked to your school.",
                },
                {
                  step: "3",
                  title: "Verify Your Email",
                  desc: "An OTP will be sent to your authentic mobile number. Enter the OTP to complete the registration and verification process.",
                },
                {
                  step: "4",
                  title: "Log In to Your Dashboard",
                  desc: "Once your account is verified, log in to your student dashboard. You can view:",
                  list: ["Assigned quizzes", "Score history", "Quiz schedules"],
                },
                {
                  step: "5",
                  title: "Click \u201cPlay Now\u201d to Begin",
                  desc: "Select the required quiz round and click \u201cPlay Now.\u201d",
                  note: "Important: The timer starts immediately when the quiz begins.",
                },
                {
                  step: "6",
                  title: "Answer the Questions Carefully",
                  desc: "Read each question carefully and select the correct answer. Click \u201cNext\u201d to move to the next question.",
                },
                {
                  step: "7",
                  title: "Submit Your Quiz",
                  desc: "After answering all the questions, click \u201cSubmit Quiz.\u201d",
                  note: "Once the quiz is submitted, your answers cannot be changed or revisited.",
                },
                {
                  step: "8",
                  title: "Complete All Four Quizzes",
                  desc: "You must complete all 4 quizzes to become eligible for the next round.",
                },
              ].map((item, idx) => (
                <div key={idx} className="relative">
                  <span className="absolute top-0.5 -left-[2.15rem] flex h-7 w-7 items-center justify-center rounded-full bg-(--wwf-ocean-dark) text-sm font-bold text-white shadow-sm">
                    {item.step}
                  </span>
                  <h4 className="text-lg font-bold text-(--wwf-ocean-deep)">
                    {item.title}
                  </h4>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    {item.desc}
                  </p>
                  {item.list && (
                    <ul className="mt-2 space-y-1 pl-1">
                      {item.list.map((li, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm leading-relaxed text-slate-600"
                        >
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-(--wwf-ocean-light)" />
                          {li}
                        </li>
                      ))}
                    </ul>
                  )}
                  {item.note && (
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {item.note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6 lg:col-span-1">
            <div className="rounded-2xl border-2 border-slate-100 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
                <Medal size={22} className="text-(--wwf-orange)" />
                <h3 className="text-xl font-bold text-(--wwf-ocean-deep)">
                  School Leaderboard
                </h3>
              </div>
              <ul className="space-y-3.5 text-sm leading-relaxed text-slate-600">
                <li className="flex gap-2">
                  <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-(--wwf-orange)" />
                  <span>
                    The top two highest-scoring students from each participating
                    school will automatically appear on the teacher dashboard.
                  </span>
                </li>
                <li className="flex gap-2">
                  <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-(--wwf-orange)" />
                  <span>
                    Teachers will be able to view student names, scores, and
                    school rankings.
                  </span>
                </li>
                <li className="flex gap-2">
                  <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-(--wwf-orange)" />
                  <span>
                    Results and rankings will be updated automatically after
                    quiz submissions are processed.
                  </span>
                </li>
              </ul>
            </div>

            {/* Environment/Tab Monitoring Warning Block */}
            <div className="rounded-2xl border-2 border-amber-200 bg-amber-50/80 p-6 shadow-sm">
              <div className="mb-3 flex items-center gap-2 text-amber-800">
                <ShieldAlert size={22} className="shrink-0" />
                <h3 className="text-base font-bold tracking-wide uppercase">
                  Disclaimer
                </h3>
              </div>
              <div className="space-y-3 text-sm leading-relaxed font-semibold text-amber-900">
                <p>
                  The quiz platform actively monitors browser activity
                  throughout the session.
                </p>
                <p>
                  Switching tabs, minimizing the browser window, or navigating
                  away from the quiz page may result in the quiz being
                  automatically submitted, and your one attempt will be
                  considered complete.
                </p>
                <p>
                  Students will not be given a second attempt for the same quiz
                  under any circumstances. Each quiz level must be completed in
                  a single attempt.
                </p>
                <p className="border-t border-amber-300 pt-2 font-bold text-(--wwf-ocean-deep)">
                  Students are strongly advised to remain on the quiz page
                  throughout the session to ensure a smooth and uninterrupted
                  experience.
                </p>
              </div>
            </div>

            {/* Action Button Navigation back to selector */}
            <div className="pt-2">
              <a
                href={`${baseUrl}play/levels`}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-(--wwf-ocean-deep) py-4 font-bold text-white shadow-md transition-all hover:bg-slate-800 hover:shadow-lg active:scale-95"
              >
                Ready to Play?
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
