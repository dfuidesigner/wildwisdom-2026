export interface Option {
  id: number
  question_id: number
  content: string
  is_correct?: boolean
  created_at?: string
  updated_at?: string
}

export interface Question {
  id: number
  level_id: number
  type: "text" | "text_image" | "image_text"
  content: string
  excerpt: string | null
  image_url: string | null
  image_copyright_url: string | null
  points: number
  options?: Option[]
  created_at?: string
  updated_at?: string
}

export interface Level {
  id: number
  quiz_id: number
  level_number: number
  title: string
  time_limit: number | null
  release_date: string | null
  questions_count?: number // Added by Laravel's withCount('questions')
  questions?: Question[] // Available when eager-loaded
  created_at?: string
  updated_at?: string
}

// --- 5. Quiz Model ---
export interface Quiz {
  id: number
  title: string
  slug: string
  description: string | null
  total_levels: number
  levels_count?: number
  levels?: Level[]
  created_at?: string
  updated_at?: string
}

export interface AdminStats {
  total_schools?: number
  expected_students?: number
  total_teachers?: number
  active_campaign: string
  registered_students?: number
}

export interface AdminSchool {
  id: number
  school_name: string
  school_city: string
  school_state: string
  unique_code: string
  principal_email: string
  students_count: number
  teachers_count: number
  created_at: string
}

export interface AdminStudent {
  id: number
  name: string
  email: string
  phone_number?: string
  school_id: number
  school_name: string
  grade: string | null
  roll_number: string
  section: string
  status: "Pending" | "Active" | "Completed"
  points: number
  total_time_taken?: number
  joined_at: string
  level_breakdowns?: {
    id: number
    level_number: number
    score: number
    time_taken?: number
  }[]
}

export interface AdminTeacher {
  id: number
  name: string
  email: string
  school_name: string
  phone: string | null
  joined_at: string
}
