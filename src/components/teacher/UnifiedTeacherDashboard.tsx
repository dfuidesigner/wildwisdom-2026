import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import api from "@/lib/axios"
import { QueryProvider } from "@/components/providers/QueryProvider"
import { toast } from "sonner"
import { useAuth } from "@/hooks/useAuth"
import {
  Users,
  Activity,
  Copy,
  MapPin,
  Mail,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  ArrowUpDown,
  Key,
  Trophy,
  Medal,
  CheckCircle2,
  Map,
  Clock,
  Phone,
  ShieldAlert,
  Lock,
  KeyRound,
  EyeOff,
  Eye,
} from "lucide-react"
import type { PaginatedStudents, Stats } from "@/types/teacher"
import type { School } from "@/types/school"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

// Utility Time Formatter
const formatTime = (seconds?: number) => {
  if (seconds === undefined || seconds === null) return "0s"
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return m > 0 ? `${m}m ${s}s` : `${s}s`
}

function DashboardContent() {
  const { user } = useAuth()
  const [page, setPage] = useState(1)

  const [gradeFilter, setGradeFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [scoreSort, setScoreSort] = useState("desc")
  const PLATFORM_SLUG = import.meta.env.PUBLIC_PLATFORM_SLUG || "wildwisdom"

  const baseUrl = import.meta.env.BASE_URL || "/"

  // ==========================================
  // API Queries
  // ==========================================

  const { data: school, isLoading: isLoadingSchool } = useQuery<School>({
    queryKey: ["teacherSchoolInfo", PLATFORM_SLUG],
    queryFn: async () => {
      const response = await api.get(`/teacher/${PLATFORM_SLUG}/school-info`)
      return response.data.data
    },
  })

  const { data: stats, isLoading: isLoadingStats } = useQuery<Stats>({
    queryKey: ["teacherStats", PLATFORM_SLUG],
    queryFn: async () => {
      const response = await api.get(`/teacher/${PLATFORM_SLUG}/stats`)
      return response.data.data
    },
  })
  const { data: top2 } = useQuery<
    {
      id: number
      name: string
      total_score: number
      total_time_taken: number
    }[]
  >({
    queryKey: ["teacherTop2", PLATFORM_SLUG],
    queryFn: async () => {
      const response = await api.get(`/teacher/${PLATFORM_SLUG}/students/top2`)
      return response.data.data
    },
  })

  const [visiblePasswords, setVisiblePasswords] = useState<Set<number>>(
    new Set()
  )

  const togglePassword = (id: number) => {
    setVisiblePasswords((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const { data: paginationData, isLoading: isLoadingStudents } =
    useQuery<PaginatedStudents>({
      queryKey: [
        "teacherStudents",
        page,
        gradeFilter,
        statusFilter,
        scoreSort,
        PLATFORM_SLUG,
      ],
      queryFn: async () => {
        const params = new URLSearchParams()
        params.append("page", page.toString())

        if (gradeFilter) params.append("grade", gradeFilter)
        if (statusFilter) params.append("status", statusFilter)
        if (scoreSort) {
          params.append("sort_by", "total_score")
          params.append("sort_dir", scoreSort)
        }

        const response = await api.get(
          `/teacher/${PLATFORM_SLUG}/students?${params.toString()}`
        )
        return response.data.data
      },
    })

  // ==========================================
  // Utility Functions
  // ==========================================

  const copyCode = () => {
    if (school?.unique_code) {
      navigator.clipboard.writeText(school.unique_code)
      toast.success("Access Code Copied!", {
        description: "Share this code with your students.",
      })
    }
  }

  const exportToCSV = () => {
    const studentsList = paginationData?.data || []
    if (!studentsList || studentsList.length === 0) {
      toast.error("No data to export", {
        description: "The current table is empty.",
      })
      return
    }

    const headers = [
      "Name",
      "Email",
      "Phone Number",
      "Grade",
      "Status",
      "Current Progress",
      "Points",
      "Time Taken",
      "Joined Date",
    ]

    const rows = studentsList.map((s) => {
      let progressText = "Not Started"
      if (s.status === "Completed") progressText = "Finished All"
      else if (s.status === "Active")
        progressText = `On Stage ${s.levels_completed + 1}`

      return [
        `"${s.name}"`,
        `"${s.email}"`,
        `"${s.phone_number || "N/A"}"`,
        `"${s.grade || "N/A"}"`,
        `"${s.status}"`,
        `"${progressText}"`,
        s.total_score,
        `"${formatTime(s.total_time_taken)}"`,
        `"${new Date(s.joined_at).toLocaleDateString()}"`,
      ]
    })

    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.join(",")),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `student_list_page_${page}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.success("Export Complete", {
      description: "Student data has been downloaded.",
    })
  }

  // ==========================================
  // Render Helpers
  // ==========================================
  const students = paginationData?.data || []

  const firstPlaceId = top2?.[0]?.id
  const secondPlaceId = top2?.[1]?.id

  return (
    <div className="relative mx-auto max-w-7xl space-y-10 pb-12">
      <div className="pointer-events-none absolute top-0 -left-[20%] z-0 h-160 w-160 rounded-full bg-(--wwf-sea-green)/15 mix-blend-multiply blur-[120px] max-[768px]:hidden" />
      <div className="pointer-events-none absolute top-[30%] -right-[15%] z-0 h-140 w-140 rounded-full bg-(--wwf-ocean-light)/10 mix-blend-multiply blur-[100px] max-[768px]:hidden" />
      <div className="pointer-events-none absolute bottom-0 -left-[10%] z-0 h-180 w-180 rounded-full bg-(--wwf-ocean)/15 mix-blend-multiply blur-[130px] max-[768px]:hidden" />

      <img
        src={`${baseUrl}images/blue-fish.webp`}
        alt=""
        className="pointer-events-none absolute -top-10 right-0 z-0 w-32 opacity-15 transition-transform duration-1000 hover:translate-x-5 sm:top-20 sm:-right-10 md:w-48 lg:-right-20 lg:opacity-25"
      />
      <img
        src={`${baseUrl}images/svgs/dark-cora-right.svg`}
        alt=""
        className="pointer-events-none absolute top-[40%] -left-10 z-0 w-24 opacity-15 md:w-32 lg:-left-20 lg:opacity-20"
      />

      <section className="relative z-10 mt-5 overflow-hidden rounded-[2rem] border border-(--wwf-ocean-light)/10 bg-white/90 p-6 shadow-lg backdrop-blur-xl sm:p-8 md:p-10">
        <img
          src={`${baseUrl}images/gold-fish.webp`}
          alt=""
          className="pointer-events-none absolute right-1/4 bottom-1 z-0 w-16 opacity-20 md:w-15"
        />

        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          {/* Left Side: Greeting & Role */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-3 md:gap-4">
              <h2 className="font-wwf text-5xl tracking-[0.5px] text-(--wwf-ocean-deep) md:text-5xl">
                Hi, {user?.name || "Educator"}
              </h2>
              {user?.role && (
                <span className="mt-2 inline-flex items-center rounded-md bg-[#FFF0E5] px-2.5 py-1 text-[11px] font-black tracking-widest text-(--wwf-coral) uppercase sm:mt-0">
                  {user.role === "teacher" ? "Teacher" : "Student"}
                </span>
              )}
            </div>
            <p className="text-lg font-medium text-(--wwf-ocean) md:text-xl">
              Overview of your school's progress in the challenge.
            </p>
          </div>

          {/* Right Side: School Info */}
          <div className="border-t border-(--wwf-ocean-light)/15 pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8 lg:text-right">
            {isLoadingSchool ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-48 bg-(--wwf-ocean)/10 lg:ml-auto" />
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:justify-end">
                  <Skeleton className="h-5 w-32 bg-(--wwf-ocean)/10" />
                  <Skeleton className="h-5 w-40 bg-(--wwf-ocean)/10" />
                </div>
              </div>
            ) : (
              <>
                <h1 className="font-wwf text-3xl tracking-wider text-(--wwf-ocean-deep) md:text-4xl">
                  {school ? school.school_name : "School Information"}
                </h1>
                <div className="mt-3 flex flex-col gap-2 text-sm font-semibold text-(--wwf-ocean) sm:flex-row sm:items-center lg:justify-end lg:gap-4">
                  <span className="flex items-center gap-1.5 lg:justify-end">
                    <MapPin size={16} className="text-(--wwf-coral)" />
                    <span className="truncate">
                      {school?.school_city}, {school?.school_state}
                    </span>
                  </span>
                  <span className="hidden h-1.5 w-1.5 rounded-full bg-(--wwf-ocean-light)/30 sm:block" />
                  <span className="flex items-center gap-1.5 lg:justify-end">
                    <Mail size={16} className="text-(--wwf-coral)" />
                    <span className="truncate">{school?.principal_email}</span>
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="relative z-10 rounded-[2rem] border-2 border-amber-300 bg-amber-50 p-6 shadow-md sm:p-8">
        <div className="mb-3 flex items-center gap-2 text-amber-900">
          <ShieldAlert size={22} className="shrink-0" />
          <h3 className="text-base font-black tracking-wide uppercase md:text-lg">
            Disclaimer
          </h3>
        </div>
        <p className="text-sm leading-relaxed font-semibold text-amber-950 md:text-base">
          Dear teachers, your students may be able to clear the Classroom
          Challenge round using AI tools, however, they will not be able to
          perform as well in subsequent rounds, since those rounds use different
          formats and platforms. We therefore request that you ensure students
          complete the quizzes without resorting to unfair means, so that the
          most capable students genuinely qualify for the next round.
        </p>
      </section>

      {/* 3. Key Metrics Grid */}
      <section className="relative z-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Access Code Card */}
        <div className="group flex flex-col justify-between rounded-[2rem] border-2 border-(--wwf-ocean)/10 bg-linear-to-br from-(--wwf-ocean)/5 to-white/60 p-6 shadow-md backdrop-blur-xl transition-all hover:border-(--wwf-ocean)/30 hover:shadow-lg">
          <div className="mb-6 flex items-center justify-between">
            <span className="text-xs font-bold tracking-widest text-(--wwf-ocean-deep) uppercase">
              School Quiz Code
            </span>
            <div className="rounded-xl bg-white p-2.5 text-(--wwf-coral) shadow-sm transition-transform group-hover:scale-110">
              <Key size={20} />
            </div>
          </div>
          <div>
            {isLoadingSchool ? (
              <Skeleton className="h-12 w-32 bg-(--wwf-ocean)/10" />
            ) : (
              <div className="flex items-center gap-4">
                <span className="font-mono text-4xl font-black tracking-widest text-(--wwf-ocean-deep)">
                  {school?.unique_code || "------"}
                </span>
                <button
                  onClick={copyCode}
                  className="rounded-xl bg-white p-2.5 text-(--wwf-ocean) shadow-sm transition-all hover:-translate-y-1 hover:text-(--wwf-coral) hover:shadow active:translate-y-0"
                >
                  <Copy size={20} />
                </button>
              </div>
            )}
            <p className="mt-3 text-sm font-semibold text-(--wwf-ocean-deep)/60">
              Share this code with students to join
            </p>
          </div>
        </div>

        {/* Expected Students */}
        <div className="flex flex-col justify-between rounded-[2rem] border border-(--wwf-ocean-light)/10 bg-white/90 p-6 shadow-md backdrop-blur-xl">
          <div className="mb-6 flex items-center justify-between">
            <span className="text-xs font-bold tracking-widest text-(--wwf-ocean-light)/70 uppercase">
              Expected Students
            </span>

            <div className="rounded-xl bg-linear-to-br from-(--wwf-ocean-light)/5 to-(--wwf-ocean-light)/10 p-2.5 text-(--wwf-ocean-deep) shadow-xs">
              <Users size={20} />
            </div>
          </div>

          <div>
            {isLoadingSchool ? (
              <Skeleton className="h-12 w-20 bg-(--wwf-ocean)/10" />
            ) : (
              <div className="font-wwf text-5xl tracking-wider text-(--wwf-ocean-deep) md:text-6xl">
                {school?.school_expected_students || 0}
              </div>
            )}

            <p className="mt-3 text-sm font-semibold text-(--wwf-ocean-light)/60">
              Expected number of students
            </p>
          </div>
        </div>

        {/* Total Students */}
        <div className="flex flex-col justify-between rounded-[2rem] border border-(--wwf-ocean-light)/10 bg-white/90 p-6 shadow-md backdrop-blur-xl">
          <div className="mb-6 flex items-center justify-between">
            <span className="text-xs font-bold tracking-widest text-(--wwf-ocean-light)/70 uppercase">
              Total Students
            </span>
            <div className="rounded-xl bg-linear-to-br from-(--wwf-ocean-light)/5 to-(--wwf-ocean-light)/10 p-2.5 text-(--wwf-ocean-deep) shadow-xs">
              <Users size={20} />
            </div>
          </div>
          <div>
            {isLoadingStats ? (
              <Skeleton className="h-12 w-20 bg-(--wwf-ocean)/10" />
            ) : (
              <div className="font-wwf text-5xl tracking-wider text-(--wwf-ocean-deep) md:text-6xl">
                {stats?.total_registered || 0}
              </div>
            )}
            <p className="mt-3 text-sm font-semibold text-(--wwf-ocean-light)/60">
              Students who have registered
            </p>
          </div>
        </div>

        {/* Active Students */}
        <div className="flex flex-col justify-between rounded-[2rem] border border-(--wwf-ocean-light)/10 bg-white/90 p-6 shadow-md backdrop-blur-xl sm:col-span-2 lg:col-span-1">
          <div className="mb-6 flex items-center justify-between">
            <span className="text-xs font-bold tracking-widest text-(--wwf-ocean-light)/70 uppercase">
              Active Students
            </span>
            <div className="rounded-xl bg-linear-to-br from-(--wwf-sea-green)/10 to-(--wwf-sea-green)/20 p-2.5 text-(--wwf-ocean-deep) shadow-xs">
              <Activity size={20} />
            </div>
          </div>
          <div>
            {isLoadingStats ? (
              <Skeleton className="h-12 w-20 bg-(--wwf-ocean)/10" />
            ) : (
              <div className="font-wwf text-5xl tracking-wider text-(--wwf-ocean-deep) md:text-6xl">
                {stats?.active_playing || 0}
              </div>
            )}
            <p className="mt-3 text-sm font-semibold text-(--wwf-ocean-light)/60">
              Students currently playing
            </p>
          </div>
        </div>
      </section>

      {/* 4. Data Table Section */}
      <section className="relative z-10 overflow-hidden rounded-[2rem] border border-(--wwf-ocean-light)/10 bg-white/90 shadow-lg backdrop-blur-xl">
        {/* Table Toolbar / Filters */}
        <div className="flex flex-col gap-6 border-b border-(--wwf-ocean-light)/10 bg-white/50 p-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h3 className="font-wwf text-3xl tracking-wide text-(--wwf-ocean-deep)">
              Student List
            </h3>
            <p className="mt-1 text-sm font-semibold text-(--wwf-ocean)">
              Viewing {paginationData?.total || 0} students.
            </p>
          </div>

          <div className="flex flex-col flex-wrap items-stretch gap-3 sm:flex-row sm:items-center">
            {/* Sort Dropdown */}
            <div className="flex flex-1 items-center gap-2 rounded-xl border border-(--wwf-ocean-light)/20 bg-white/80 px-4 py-2.5 shadow-sm transition-colors focus-within:border-(--wwf-ocean) hover:border-(--wwf-ocean) sm:flex-none">
              <ArrowUpDown size={16} className="shrink-0 text-(--wwf-coral)" />
              <select
                value={scoreSort}
                onChange={(e) => {
                  setScoreSort(e.target.value)
                  setPage(1)
                }}
                className="w-full cursor-pointer bg-transparent text-sm font-bold text-(--wwf-ocean-deep) outline-none"
              >
                <option value="desc">Points: High to Low</option>
                <option value="asc">Points: Low to High</option>
              </select>
            </div>

            {/* Grade Filter */}
            <div className="flex flex-1 items-center gap-2 rounded-xl border border-(--wwf-ocean-light)/20 bg-white/80 px-4 py-2.5 shadow-sm transition-colors focus-within:border-(--wwf-ocean) hover:border-(--wwf-ocean) sm:flex-none">
              <Filter size={16} className="shrink-0 text-(--wwf-ocean-deep)" />
              <select
                value={gradeFilter}
                onChange={(e) => {
                  setGradeFilter(e.target.value)
                  setPage(1)
                }}
                className="w-full cursor-pointer bg-transparent text-sm font-bold text-(--wwf-ocean-deep) outline-none"
              >
                <option value="">All Grades</option>

                <option value="6">Grade 6</option>
                <option value="7">Grade 7</option>
                <option value="8">Grade 8</option>
                <option value="9">Grade 9</option>
                {/* {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Grade {i + 1}
                  </option>
                ))} */}
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex flex-1 items-center gap-2 rounded-xl border border-(--wwf-ocean-light)/20 bg-white/80 px-4 py-2.5 shadow-sm transition-colors focus-within:border-(--wwf-ocean) hover:border-(--wwf-ocean) sm:flex-none">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value)
                  setPage(1)
                }}
                className="w-full cursor-pointer bg-transparent text-sm font-bold text-(--wwf-ocean-deep) outline-none"
              >
                <option value="">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            {/* Export Button */}
            <button
              onClick={exportToCSV}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-(--wwf-ocean-deep) to-(--wwf-ocean-light) px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 sm:flex-none"
            >
              <Download size={16} /> Export CSV
            </button>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <Table className="w-full min-w-200 text-left">
            <TableHeader className="bg-white/40">
              <TableRow className="border-b border-(--wwf-ocean-light)/10 hover:bg-transparent">
                <TableHead className="px-6 py-5 text-[11px] font-black tracking-widest text-(--wwf-ocean-light)/70 uppercase">
                  Student
                </TableHead>
                <TableHead className="px-6 py-5 text-center text-[11px] font-black tracking-widest text-(--wwf-ocean-light)/70 uppercase">
                  Grade/Roll Number/Section
                </TableHead>
                <TableHead className="px-6 py-5 text-center text-[11px] font-black tracking-widest text-(--wwf-ocean-light)/70 uppercase">
                  Status
                </TableHead>
                <TableHead className="px-6 py-5 text-center text-[11px] font-black tracking-widest text-(--wwf-ocean-light)/70 uppercase">
                  Progress
                </TableHead>
                <TableHead className="px-6 py-5 text-right text-[11px] font-black tracking-widest text-(--wwf-ocean-light)/70 uppercase">
                  Score & Time
                </TableHead>
                <TableHead className="px-6 py-5 text-right text-[11px] font-black tracking-widest text-(--wwf-ocean-light)/70 uppercase">
                  Joined
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-(--wwf-ocean-light)/10">
              {isLoadingStudents ? (
                // Loading Skeletons
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="hover:bg-transparent">
                    <TableCell className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <Skeleton className="h-10 w-10 shrink-0 rounded-full bg-(--wwf-ocean)/10" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-32 bg-(--wwf-ocean)/10" />
                          <Skeleton className="h-3 w-24 bg-(--wwf-ocean)/10" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-5">
                      <Skeleton className="mx-auto h-5 w-12 rounded-md bg-(--wwf-ocean)/10" />
                    </TableCell>
                    <TableCell className="px-6 py-5">
                      <Skeleton className="mx-auto h-6 w-20 rounded-full bg-(--wwf-ocean)/10" />
                    </TableCell>
                    <TableCell className="px-6 py-5">
                      <Skeleton className="mx-auto h-4 w-16 bg-(--wwf-ocean)/10" />
                    </TableCell>
                    <TableCell className="px-6 py-5">
                      <div className="flex flex-col items-end gap-2">
                        <Skeleton className="ml-auto h-6 w-16 bg-(--wwf-ocean)/10" />
                        <Skeleton className="ml-auto h-4 w-20 bg-(--wwf-ocean)/10" />
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-5">
                      <Skeleton className="ml-auto h-4 w-20 bg-(--wwf-ocean)/10" />
                    </TableCell>
                  </TableRow>
                ))
              ) : students.length === 0 ? (
                // Empty State
                <TableRow>
                  <TableCell colSpan={6} className="py-20 text-center">
                    <div className="flex flex-col items-center justify-center gap-4">
                      <Users
                        size={40}
                        className="text-(--wwf-ocean-light)/20"
                      />
                      <p className="text-base font-bold text-(--wwf-ocean)">
                        No students match your search.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                // Actual Data Rows
                students.map((student) => {
                  const isFirst = student.id === firstPlaceId
                  const isSecond = student.id === secondPlaceId

                  return (
                    <TableRow
                      key={student.id}
                      className={`transition-colors ${
                        isFirst
                          ? "bg-[#FFD700]/5 hover:bg-[#FFD700]/10"
                          : isSecond
                            ? "bg-[#C0C0C0]/5 hover:bg-[#C0C0C0]/10"
                            : "hover:bg-(--wwf-ocean-light)/5"
                      }`}
                    >
                      <TableCell className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center gap-4">
                          {/* Rank Icon or Initial */}
                          {isFirst ? (
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFD700]/20 text-[#D4AF37] shadow-sm">
                              <Trophy size={18} />
                            </div>
                          ) : isSecond ? (
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#C0C0C0]/20 text-[#808080] shadow-sm">
                              <Medal size={18} />
                            </div>
                          ) : (
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-(--wwf-ocean-light)/10 bg-white/80 font-wwf text-xl text-(--wwf-ocean-deep) shadow-sm">
                              {student.name.charAt(0).toUpperCase()}
                            </div>
                          )}

                          <div>
                            <div className="text-sm font-bold text-(--wwf-ocean-deep)">
                              {student.name}
                            </div>

                            <div className="text-xs font-semibold text-(--wwf-ocean)">
                              {student.email}
                            </div>

                            {/* {student.phone_number && (
                              <div className="flex items-center gap-1 text-xs font-semibold text-(--wwf-ocean-deep)/60">
                                <Phone
                                  size={12}
                                  className="text-(--wwf-coral)"
                                />
                                {student.phone_number}
                              </div>
                            )} */}

                            {student.is_new_account ? (
                              <>
                                <div className="mt-1 flex items-center gap-1.5 text-xs font-bold text-(--wwf-ocean-deep)">
                                  <KeyRound
                                    size={12}
                                    className="text-(--wwf-coral)"
                                  />
                                  ID: {student.login_id}
                                </div>
                                <div className="mt-1 flex items-center gap-1.5 text-xs font-bold text-(--wwf-ocean-deep)">
                                  <Lock
                                    size={12}
                                    className="text-(--wwf-coral)"
                                  />
                                  {visiblePasswords.has(student.id)
                                    ? student.password
                                    : "••••••••"}
                                  <button
                                    onClick={() => togglePassword(student.id)}
                                    className="text-(--wwf-ocean) hover:text-(--wwf-coral)"
                                  >
                                    {visiblePasswords.has(student.id) ? (
                                      <EyeOff size={12} />
                                    ) : (
                                      <Eye size={12} />
                                    )}
                                  </button>
                                </div>
                              </>
                            ) : (
                              <div className="mt-1 text-xs font-semibold text-(--wwf-ocean-deep)/40">
                                Uses email/phone login — self-service password
                                reset available
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      {/* Grade */}
                      <TableCell className="px-6 py-5 text-center whitespace-nowrap">
                        <span className="inline-flex rounded-md bg-(--wwf-ocean-light)/10 px-2.5 py-1 text-[11px] font-black text-(--wwf-ocean-deep) uppercase">
                          {student.grade || "N/A"}/
                          {student.roll_number || "N/A"}/
                          {student.section || "N/A"}
                        </span>
                      </TableCell>

                      {/* Status */}
                      <TableCell className="px-6 py-5 text-center whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black tracking-widest uppercase shadow-xs ${
                            student.status === "Completed"
                              ? "bg-(--wwf-ocean-deep) text-white"
                              : student.status === "Active"
                                ? "bg-(--wwf-coral)/15 text-(--wwf-coral)"
                                : "border border-(--wwf-ocean-light)/20 bg-white/60 text-(--wwf-ocean-deep)/60"
                          }`}
                        >
                          {student.status === "Completed" ? (
                            <CheckCircle2 size={12} />
                          ) : (
                            <Activity
                              size={12}
                              className={
                                student.status === "Active"
                                  ? "animate-pulse"
                                  : ""
                              }
                            />
                          )}
                          {student.status}
                        </span>
                      </TableCell>

                      {/* Progress Stage */}
                      <TableCell className="px-6 py-5 text-center whitespace-nowrap">
                        <div className="flex flex-col items-center justify-center">
                          {student.status === "Pending" ? (
                            <span className="text-xs font-bold text-(--wwf-ocean-deep)/40">
                              -
                            </span>
                          ) : student.status === "Completed" ? (
                            <span className="text-xs font-black text-(--wwf-ocean-deep)">
                              Finished All
                            </span>
                          ) : (
                            <div className="flex items-center gap-1.5 text-xs font-bold text-(--wwf-ocean-deep)">
                              <Map size={14} className="text-(--wwf-orange)" />
                              Stage {student.levels_completed + 1}
                            </div>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="px-6 py-5 text-right whitespace-nowrap">
                        <div className="flex flex-col items-end gap-1">
                          <div className="flex items-end gap-3">
                            <div className="mb-0.5 flex items-center gap-1.5 text-xs font-bold text-(--wwf-ocean-deep)/60">
                              <Clock size={12} />
                              {formatTime(student.total_time_taken)}
                            </div>
                            <div className="font-mono text-lg font-black text-(--wwf-ocean-deep) tabular-nums">
                              {student.total_score.toLocaleString()}
                            </div>
                          </div>

                          {student.level_breakdowns &&
                            student.level_breakdowns.length > 0 && (
                              <div className="mt-1 flex justify-end gap-1">
                                {student.level_breakdowns.map((lvl) => (
                                  <div
                                    key={lvl.level_number}
                                    className="cursor-help rounded bg-(--wwf-ocean-light)/20 px-1.5 py-0.5 text-[10px] font-bold text-(--wwf-ocean-deep) transition-colors hover:bg-(--wwf-ocean-light)/40"
                                    title={`Level ${lvl.level_number}: ${lvl.score} pts in ${formatTime(lvl.time_taken!)}`}
                                  >
                                    L{lvl.level_number}:{" "}
                                    <span className="text-(--wwf-ocean)">
                                      {lvl.score}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                        </div>
                      </TableCell>

                      {/* Joined Date */}
                      <TableCell className="px-6 py-5 text-right text-xs font-bold whitespace-nowrap text-(--wwf-ocean-deep)/70">
                        {new Date(student.joined_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Footer */}
        {paginationData && paginationData.last_page > 1 && (
          <div className="flex flex-col items-center justify-between gap-4 border-t border-(--wwf-ocean-light)/10 bg-white/50 px-6 py-5 sm:flex-row">
            <span className="text-[11px] font-black tracking-widest text-(--wwf-ocean-deep) uppercase">
              Page {paginationData.current_page} of {paginationData.last_page}
            </span>
            <div className="flex w-full gap-3 sm:w-auto">
              <button
                onClick={() => setPage((old) => Math.max(old - 1, 1))}
                disabled={page === 1}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-(--wwf-ocean-light)/20 bg-white px-5 py-2.5 text-xs font-bold text-(--wwf-ocean-deep) shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md disabled:pointer-events-none disabled:opacity-50 sm:flex-none"
              >
                <ChevronLeft size={16} /> Prev
              </button>
              <button
                onClick={() =>
                  setPage((old) =>
                    paginationData.last_page > old ? old + 1 : old
                  )
                }
                disabled={page === paginationData.last_page}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-(--wwf-ocean-light)/20 bg-white px-5 py-2.5 text-xs font-bold text-(--wwf-ocean-deep) shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md disabled:pointer-events-none disabled:opacity-50 sm:flex-none"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

export function UnifiedTeacherDashboard() {
  return (
    <QueryProvider>
      <DashboardContent />
    </QueryProvider>
  )
}
