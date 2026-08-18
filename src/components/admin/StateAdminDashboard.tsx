import { useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import api from "@/lib/axios"
import { QueryProvider } from "@/components/providers/QueryProvider"
import { useAuth } from "@/hooks/useAuth"
import {
  Building2,
  Users,
  Download,
  MapPin,
  Search,
  Calendar,
  Mail,
  Loader2,
} from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import type { ReactNode } from "react"

interface StateSchool {
  id: number
  created_at: string
  school_name: string
  unique_code: string
  school_address: string
  school_city: string
  school_state: string
  school_pincode: string
  school_board: string
  school_affiliation_number: string
  principal_name: string
  principal_email: string
  school_email: string
  school_contact: string
  teacher_coordinator: string
  teacher_name: string
  teacher_email: string
  teacher_mobile: string
  school_expected_students: number
  students_count: number
  status: string
}

interface StateDashboardData {
  state_name: string
  stats: {
    total_schools: number
    total_students: number
  }
  schools: StateSchool[]
}

function StateDashboardContent() {
  const { user } = useAuth()
  const PLATFORM_SLUG = import.meta.env.PUBLIC_PLATFORM_SLUG || "wildwisdom"

  const [searchQuery, setSearchQuery] = useState("")
  const [stateFilter, setStateFilter] = useState("All")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const { data, isLoading, isError } = useQuery<StateDashboardData>({
    queryKey: ["stateAdminDashboard", PLATFORM_SLUG, startDate, endDate],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (startDate) params.append("start_date", startDate)
      if (endDate) params.append("end_date", endDate)

      const res = await api.get(
        `/state-admin/${PLATFORM_SLUG}/dashboard?${params.toString()}`
      )
      return res.data.data
    },
  })

  const resendEmailMutation = useMutation({
    mutationFn: async (schoolId: number) => {
      await api.post(
        `/state-admin/${PLATFORM_SLUG}/schools/${schoolId}/resend-email`
      )
    },
    onSuccess: () => toast.success("Registration email resent"),
    onError: () =>
      toast.error("Couldn't resend the email", {
        description: "Please try again.",
      }),
  })

  const availableStates = useMemo(() => {
    if (!data?.state_name) return []
    return data.state_name.split(",").map((s) => s.trim())
  }, [data])

  const totalExpectedStudents = useMemo(() => {
    if (!data?.schools) return 0
    return data.schools.reduce((sum, school) => {
      return sum + (Number(school.school_expected_students) || 0)
    }, 0)
  }, [data])

  const filteredSchools = useMemo(() => {
    if (!data?.schools) return []

    return data.schools.filter((school) => {
      const matchesSearch =
        school.school_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        school.unique_code.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesState =
        stateFilter === "All" || school.school_state === stateFilter

      return matchesSearch && matchesState
    })
  }, [data, searchQuery, stateFilter])

  const handleExport = () => {
    if (filteredSchools.length === 0) {
      toast.error("No data available to export with current filters.")
      return
    }

    const headers = [
      "Registration Date",
      "School Name",
      "Unique Code",
      "Address",
      "City",
      "State",
      "Pincode",
      "Board",
      "Affiliation Number",
      "Principal Name",
      "Principal Email",
      "School Email",
      "School Contact",
      "Teacher Coordinator",
      "Teacher Name",
      "Teacher Email",
      "Teacher Mobile",
      "Registered Students",
    ]

    const rows = filteredSchools.map((s) => [
      `"${s.created_at}"`,
      `"${s.school_name}"`,
      `"${s.unique_code}"`,
      `"${s.school_address || ""}"`,
      `"${s.school_city}"`,
      `"${s.school_state}"`,
      `"${s.school_pincode || ""}"`,
      `"${s.school_board || ""}"`,
      `"${s.school_affiliation_number || ""}"`,
      `"${s.principal_name}"`,
      `"${s.principal_email}"`,
      `"${s.school_email || ""}"`,
      `"${s.school_contact}"`,
      `"${s.teacher_coordinator || ""}"`,
      `"${s.teacher_name || ""}"`,
      `"${s.teacher_email || ""}"`,
      `"${s.teacher_mobile || ""}"`,
      `"${s.school_expected_students || 0}"`,
    ])

    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.join(",")),
    ].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")

    const filenamePrefix =
      stateFilter !== "All"
        ? stateFilter
        : data?.state_name.replace(/[,\s]+/g, "_")
    link.href = url
    link.download = `${filenamePrefix}_Schools_Detailed_Report.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.success("Detailed Export Complete")
  }

  const handleClearDates = () => {
    setStartDate("")
    setEndDate("")
  }

  if (isError) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-red-100 bg-red-50 text-red-500">
        <p className="font-bold">
          Error loading dashboard data. Please verify your access permissions.
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-[95%] space-y-8 pt-8 pb-12">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <h2 className="font-wwf text-4xl tracking-wide text-white md:text-5xl">
            {isLoading ? (
              <Skeleton className="mb-2 h-10 w-64" />
            ) : (
              `${data?.state_name} Dashboard`
            )}
          </h2>
          <p className="mt-2 text-base font-medium text-white md:text-lg">
            Welcome back, {user?.name}. Manage the schools in your region.
          </p>
        </div>
        <button
          onClick={handleExport}
          disabled={isLoading || filteredSchools.length === 0}
          className="bg-orange flex h-12 w-full items-center justify-center gap-2 rounded-xl px-6 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(247,134,35,0.6)] active:translate-y-0 disabled:opacity-50 md:w-auto"
        >
          <Download size={18} /> Export CSV
        </button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <StatCard
          title="Registered Schools"
          count={data?.stats.total_schools}
          icon={<Building2 size={24} />}
          loading={isLoading}
          colorClass="text-(--wwf-coral) bg-(--wwf-coral)/10"
        />
        <StatCard
          title="Participating Students"
          count={totalExpectedStudents}
          icon={<Users size={24} />}
          loading={isLoading}
          colorClass="text-(--wwf-ocean-deep) bg-(--wwf-sea-green)/15"
        />
      </div>

      <div className="overflow-hidden rounded-[2rem] border border-(--wwf-ocean-light)/15 bg-white shadow-md">
        <div className="flex flex-col gap-4 border-b border-(--wwf-ocean-light)/15 bg-[#F8FAFC] p-6">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <h3 className="shrink-0 text-xl font-bold text-(--wwf-ocean-deep)">
              Registered Schools
            </h3>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Calendar
                    className="absolute top-1/2 left-3 -translate-y-1/2 text-black"
                    size={16}
                  />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="h-10 rounded-lg border border-slate-200 pr-3 pl-9 text-sm text-black focus:border-(--wwf-ocean) focus:outline-none"
                  />
                </div>
                <span className="text-sm font-medium text-black">to</span>
                <div className="relative">
                  <Calendar
                    className="absolute top-1/2 left-3 -translate-y-1/2 text-black"
                    size={16}
                  />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="h-10 rounded-lg border border-slate-200 pr-3 pl-9 text-sm text-black focus:border-(--wwf-ocean) focus:outline-none"
                  />
                </div>
                {(startDate || endDate) && (
                  <button
                    onClick={handleClearDates}
                    className="px-2 text-xs text-red-500 hover:underline"
                  >
                    Clear Dates
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
            <div className="relative flex-1 sm:max-w-xs">
              <Search
                className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search name or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 w-full text-black rounded-lg border border-slate-200 pr-4 pl-9 text-sm focus:border-(--wwf-ocean) focus:ring-1 focus:ring-(--wwf-ocean) focus:outline-none"
              />
            </div>

            {availableStates.length > 1 && (
              <div className="relative">
                <MapPin
                  className="absolute top-1/2 left-3 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <select
                  value={stateFilter}
                  onChange={(e) => setStateFilter(e.target.value)}
                  className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white pr-8 pl-9 text-sm focus:border-(--wwf-ocean) focus:ring-1 focus:ring-(--wwf-ocean) focus:outline-none sm:w-40"
                >
                  <option value="All">All States</option>
                  {availableStates.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-black tracking-widest whitespace-nowrap text-slate-500 uppercase">
              <tr className="border-b border-(--wwf-ocean-light)/15">
                <th className="p-4 pl-6">Registration Date</th>
                <th className="p-4">School Name</th>
                <th className="p-4">Unique Code</th>
                <th className="p-4">Address</th>
                <th className="p-4">City</th>
                <th className="p-4">State</th>
                <th className="p-4">Pincode</th>
                <th className="p-4">Board</th>
                <th className="p-4">Affiliation No.</th>
                <th className="p-4">Principal Name</th>
                <th className="p-4">Principal Email</th>
                <th className="p-4">School Email</th>
                <th className="p-4">School Mobile</th>
                <th className="p-4">Teacher Coordinator</th>
                <th className="p-4">Teacher Name</th>
                <th className="p-4">Teacher Email</th>
                <th className="p-4">Teacher Mobile</th>
                <th className="p-4 text-center">Registered Students</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-(--wwf-ocean-light)/10 whitespace-nowrap">
              {isLoading ? (
                <tr>
                  <td colSpan={19} className="p-8 text-center text-slate-400">
                    Loading data...
                  </td>
                </tr>
              ) : filteredSchools.length === 0 ? (
                <tr>
                  <td colSpan={19} className="p-12 text-center text-slate-500">
                    <MapPin className="mx-auto mb-3 h-8 w-8 text-slate-300" />
                    <p className="text-lg font-bold text-(--wwf-ocean-deep)">
                      No schools found
                    </p>
                    <p className="text-sm">
                      Try adjusting your filters or search query.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredSchools.map((school) => (
                  <tr
                    key={school.id}
                    className="transition-colors hover:bg-slate-50/50"
                  >
                    <td className="p-4 pl-6 font-medium text-slate-600">
                      {school.created_at}
                    </td>
                    <td className="p-4 font-bold text-(--wwf-ocean-deep)">
                      {school.school_name}
                    </td>
                    <td className="p-4">
                      <span className="rounded-md bg-slate-100 px-2.5 py-1 font-mono text-xs font-bold tracking-wider text-slate-700">
                        {school.unique_code}
                      </span>
                    </td>
                    <td
                      className="max-w-50 truncate p-4 text-slate-600"
                      title={school.school_address}
                    >
                      {school.school_address}
                    </td>
                    <td className="p-4 text-slate-600">{school.school_city}</td>
                    <td className="p-4 text-slate-600">
                      {school.school_state}
                    </td>
                    <td className="p-4 text-slate-600">
                      {school.school_pincode}
                    </td>
                    <td className="p-4 text-slate-600">
                      {school.school_board}
                    </td>
                    <td className="p-4 text-slate-600">
                      {school.school_affiliation_number}
                    </td>
                    <td className="p-4 font-semibold text-slate-700">
                      {school.principal_name}
                    </td>
                    <td className="p-4 text-blue-600">
                      <a href={`mailto:${school.principal_email}`}>
                        {school.principal_email}
                      </a>
                    </td>
                    <td className="p-4 text-blue-600">
                      <a href={`mailto:${school.school_email}`}>
                        {school.school_email}
                      </a>
                    </td>
                    <td className="p-4 text-slate-600">
                      {school.school_contact}
                    </td>
                    <td className="p-4 text-slate-600">
                      {school.teacher_coordinator}
                    </td>
                    <td className="p-4 text-slate-600">
                      {school.teacher_name}
                    </td>
                    <td className="p-4 text-blue-600">
                      <a href={`mailto:${school.teacher_email}`}>
                        {school.teacher_email}
                      </a>
                    </td>
                    <td className="p-4 text-slate-600">
                      {school.teacher_mobile}
                    </td>
                    <td className="p-4 text-center text-slate-600">
                      {school.school_expected_students}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => resendEmailMutation.mutate(school.id)}
                        disabled={
                          resendEmailMutation.isPending &&
                          resendEmailMutation.variables === school.id
                        }
                        title="Resend registration email"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-(--wwf-ocean-light)/20 bg-white px-3 py-1.5 text-xs font-bold text-(--wwf-ocean-deep) shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md disabled:opacity-50"
                      >
                        {resendEmailMutation.isPending &&
                        resendEmailMutation.variables === school.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Mail size={14} />
                        )}
                        Resend Email
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  title,
  count,
  icon,
  loading,
  colorClass,
}: {
  title: string
  count?: number
  icon: ReactNode
  loading: boolean
  colorClass: string
}) {
  return (
    <div className="group flex flex-col justify-between rounded-[2rem] border border-(--wwf-ocean-light)/15 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
      <div className="mb-6 flex items-center justify-between">
        <span className="text-[11px] font-black tracking-widest text-(--wwf-ocean-deep)/70 uppercase">
          {title}
        </span>
        <div
          className={`rounded-xl p-2.5 transition-transform group-hover:scale-110 ${colorClass}`}
        >
          {icon}
        </div>
      </div>
      <div>
        {loading ? (
          <Skeleton className="h-12 w-20 bg-(--wwf-ocean-light)/10" />
        ) : (
          <div className="font-wwf text-5xl tracking-wider text-(--wwf-ocean-deep) md:text-6xl">
            {count || 0}
          </div>
        )}
      </div>
    </div>
  )
}

export function StateAdminDashboard() {
  return (
    <QueryProvider>
      <StateDashboardContent />
    </QueryProvider>
  )
}
