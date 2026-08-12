import { useState } from "react"
import {
  MapPin,
  Key,
  Eye,
  Mail,
  Copy,
  Users,
  GraduationCap,
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import type { AdminSchool } from "@/types/admin"

interface Props {
  schools: AdminSchool[] | undefined
  isLoading: boolean
}

export function SchoolsTable({ schools, isLoading }: Props) {
  const [selectedSchool, setSelectedSchool] = useState<AdminSchool | null>(null)

  const copyCode = (code: string | undefined) => {
    if (!code) return
    navigator.clipboard.writeText(code)
    toast.success("Access Code Copied!", {
      description: "Code copied to clipboard successfully.",
    })
  }

  return (
    <div className="overflow-x-auto">
      <Table className="w-full min-w-200 text-left">
        <TableHeader className="bg-[#F8FAFC]">
          <TableRow className="border-b border-(--wwf-ocean-light)/10 hover:bg-transparent">
            <TableHead className="px-6 py-5 text-[11px] font-black tracking-widest text-(--wwf-ocean-deep)/70 uppercase">
              School & Location
            </TableHead>
            <TableHead className="px-6 py-5 text-center text-[11px] font-black tracking-widest text-(--wwf-ocean-deep)/70 uppercase">
              Access Code
            </TableHead>
            <TableHead className="px-6 py-5 text-center text-[11px] font-black tracking-widest text-(--wwf-ocean-deep)/70 uppercase">
              Students
            </TableHead>
            <TableHead className="px-6 py-5 text-center text-[11px] font-black tracking-widest text-(--wwf-ocean-deep)/70 uppercase">
              Teachers
            </TableHead>
            <TableHead className="px-6 py-5 text-right text-[11px] font-black tracking-widest text-(--wwf-ocean-deep)/70 uppercase">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-(--wwf-ocean-light)/10">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i} className="hover:bg-transparent">
                <TableCell className="px-6 py-5">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-48 bg-(--wwf-ocean-light)/10" />
                    <Skeleton className="h-3 w-32 bg-(--wwf-ocean-light)/10" />
                  </div>
                </TableCell>
                <TableCell className="px-6 py-5">
                  <Skeleton className="mx-auto h-6 w-24 rounded-md bg-(--wwf-ocean-light)/10" />
                </TableCell>
                <TableCell className="px-6 py-5">
                  <Skeleton className="mx-auto h-5 w-8 bg-(--wwf-ocean-light)/10" />
                </TableCell>
                <TableCell className="px-6 py-5">
                  <Skeleton className="mx-auto h-5 w-8 bg-(--wwf-ocean-light)/10" />
                </TableCell>
                <TableCell className="px-6 py-5">
                  <Skeleton className="ml-auto h-8 w-20 rounded-xl bg-(--wwf-ocean-light)/10" />
                </TableCell>
              </TableRow>
            ))
          ) : !schools || schools.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="py-16 text-center font-bold text-(--wwf-ocean-deep)/50"
              >
                No schools found in the system.
              </TableCell>
            </TableRow>
          ) : (
            schools.map((school) => (
              <TableRow
                key={school.id}
                className="group border-(--wwf-border) transition-colors hover:bg-(--wwf-ocean-light)/5"
              >
                <TableCell className="px-6 py-5 whitespace-nowrap">
                  <div className="text-sm font-bold text-(--wwf-ocean-deep) transition-colors group-hover:text-(--wwf-ocean)">
                    {school.school_name}
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-(--wwf-ocean-deep)/60">
                    <MapPin size={12} className="shrink-0 text-(--wwf-coral)" />
                    {school.school_city}, {school.school_state}
                  </div>
                </TableCell>
                <TableCell className="px-6 py-5 text-center whitespace-nowrap">
                  <span className="mx-auto flex w-fit items-center justify-center gap-2 rounded-md bg-[#F0F4F8] px-3 py-1.5 font-mono text-xs font-bold tracking-widest text-(--wwf-ocean-deep) shadow-sm">
                    <Key size={12} className="shrink-0 text-(--wwf-ocean)" />
                    {school.unique_code}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-5 text-center font-black whitespace-nowrap text-(--wwf-ocean-deep)">
                  {school.students_count}
                </TableCell>
                <TableCell className="px-6 py-5 text-center font-black whitespace-nowrap text-(--wwf-ocean-deep)">
                  {school.teachers_count}
                </TableCell>
                <TableCell className="px-6 py-5 text-right whitespace-nowrap">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedSchool(school)}
                        className="rounded-xl text-(--wwf-ocean-deep) transition-all hover:bg-white hover:text-(--wwf-ocean) hover:shadow-sm"
                      >
                        <Eye size={16} className="mr-2" /> View
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="w-[90vw] overflow-hidden rounded-[2rem] border-none p-0 shadow-2xl sm:max-w-md">
                      <div className="bg-linear-to-r from-(--wwf-ocean-deep) to-(--wwf-ocean) p-6 text-white sm:p-8">
                        <DialogHeader>
                          <DialogTitle className="font-wwf text-2xl leading-tight tracking-wide text-white sm:text-3xl">
                            {selectedSchool?.school_name}
                          </DialogTitle>
                          <DialogDescription className="mt-2 flex items-center gap-1.5 text-sm font-medium text-white/80">
                            <MapPin
                              size={16}
                              className="shrink-0 text-(--wwf-coral)"
                            />
                            {selectedSchool?.school_city},{" "}
                            {selectedSchool?.school_state}
                          </DialogDescription>
                        </DialogHeader>
                      </div>

                      <div className="space-y-6 bg-white p-6 sm:p-8">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-[#F8FAFC] p-4 text-center shadow-xs">
                            <Users
                              size={22}
                              className="mb-2 text-(--wwf-ocean)"
                            />
                            <p className="text-3xl font-black text-(--wwf-ocean-deep) sm:text-4xl">
                              {selectedSchool?.students_count}
                            </p>
                            <p className="mt-1 text-[10px] font-black tracking-widest text-(--wwf-ocean-deep)/60 uppercase">
                              Students
                            </p>
                          </div>
                          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-100 bg-[#F8FAFC] p-4 text-center shadow-xs">
                            <GraduationCap
                              size={22}
                              className="mb-2 text-(--wwf-coral)"
                            />
                            <p className="text-3xl font-black text-(--wwf-ocean-deep) sm:text-4xl">
                              {selectedSchool?.teachers_count}
                            </p>
                            <p className="mt-1 text-[10px] font-black tracking-widest text-(--wwf-ocean-deep)/60 uppercase">
                              Teachers
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-xs sm:flex-row sm:items-center">
                            <div className="flex items-center gap-3 text-sm font-bold text-(--wwf-ocean-deep)">
                              <Key
                                size={18}
                                className="shrink-0 text-(--wwf-ocean)"
                              />
                              Access Code
                            </div>
                            <div className="flex items-center justify-between gap-2 sm:justify-end">
                              <span className="rounded-md bg-[#F0F4F8] px-3 py-1.5 font-mono font-black tracking-widest text-(--wwf-ocean-deep)">
                                {selectedSchool?.unique_code}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 shrink-0 rounded-lg text-(--wwf-ocean-deep) hover:bg-[#F0F4F8] hover:text-(--wwf-ocean)"
                                onClick={() =>
                                  copyCode(selectedSchool?.unique_code)
                                }
                              >
                                <Copy size={16} />
                              </Button>
                            </div>
                          </div>

                          <div className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-xs sm:flex-row sm:items-center">
                            <div className="flex items-center gap-3 text-sm font-bold text-(--wwf-ocean-deep)">
                              <Mail
                                size={18}
                                className="shrink-0 text-(--wwf-coral)"
                              />
                              Principal
                            </div>
                            <span className="truncate text-sm font-semibold text-(--wwf-ocean-deep)/80">
                              {selectedSchool?.principal_email}
                            </span>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
