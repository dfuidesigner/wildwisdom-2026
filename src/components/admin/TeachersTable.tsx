import { Phone } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import type { AdminTeacher } from "@/types/admin"

interface Props {
  teachers: AdminTeacher[] | undefined
  isLoading: boolean
}

export function TeachersTable({ teachers, isLoading }: Props) {
  return (
    <div className="overflow-x-auto">
      <Table className="w-full min-w-175 text-left">
        <TableHeader className="bg-[#F8FAFC]">
          <TableRow className="border-b border-(--wwf-ocean-light)/10 hover:bg-transparent">
            <TableHead className="px-6 py-5 text-[11px] font-black tracking-widest text-(--wwf-ocean-deep)/70 uppercase">
              Teacher
            </TableHead>
            <TableHead className="px-6 py-5 text-[11px] font-black tracking-widest text-(--wwf-ocean-deep)/70 uppercase">
              School
            </TableHead>
            <TableHead className="px-6 py-5 text-[11px] font-black tracking-widest text-(--wwf-ocean-deep)/70 uppercase">
              Contact Info
            </TableHead>
            <TableHead className="px-6 py-5 text-right text-[11px] font-black tracking-widest text-(--wwf-ocean-deep)/70 uppercase">
              Joined
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-(--wwf-ocean-light)/10">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i} className="hover:bg-transparent">
                <TableCell className="px-6 py-5">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-40 bg-(--wwf-ocean-light)/10" />
                    <Skeleton className="h-3 w-32 bg-(--wwf-ocean-light)/10" />
                  </div>
                </TableCell>
                <TableCell className="px-6 py-5">
                  <Skeleton className="h-4 w-48 bg-(--wwf-ocean-light)/10" />
                </TableCell>
                <TableCell className="px-6 py-5">
                  <Skeleton className="h-4 w-32 bg-(--wwf-ocean-light)/10" />
                </TableCell>
                <TableCell className="px-6 py-5">
                  <Skeleton className="ml-auto h-4 w-24 bg-(--wwf-ocean-light)/10" />
                </TableCell>
              </TableRow>
            ))
          ) : !teachers || teachers.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={4}
                className="py-16 text-center font-bold text-(--wwf-ocean-deep)/50"
              >
                No teachers found. Try adjusting your school filter.
              </TableCell>
            </TableRow>
          ) : (
            teachers.map((teacher) => (
              <TableRow
                key={teacher.id}
                className="border-(--wwf-border) transition-colors hover:bg-(--wwf-ocean-light)/5"
              >
                <TableCell className="px-6 py-5 whitespace-nowrap">
                  <div className="text-sm font-bold text-(--wwf-ocean-deep)">
                    {teacher.name}
                  </div>
                  <div className="mt-0.5 text-xs font-semibold text-(--wwf-ocean-deep)/60">
                    {teacher.email}
                  </div>
                </TableCell>
                <TableCell className="px-6 py-5 text-sm font-bold whitespace-nowrap text-(--wwf-ocean-deep)">
                  {teacher.school_name}
                </TableCell>
                <TableCell className="px-6 py-5 text-sm font-semibold whitespace-nowrap text-(--wwf-ocean-deep)">
                  <div className="flex w-fit items-center gap-2 rounded-md bg-[#F0F4F8] px-3 py-1.5">
                    <Phone size={14} className="shrink-0 text-(--wwf-ocean)" />
                    {teacher.phone || "N/A"}
                  </div>
                </TableCell>
                <TableCell className="px-6 py-5 text-right text-xs font-bold whitespace-nowrap text-(--wwf-ocean-deep)/70">
                  {teacher.joined_at}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
