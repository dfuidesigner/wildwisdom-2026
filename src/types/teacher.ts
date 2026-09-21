export interface Stats {
  total_registered: number
  active_playing: number
  school_total_score: number
}

export interface LevelBreakdown {
  level_number: number
  score: number
  time_taken: number | null
}

export interface Student {
  id: number
  name: string
  email: string
  grade: string | null
  roll_number: string | null
  section: string | null
  phone_number: string
  joined_at: string
  total_score: number
  total_time_taken?: number
  levels_completed: number
  status: "Pending" | "Active" | "Completed"
  level_breakdowns?: LevelBreakdown[]
  has_started_playing: boolean
  login_id: string
  password: string
  is_new_account: boolean
}

export interface PaginatedStudents {
  data: Student[]
  current_page: number
  last_page: number
  total: number
}
