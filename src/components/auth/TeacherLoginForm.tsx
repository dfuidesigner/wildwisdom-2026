import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import api from "@/lib/axios"
import { Loader2, ArrowRight, FileExclamationPoint } from "lucide-react"
import { QueryProvider } from "@/components/providers/QueryProvider"
import type { AxiosError } from "axios"
import type { LoginResponse } from "@/types/auth"
import { encryptPayload } from "@/lib/encryption"

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(255, "Email is too long")
    .regex(/^[^<>]*$/, "Invalid characters detected"),
  password: z
    .string()
    .min(1, "School Code is required")
    .max(100, "School Code is too long"),
})

type LoginFormData = z.infer<typeof loginSchema>
type LoginPayload = LoginFormData

interface ApiErrorResponse {
  message?: string
  errors?: Record<string, string[]>
}

const getErrorMessage = (
  error: AxiosError<ApiErrorResponse>,
  defaultMsg: string
) => {
  const res = error.response?.data
  if (res) {
    if (res.errors && Object.keys(res.errors).length > 0) {
      const firstErrorArray = Object.values(res.errors)[0]
      return firstErrorArray?.[0] || defaultMsg
    }
    if (res.message) return res.message
  }
  return defaultMsg
}

function TeacherLoginFormComponent() {
  const queryClient = useQueryClient()
  const base = import.meta.env.BASE_URL

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  const loginMutation = useMutation<
    LoginResponse,
    AxiosError<ApiErrorResponse>,
    LoginPayload
  >({
    mutationFn: async (data: LoginPayload) => {
      const response = await api.post("/login", data)
      return response.data
    },
    onSuccess: async (data) => {
      localStorage.setItem("ws_token", data.token)
      localStorage.setItem("ws_user", JSON.stringify(data.user))

      queryClient.setQueryData(["authUser"], data.user)

      toast.success("Welcome to the Faculty Portal", {
        description: `Logged in as ${data.user.name}.`,
      })

      if (data.user.role === "teacher") {
        setTimeout(() => window.location.assign(`${base}teacher`), 800)
      } else {
        setTimeout(() => window.location.assign(base), 800)
      }
    },
    onError: (error) => {
      const message = getErrorMessage(error, "Invalid email or school code.")
      toast.error("Authentication Failed", { description: message })
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    clearErrors("root")

    try {
      const encryptedPassword = await encryptPayload(data.password)

      const payload: LoginPayload = {
        email: data.email,
        password: encryptedPassword,
      }

      loginMutation.mutate(payload)
    } catch (e) {
      console.error("Encryption Error:", e)
      setError("root.serverError", {
        type: "manual",
        message: "Unable to prepare your request. Please try again.",
      })
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {/* FACULTY EMAIL */}
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="ml-1 text-xs font-black tracking-widest text-(--wwf-ocean) uppercase"
          >
            Teacher Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="educator@school.edu"
            disabled={loginMutation.isPending}
            {...register("email")}
            className={`flex h-14 w-full rounded-2xl border-2 bg-slate-50/50 px-4 py-2 text-base font-medium text-(--wwf-ocean-deep) transition-all placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-(--wwf-ocean)/20 focus:outline-none disabled:opacity-50 ${
              errors.email
                ? "border-red-200 focus:border-red-500"
                : "border-slate-200 hover:border-(--wwf-ocean-light)/50 focus:border-(--wwf-ocean)"
            }`}
          />
          {errors.email && (
            <p className="ml-1 text-xs font-bold text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <div className="ml-1 flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-xs font-black tracking-widest text-(--wwf-ocean) uppercase"
            >
              School Code
            </label>
          </div>
          <input
            id="password"
            type="password"
            placeholder="WS-••••••"
            disabled={loginMutation.isPending}
            {...register("password")}
            className={`flex h-14 w-full rounded-2xl border-2 bg-slate-50/50 px-4 py-2 text-base font-medium text-(--wwf-ocean-deep) transition-all placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-(--wwf-ocean)/20 focus:outline-none disabled:opacity-50 ${
              errors.password
                ? "border-red-200 focus:border-red-500"
                : "border-slate-200 hover:border-(--wwf-ocean-light)/50 focus:border-(--wwf-ocean)"
            }`}
          />
          {errors.password && (
            <p className="ml-1 text-xs font-bold text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        {errors.root?.serverError && (
          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            <FileExclamationPoint />
            {errors.root.serverError.message}
          </div>
        )}

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="btn-wwf-primary group relative mt-6 flex h-14 w-full items-center justify-center gap-2 overflow-hidden rounded-2xl text-lg font-black shadow-(--wwf-coral)/20 shadow-lg transition-all hover:-translate-y-1 hover:shadow-(--wwf-coral)/30 hover:shadow-xl disabled:pointer-events-none disabled:opacity-50"
        >
          {loginMutation.isPending ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Authenticating...
            </>
          ) : (
            <>
              Access Portal
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
        <a
          href={`${base}forgot-password`}
          className="block text-center text-sm text-(--wwf-ocean-deep) hover:underline"
        >
          Forgot Password ?
        </a>
      </form>
    </div>
  )
}

export function TeacherLoginForm() {
  return (
    <QueryProvider>
      <TeacherLoginFormComponent />
    </QueryProvider>
  )
}
