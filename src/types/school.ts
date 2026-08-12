import type { User } from "@/types/auth"

export interface RegisterSchoolResponse {
  status: "success"
  message: string
  unique_code: string
}

export interface ErrorResponse {
  status: "error"
  message: string
}

export type School = {
  id: number
  school_name: string
  school_address: string
  school_city: string
  school_state: string
  school_pincode: string
  school_board: string
  school_affiliation_number: string
  principal_name: string
  principal_email: string
  school_email: string
  school_contact_number: string
  teacher_first_name: string
  teacher_last_name: string
  teacher_email: string
  teacher_mobile: string
  school_expected_students: number
  unique_code: string
  created_at: string
  updated_at: string
  teachers_count: number
  students_count: number
}

export type SchoolDetail = Omit<School, "teachers_count" | "students_count"> & {
  users: User[]
}
