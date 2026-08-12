export type ValidationErrorResponse = {
  message: string
  errors: Record<string, string[]>
}
export interface ApiResponse<T> {
  status: "success" | "error"
  message?: string
  data: T
}

export interface ApiError {
  response?: {
    data?: {
      message?: string
      errors?: Record<string, string[]>
    }
    status?: number
  }
}
