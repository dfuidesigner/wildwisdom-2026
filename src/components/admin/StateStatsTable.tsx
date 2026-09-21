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
import type { AdminStateStat } from "@/types/admin"
import { Download } from "lucide-react"

export function StateStatsTable({ categorySlug }: { categorySlug: string }) {
  const { data: states, isLoading } = useQuery<AdminStateStat[]>({
    queryKey: ["adminStateStats", categorySlug],
    queryFn: async () =>
      (await api.get(`/admin/${categorySlug}/state-stats`)).data.data,
  })

  return (
    <div className="overflow-x-auto">
      {/* <a
        href={`${api.defaults.baseURL}/admin/${categorySlug}/state-stats/export`}
        className="mb-4 inline-flex h-10 items-center gap-2 rounded-xl bg-(--wwf-ocean-deep) px-4 text-sm font-bold text-white"
      >
        <Download size={16} /> Download Excel
      </a> */}
      <Table className="w-full text-left">
        <TableHeader className="bg-[#F8FAFC]">
          <TableRow>
            <TableHead className="px-6 py-5 text-[11px] font-black tracking-widest uppercase">
              State
            </TableHead>
            <TableHead className="px-6 py-5 text-center text-[11px] font-black tracking-widest uppercase">
              Schools
            </TableHead>
            <TableHead className="px-6 py-5 text-center text-[11px] font-black tracking-widest uppercase">
              Expected Students
            </TableHead>
            <TableHead className="px-6 py-5 text-right text-[11px] font-black tracking-widest uppercase">
              Registered Students
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell colSpan={4} className="px-6 py-4">
                  <Skeleton className="h-4 w-full" />
                </TableCell>
              </TableRow>
            ))
          ) : !states || states.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={4}
                className="py-16 text-center font-bold text-(--wwf-ocean-deep)/50"
              >
                No data yet.
              </TableCell>
            </TableRow>
          ) : (
            states.map((s) => (
              <TableRow key={s.state}>
                <TableCell className="px-6 py-4 text-sm font-bold text-(--wwf-ocean-deep)">
                  {s.state}
                </TableCell>
                <TableCell className="px-6 py-4 text-center text-sm font-semibold">
                  {s.total_schools}
                </TableCell>
                <TableCell className="px-6 py-4 text-center text-sm font-semibold">
                  {s.expected_students}
                </TableCell>
                <TableCell className="px-6 py-4 text-right text-sm font-bold text-(--wwf-ocean-deep)">
                  {s.registered_students}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
