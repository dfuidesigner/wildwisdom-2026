import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import api from "@/lib/axios"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DownloadCsvButton } from "./DownloadCsvButton"
import type { AdminSchoolParticipation } from "@/types/admin"

export function SchoolParticipationTable({
  categorySlug,
}: {
  categorySlug: string
}) {
  const [filter, setFilter] = useState<"all" | "started" | "not_started">("all")

  const { data: schools, isLoading } = useQuery<AdminSchoolParticipation[]>({
    queryKey: ["adminStateParticipation", categorySlug, filter],
    queryFn: async () => {
      const params = filter !== "all" ? `?participation=${filter}` : ""
      return (
        await api.get(`/admin/${categorySlug}/state-participation${params}`)
      ).data.data
    },
  })

  return (
    <div>
      <div className="flex flex-col gap-3 border-b border-(--wwf-ocean-light)/10 p-4 sm:flex-row sm:items-center sm:justify-between">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as typeof filter)}
          className="h-11 rounded-xl border border-(--wwf-ocean-light)/20 bg-[#F8FAFC] px-4 text-sm font-bold text-(--wwf-ocean-deep)"
        >
          <option value="all">All Schools</option>
          <option value="started">Started Quiz</option>
          <option value="not_started">Not Started Yet</option>
        </select>

        <DownloadCsvButton
          endpoint={`/admin/${categorySlug}/state-participation/export`}
          filename={`state_school_participation_${new Date().toISOString().slice(0, 10)}.csv`}
        />
      </div>

      <div className="overflow-x-auto">
        <Table className="w-full text-left">
          <TableHeader className="bg-[#F8FAFC]">
            <TableRow>
              <TableHead className="px-6 py-4 text-[11px] font-black tracking-widest uppercase">
                State
              </TableHead>
              <TableHead className="px-6 py-4 text-[11px] font-black tracking-widest uppercase">
                School
              </TableHead>
              <TableHead className="px-6 py-4 text-center text-[11px] font-black tracking-widest uppercase">
                Expected
              </TableHead>
              <TableHead className="px-6 py-4 text-center text-[11px] font-black tracking-widest uppercase">
                Registered
              </TableHead>
              <TableHead className="px-6 py-4 text-center text-[11px] font-black tracking-widest uppercase">
                Started
              </TableHead>
              <TableHead className="px-6 py-4 text-right text-[11px] font-black tracking-widest uppercase">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={6} className="px-6 py-4">
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : !schools || schools.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-16 text-center font-bold text-(--wwf-ocean-deep)/50"
                >
                  No schools found.
                </TableCell>
              </TableRow>
            ) : (
              schools.map((s) => (
                <TableRow key={s.school_id}>
                  <TableCell className="px-6 py-3 text-sm font-semibold text-(--wwf-ocean-deep)/70">
                    {s.state}
                  </TableCell>
                  <TableCell className="px-6 py-3 text-sm font-bold text-(--wwf-ocean-deep)">
                    {s.school_name}
                  </TableCell>
                  <TableCell className="px-6 py-3 text-center text-sm font-semibold">
                    {s.expected_students}
                  </TableCell>
                  <TableCell className="px-6 py-3 text-center text-sm font-semibold">
                    {s.registered_students}
                  </TableCell>
                  <TableCell className="px-6 py-3 text-center text-sm font-semibold">
                    {s.students_started}
                  </TableCell>
                  <TableCell className="px-6 py-3 text-right">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-black tracking-wider uppercase ${
                        s.has_started
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {s.has_started ? "Started" : "Not Started"}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
