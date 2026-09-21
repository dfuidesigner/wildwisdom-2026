import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import api from "@/lib/axios"
import { useAuth } from "@/hooks/useAuth"
import {
  Users,
  Download,
  Filter,
  Trophy,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Search,
  MapPin,
  Building2,
} from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"

import { exportAdminDataToCSV } from "@/lib/exportCsv"
import { StudentsTable } from "./StudentsTable"
import type { AdminStats, AdminSchool, AdminStudent } from "@/types/admin"
import { QueryProvider } from "../providers/QueryProvider"
import { SchoolParticipationTable } from "./SchoolParticipationTable"
import { StateStatsTable } from "./StateStatsTable"

type TabType = "students" | "states"

function AdminDashboardContent() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<TabType>("students")
  const [schoolFilter, setSchoolFilter] = useState<string>("")
  const [topFilter, setTopFilter] = useState<number | "all">("all")
  const [page, setPage] = useState(1)

  const [searchInput, setSearchInput] = useState("")
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [stateFilter, setStateFilter] = useState<string>("")

  // debounce the search box
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput.trim()), 400)
    return () => clearTimeout(timer)
  }, [searchInput])

  useEffect(() => {
    setPage(1)
  }, [search, schoolFilter, statusFilter, stateFilter, topFilter])

  const PLATFORM_SLUG = import.meta.env.PUBLIC_PLATFORM_SLUG || "wildwisdom"

  // --- API Queries ---
  const { data: stats, isLoading: loadingStats } = useQuery<AdminStats>({
    queryKey: ["adminStats", PLATFORM_SLUG],
    queryFn: async () =>
      (await api.get(`/admin/${PLATFORM_SLUG}/stats`)).data.data,
  })

  const { data: schools, isLoading: loadingSchools } = useQuery<AdminSchool[]>({
    queryKey: ["adminSchools", PLATFORM_SLUG],
    queryFn: async () =>
      (await api.get(`/admin/${PLATFORM_SLUG}/schools`)).data.data,
  })

  const uniqueStates = Array.from(
    new Set(schools?.map((s) => s.school_state).filter(Boolean))
  ).sort()

  interface PaginatedStudents<T> {
    data: T[]
    current_page: number
    last_page: number
    total: number
  }

  const { data: paginationData, isLoading: loadingStudents } = useQuery<
    PaginatedStudents<AdminStudent>
  >({
    queryKey: [
      "adminStudents",
      page,
      schoolFilter,
      topFilter,
      statusFilter,
      stateFilter,
      search,
      PLATFORM_SLUG,
    ],
    queryFn: async () => {
      const params = new URLSearchParams()

      if (schoolFilter) params.append("school_id", schoolFilter)
      if (statusFilter !== "all") params.append("status", statusFilter)
      if (stateFilter) params.append("state", stateFilter) // NEW
      if (search) params.append("search", search)

      if (topFilter !== "all") {
        params.append("top", topFilter.toString())
      } else {
        params.append("page", page.toString())
      }

      const response = await api.get(
        `/admin/${PLATFORM_SLUG}/students?${params.toString()}`
      )
      return response.data.data
    },
  })

  const displayedStudents = paginationData?.data ?? []

  // --- Handlers ---
  const handleExportCurrentView = () => {
    exportAdminDataToCSV("students", displayedStudents)
  }

  const handleExportTop2PerSchool = async () => {
    try {
      const response = await api.get(
        `/admin/${PLATFORM_SLUG}/students/top2-export`
      )

      const rows = response.data.data

      if (!rows || rows.length === 0) {
        return
      }

      exportAdminDataToCSV("students", rows)
    } catch (error) {
      console.error(error)
    }
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value as TabType)
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <h2 className="font-wwf text-4xl tracking-wide text-white md:text-5xl">
            System Admin
          </h2>
          <p className="mt-2 text-base font-medium text-white md:text-lg">
            Welcome back, {user?.name}. Active Quiz:{" "}
            <span className="rounded-md bg-[#FFF0E5] px-2 py-1 text-xs font-black tracking-widest text-(--wwf-coral) uppercase">
              {stats?.active_campaign || "Loading..."}
            </span>
          </p>
        </div>

        {/* EXPORT BUTTONS */}
        <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto">
          <button
            onClick={handleExportTop2PerSchool}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#FFF0E5] px-6 text-sm font-bold text-(--wwf-coral) shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 sm:w-auto"
          >
            <Trophy size={18} /> Export Top 2 / School
          </button>

          <button
            onClick={handleExportCurrentView}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-(--wwf-ocean-deep) to-(--wwf-ocean-light) px-6 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 sm:w-auto"
          >
            <Download size={18} /> Export Current View
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-2">
        {/* EXPECTED STUDENTS */}
        <div className="group flex flex-col justify-between rounded-[2rem] border border-(--wwf-ocean-light)/15 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
          <div className="mb-6 flex items-center justify-between">
            <span className="text-[11px] font-black tracking-widest text-(--wwf-ocean-deep)/70 uppercase">
              Expected Students
            </span>
            <div className="rounded-xl bg-(--wwf-ocean-light)/10 p-2.5 text-(--wwf-ocean-deep) transition-transform group-hover:scale-110">
              <Users size={20} />
            </div>
          </div>
          <div>
            {loadingStats ? (
              <Skeleton className="h-12 w-20 bg-(--wwf-ocean-light)/10" />
            ) : (
              <div className="font-wwf text-5xl tracking-wider text-(--wwf-ocean-deep) md:text-6xl">
                {stats?.expected_students || 0}
              </div>
            )}
          </div>
        </div>

        {/* REGISTERED STUDENTS */}
        <div className="group flex flex-col justify-between rounded-[2rem] border border-(--wwf-ocean-light)/15 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
          <div className="mb-6 flex items-center justify-between">
            <span className="text-[11px] font-black tracking-widest text-(--wwf-ocean-deep)/70 uppercase">
              Registered Students
            </span>
            <div className="rounded-xl bg-(--wwf-sea-green)/15 p-2.5 text-(--wwf-ocean-deep) transition-transform group-hover:scale-110">
              <UserCheck size={20} />
            </div>
          </div>
          <div>
            {loadingStats ? (
              <Skeleton className="h-12 w-20 bg-(--wwf-ocean-light)/10" />
            ) : (
              <div className="font-wwf text-5xl tracking-wider text-(--wwf-ocean-deep) md:text-6xl">
                {stats?.registered_students || 0}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <Tabs
        defaultValue="students"
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full space-y-6"
      >
        <div className="flex flex-col gap-4 rounded-[1.5rem] border border-(--wwf-ocean-light)/15 bg-white p-4 shadow-sm sm:items-center sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-56">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-(--wwf-ocean)">
                <Search size={16} />
              </div>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search students..."
                className="h-12 w-full rounded-xl border border-(--wwf-ocean-light)/20 bg-[#F8FAFC] pr-4 pl-11 text-sm font-bold text-(--wwf-ocean-deep) shadow-sm transition-all outline-none focus:border-(--wwf-ocean) focus:bg-white"
              />
            </div>

            <div className="relative w-full sm:w-44">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-(--wwf-ocean)">
                <UserCheck size={16} />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-12 w-full appearance-none rounded-xl border border-(--wwf-ocean-light)/20 bg-[#F8FAFC] pr-4 pl-11 text-sm font-bold text-(--wwf-ocean-deep) shadow-sm transition-all outline-none focus:border-(--wwf-ocean) focus:bg-white"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="relative w-full sm:w-64">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-(--wwf-ocean)">
                <Filter size={16} />
              </div>
              <select
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                className="h-12 w-full appearance-none rounded-xl border border-(--wwf-ocean-light)/20 bg-[#F8FAFC] pr-4 pl-11 text-sm font-bold text-(--wwf-ocean-deep) shadow-sm transition-all outline-none focus:border-(--wwf-ocean) focus:bg-white"
              >
                <option value="">Filter: All States</option>
                {uniqueStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative w-full sm:w-64">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-(--wwf-ocean)">
                <Filter size={16} />
              </div>
              <select
                value={schoolFilter}
                onChange={(e) => setSchoolFilter(e.target.value)}
                className="h-12 w-full appearance-none rounded-xl border border-(--wwf-ocean-light)/20 bg-[#F8FAFC] pr-4 pl-11 text-sm font-bold text-(--wwf-ocean-deep) shadow-sm transition-all outline-none focus:border-(--wwf-ocean) focus:bg-white"
              >
                <option value="">Filter: All Schools</option>
                {schools?.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.school_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <TabsList className="flex w-full flex-wrap justify-start gap-2 bg-transparent p-0 sm:w-auto sm:flex-nowrap md:h-auto">
            <TabsTrigger
              value="students"
              className="flex-1 rounded-xl px-3 py-3 text-xs font-bold text-(--wwf-ocean-deep) transition-all data-[state=active]:bg-(--wwf-ocean-deep) data-[state=active]:text-white data-[state=active]:shadow-md sm:flex-none md:px-6 md:text-sm"
            >
              Students Leaderboard
            </TabsTrigger>
            <TabsTrigger
              className="flex-1 rounded-xl px-3 py-3 text-xs font-bold text-(--wwf-ocean-deep) transition-all data-[state=active]:bg-(--wwf-ocean-deep) data-[state=active]:text-white data-[state=active]:shadow-md sm:flex-none md:px-6 md:text-sm"
              value="states"
            >
              State-wise Data
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-(--wwf-ocean-light)/15 bg-white shadow-md">
          {/* ================================== */}
          {/* STUDENTS TAB CONTENT */}
          {/* ================================== */}
          <TabsContent value="students" className="mt-0 outline-none">
            <StudentsTable
              students={displayedStudents}
              isLoading={loadingStudents}
              categorySlug={PLATFORM_SLUG}
            />
          </TabsContent>

          {/* ================================== */}
          {/* STATES TAB CONTENT (Nested Tabs) */}
          {/* ================================== */}
          <TabsContent value="states" className="mt-0 outline-none">
            <Tabs defaultValue="summary" className="w-full">
              <div className="border-b border-(--wwf-ocean-light)/10 bg-linear-to-r from-[#F8FAFC] to-white p-4 sm:px-6">
                <TabsList className="flex w-full justify-start gap-3 bg-transparent p-0 sm:w-auto">
                  <TabsTrigger
                    value="summary"
                    className="rounded-xl px-5 py-4 text-xs font-bold text-(--wwf-ocean-deep) transition-all data-[state=active]:bg-(--wwf-ocean-light)/15 data-[state=active]:text-(--wwf-ocean-deep) md:text-sm"
                  >
                    State Summary
                  </TabsTrigger>
                  <TabsTrigger
                    value="schools"
                    className="rounded-xl px-5 py-4 text-xs font-bold text-(--wwf-ocean-deep) transition-all data-[state=active]:bg-(--wwf-sea-green)/15 data-[state=active]:text-(--wwf-ocean-deep) md:text-sm"
                  >
                    School Participation
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Sub-Tab 1: State Summary Table */}
              <TabsContent value="summary" className="m-0 outline-none">
                <div className="flex flex-col bg-white">
                  <div className="flex flex-col gap-1 border-b border-(--wwf-ocean-light)/10 p-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-(--wwf-ocean-light)/10 text-(--wwf-ocean-deep)">
                        <MapPin size={24} />
                      </div>
                      <div>
                        <h3 className="font-wwf text-2xl text-(--wwf-ocean-deep)">
                          State-wise Summary
                        </h3>
                        <p className="mt-0.5 text-sm font-semibold text-(--wwf-ocean-deep)/60">
                          Expected vs. registered students, aggregated by state.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full overflow-x-auto">
                    <StateStatsTable categorySlug={PLATFORM_SLUG} />
                  </div>
                </div>
              </TabsContent>

              {/* Sub-Tab 2: School Participation Table */}
              <TabsContent value="schools" className="m-0 outline-none">
                <div className="flex flex-col bg-white">
                  <div className="flex flex-col gap-1 border-b border-(--wwf-ocean-light)/10 p-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-(--wwf-sea-green)/15 text-(--wwf-ocean-deep)">
                        <Building2 size={24} />
                      </div>
                      <div>
                        <h3 className="font-wwf text-2xl text-(--wwf-ocean-deep)">
                          School Participation
                        </h3>
                        <p className="mt-0.5 text-sm font-semibold text-(--wwf-ocean-deep)/60">
                          Which specific schools have started the quiz.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full overflow-x-auto">
                    <SchoolParticipationTable categorySlug={PLATFORM_SLUG} />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Student Pagination Controls (Only visible on the Students tab) */}
          {activeTab === "students" &&
            topFilter === "all" &&
            paginationData &&
            paginationData.last_page > 1 && (
              <div className="flex flex-col items-center justify-between gap-4 border-t border-(--wwf-ocean-light)/10 bg-white/50 px-6 py-5 sm:flex-row">
                <span className="text-[11px] font-black tracking-widest text-(--wwf-ocean-deep) uppercase">
                  Page {paginationData.current_page} of{" "}
                  {paginationData.last_page}
                </span>

                <div className="flex w-full gap-3 sm:w-auto">
                  <button
                    onClick={() => setPage((old) => Math.max(old - 1, 1))}
                    disabled={page === 1}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-(--wwf-ocean-light)/20 bg-white px-5 py-2.5 text-xs font-bold text-(--wwf-ocean-deep) shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md disabled:pointer-events-none disabled:opacity-50 sm:flex-none"
                  >
                    <ChevronLeft size={16} />
                    Prev
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
                    Next
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
        </div>
      </Tabs>
    </div>
  )
}

export function UnifiedAdminDashboard() {
  return (
    <QueryProvider>
      <AdminDashboardContent />
    </QueryProvider>
  )
}
