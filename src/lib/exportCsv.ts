import { toast } from "sonner"
import type { AdminSchool, AdminStudent, AdminTeacher } from "@/types/admin"

const formatTime = (seconds?: number) => {
  if (seconds === undefined || seconds === null) return "0s"
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return m > 0 ? `${m}m ${s}s` : `${s}s`
}

export function exportAdminDataToCSV(
  activeTab: "schools" | "students" | "teachers",
  data: AdminSchool[] | AdminStudent[] | AdminTeacher[] | undefined
) {
  if (!data || data.length === 0) {
    toast.error(`No ${activeTab} data to export`)
    return
  }

  const filename = `admin_export_${activeTab}.csv`
  let headers: string[] = []
  let rows: string[][] = []

  if (activeTab === "schools") {
    headers = [
      "School Name",
      "City",
      "State",
      "Access Code",
      "Students",
      "Teachers",
      "Registered Date",
    ]
    const schools = data as AdminSchool[]
    rows = schools.map((s) => [
      `"${s.school_name}"`,
      `"${s.school_city}"`,
      `"${s.school_state}"`,
      `"${s.unique_code}"`,
      s.students_count.toString(),
      s.teachers_count.toString(),
      `"${new Date(s.created_at).toLocaleDateString()}"`,
    ])
  } else if (activeTab === "students") {
    headers = [
      "Name",
      "Email",
      "Phone Number",
      "School",
      "Grade",
      "Status",
      "Points",
      "Time Taken",
      "Joined",
    ]
    const students = data as AdminStudent[]

    rows = students.map((s) => [
      `"${s.name}"`,
      `"${s.email}"`,
      `"${s.phone_number}"`,
      `"${s.school_name}"`,
      `"${s.grade || "N/A"}"`,
      `"${s.status}"`,
      s.points?.toString() || "0",
      `"${formatTime(s.total_time_taken)}"`,
      `"${s.joined_at}"`,
    ])
  } else if (activeTab === "teachers") {
    headers = ["Name", "Email", "School", "Phone", "Joined"]
    const teachers = data as AdminTeacher[]
    rows = teachers.map((t) => [
      `"${t.name}"`,
      `"${t.email}"`,
      `"${t.school_name}"`,
      `"${t.phone || "N/A"}"`,
      `"${t.joined_at}"`,
    ])
  }

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join(
    "\n"
  )

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.setAttribute("href", url)
  link.setAttribute("download", filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  toast.success("Export Complete")
}
