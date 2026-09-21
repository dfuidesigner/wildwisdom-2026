import { Mail, Clock, Phone, RotateCcw } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import type { AdminStudent } from "@/types/admin"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import api from "@/lib/axios"

interface Props {
  students: AdminStudent[] | undefined
  isLoading: boolean
  categorySlug: string
}

// Helper to convert seconds into "Xm Ys"
const formatTime = (seconds?: number) => {
  if (seconds === undefined || seconds === null) return "0s"
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return m > 0 ? `${m}m ${s}s` : `${s}s`
}

export function StudentsTable({ students, isLoading, categorySlug }: Props) {
  const queryClient = useQueryClient()

  const retakeMutation = useMutation({
    mutationFn: async ({
      studentId,
      levelId,
    }: {
      studentId: number
      levelId: number
    }) => {
      await api.post(`/play/${categorySlug}/levels/${levelId}/reset-retake`, {
        student_id: studentId,
      })
    },

    onSuccess: () => {
      toast.success("Level reset", {
        description: "The student can retake this level now.",
      })

      queryClient.invalidateQueries({
        queryKey: ["adminStudents"],
      })
    },

    onError: () => {
      toast.error("Couldn't reset the level", {
        description: "Please try again.",
      })
    },
  })

  const handleRetake = (
    studentId: number,
    levelId: number,
    levelNumber: number,
    autoSubmitted?: boolean
  ) => {
    const note = autoSubmitted
      ? " Note: this attempt was auto-submitted when the timer ran out — the student may not have actually finished answering."
      : ""

    const confirmed = window.confirm(
      `Reset Level ${levelNumber} for this student?${note} Their score for this level will be removed and they'll be able to attempt it again.`
    )

    if (confirmed) {
      retakeMutation.mutate({ studentId, levelId })
    }
  }
  return (
    <div className="overflow-x-auto">
      <Table className="w-full min-w-[800px] text-left">
        <TableHeader className="bg-[#F8FAFC]">
          <TableRow className="border-b border-(--wwf-ocean-light)/10 hover:bg-transparent">
            <TableHead className="px-6 py-5 text-[11px] font-black tracking-widest text-(--wwf-ocean-deep)/70 uppercase">
              Rank & Student
            </TableHead>
            <TableHead className="px-6 py-5 text-[11px] font-black tracking-widest text-(--wwf-ocean-deep)/70 uppercase">
              Contact Info
            </TableHead>
            <TableHead className="px-6 py-5 text-[11px] font-black tracking-widest text-(--wwf-ocean-deep)/70 uppercase">
              School & Grade
            </TableHead>
            <TableHead className="px-6 py-5 text-center text-[11px] font-black tracking-widest text-(--wwf-ocean-deep)/70 uppercase">
              Status
            </TableHead>
            <TableHead className="px-6 py-5 text-right text-[11px] font-black tracking-widest text-(--wwf-ocean-deep)/70 uppercase">
              Score & Time
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
                <TableCell className="px-6 py-5 text-center">
                  <Skeleton className="mx-auto h-6 w-16 rounded-full bg-(--wwf-ocean-light)/10" />
                </TableCell>
                <TableCell className="px-6 py-5">
                  <Skeleton className="ml-auto h-6 w-20 bg-(--wwf-ocean-light)/10" />
                </TableCell>
              </TableRow>
            ))
          ) : !students || students.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="py-16 text-center font-bold text-(--wwf-ocean-deep)/50"
              >
                No students found.
              </TableCell>
            </TableRow>
          ) : (
            students.map((student, index) => (
              <TableRow
                key={student.id}
                className="border-(--wwf-border) transition-colors hover:bg-(--wwf-ocean-light)/5"
              >
                {/* RANK & STUDENT */}
                <TableCell className="px-6 py-5 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-(--wwf-ocean-deep) text-xs font-bold text-white">
                      #{index + 1}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-(--wwf-ocean-deep)">
                        {student.name}
                      </div>
                      <div className="mt-0.5 text-xs font-semibold text-(--wwf-ocean-deep)/60">
                        Joined: {student.joined_at}
                      </div>
                    </div>
                  </div>
                </TableCell>

                {/* CONTACT INFO */}
                {/* CONTACT INFO */}
                <TableCell className="px-6 py-5 whitespace-nowrap">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 text-xs font-semibold text-(--wwf-ocean-deep)/80">
                      <Mail size={13} className="text-(--wwf-ocean)" />
                      {student.email}
                    </div>
                    {student.phone_number && (
                      <div className="flex items-center gap-2 text-xs font-semibold text-(--wwf-ocean-deep)/80">
                        <Phone size={13} className="text-(--wwf-ocean)" />
                        {student.phone_number}
                      </div>
                    )}
                  </div>
                </TableCell>

                {/* SCHOOL & GRADE */}
                <TableCell className="px-6 py-5 whitespace-nowrap">
                  <div className="text-sm font-bold text-(--wwf-ocean-deep)">
                    {student.school_name}
                  </div>
                  <div className="mt-0.5 text-xs font-semibold text-(--wwf-ocean-deep)/60">
                    Grade: {student.grade || "N/A"}
                    <br />
                    Roll Number: {student.roll_number || "N/A"}
                    <br />
                    Section: {student.section || "N/A"}
                  </div>
                </TableCell>

                {/* STATUS */}
                <TableCell className="px-6 py-5 text-center whitespace-nowrap">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-black tracking-wider uppercase ${
                      student.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : student.status === "Active"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {student.status}
                  </span>
                </TableCell>

                {/* SCORE, TIME & BREAKDOWN */}
                <TableCell className="px-6 py-5 text-right whitespace-nowrap">
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-end gap-3">
                      {/* Total Time */}
                      <div className="mb-0.5 flex items-center gap-1.5 text-xs font-bold text-(--wwf-ocean-deep)/60">
                        <Clock size={12} />
                        {formatTime(student.total_time_taken)}
                      </div>
                      {/* Total Points */}
                      <div className="font-wwf text-xl tracking-wide text-(--wwf-ocean-deep)">
                        {student.points}{" "}
                        <span className="text-sm text-(--wwf-ocean-deep)/50">
                          pts
                        </span>
                      </div>
                    </div>

                    {student.level_breakdowns &&
                      student.level_breakdowns.length > 0 && (
                        <div className="mt-1 flex flex-col items-end gap-1">
                          {student.level_breakdowns.map((lvl) => (
                            <div
                              key={lvl.id}
                              className="group flex items-center gap-1.5 rounded bg-(--wwf-ocean-light)/20 px-1.5 py-0.5 text-[10px] font-bold text-(--wwf-ocean-deep)"
                            >
                              <span>
                                L{lvl.level_number}:{" "}
                                <span className="text-(--wwf-ocean)">
                                  {lvl.score}pts
                                </span>
                              </span>
                              <span className="text-(--wwf-ocean-deep)/50">
                                •
                              </span>
                              <span className="text-(--wwf-ocean-deep)/70">
                                {formatTime(lvl.time_taken)}
                              </span>

                              {lvl.auto_submitted && (
                                <span
                                  title={
                                    lvl.submission_type === "focus_violation"
                                      ? "Auto-submitted after repeated focus violations (tab switch / left fullscreen)"
                                      : "Auto-submitted — the timer ran out"
                                  }
                                  className="rounded bg-amber-100 px-1 text-amber-700"
                                >
                                  <Clock size={9} className="inline" /> Auto
                                </span>
                              )}

                              {lvl.retake_count > 0 && (
                                <span
                                  title={`Retaken ${lvl.retake_count} time(s) already`}
                                  className="rounded bg-purple-100 px-1 text-purple-700"
                                >
                                  ↻{lvl.retake_count}
                                </span>
                              )}

                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleRetake(
                                    student.id,
                                    lvl.id,
                                    lvl.level_number,
                                    lvl.auto_submitted
                                  )
                                }}
                                disabled={retakeMutation.isPending}
                                title={`Reset Level ${lvl.level_number} for retake`}
                                className="ml-0.5 rounded p-0.5 text-(--wwf-ocean-deep)/50 opacity-0 transition-opacity hover:bg-white hover:text-(--wwf-ocean-deep) disabled:opacity-50 group-hover:opacity-100"
                              >
                                <RotateCcw size={10} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
