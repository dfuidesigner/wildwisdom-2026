export interface SchoolSummary {
  id: number
  school_name: string
  unique_code: string
  created_at: string
  updated_at: string
}

export interface User {
  id: number
  name: string
  email: string | null
  role: "admin" | "teacher" | "student" | "state_admin"
  school_id: number
  phone_number: string | null
  grade?: string
  created_at: string
  updated_at: string
  school?: SchoolSummary
}

export interface LoginResponse {
  status: "success"
  message: string
  token: string
  user: User
}

export interface StudentRegisterResponse {
  status: "success"
  message: string
  token: string
  user: {
    id: number
    name: string
    email: string | null
    role: string
  }
}
