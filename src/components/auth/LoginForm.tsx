import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import api from "@/lib/axios"
import { Loader2, ArrowRight, FileExclamationPoint } from "lucide-react"
import { QueryProvider } from "@/components/providers/QueryProvider"
import type { AxiosError } from "axios"
import type { LoginResponse } from "@/types/auth"
import type { ValidationErrorResponse } from "@/types/api"
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
    .min(1, "Password is required")
    .max(100, "Password is too long"),
})
type LoginFormData = z.infer<typeof loginSchema>
const base = import.meta.env.BASE_URL

function LoginFormComponent() {
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
    AxiosError<{ message?: string } | ValidationErrorResponse>,
    LoginFormData
  >({
    mutationFn: async (data: LoginFormData) => {
      const response = await api.post("/login", data)
      return response.data
    },
    onSuccess: async (data) => {
      localStorage.setItem("ws_token", data.token)
      localStorage.setItem("ws_user", JSON.stringify(data.user))

      toast.success("Login Successful!", {
        description: `Welcome back, ${data.user.name}.`,
      })
      if (data.user.role === "teacher") {
        setTimeout(() => window.location.assign(`${base}teacher`), 800)
      } else if (data.user.role === "student") {
        setTimeout(() => window.location.assign(`${base}play/levels`), 800)
      } else if (data.user.role === "admin") {
        setTimeout(() => window.location.assign(`${base}admin`), 800)
      } else if (data.user.role === "state_admin") {
        setTimeout(() => window.location.assign(`${base}state-admin`), 800)
      } else {
        setTimeout(() => window.location.assign(base), 800)
      }
    },
    onError: (error) => {
      const res = error.response?.data
      const status = error.response?.status
      let message = "Invalid email or password."

      if (res) {
        if ("message" in res && typeof res.message === "string")
          message = res.message
        if ("errors" in res) {
          const firstError = Object.values(res.errors)[0]?.[0]
          if (firstError) message = firstError
        }
      }
      if (status === 429) {
        toast.error("Too Many Attempts", {
          description: "Please wait a minute before trying again.",
        })
        return
      }
      toast.error("Authentication Failed", { description: message })
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    clearErrors("root")

    try {
      const encryptedPassword = await encryptPayload(data.password)

      loginMutation.mutate({
        email: data.email,
        password: encryptedPassword,
      })
    } catch (e) {
      console.error("Encryption Error:", e)
      setError("root.serverError", {
        type: "manual",
        message: "Something went wrong while preparing your request.",
      })
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="ml-1 text-xs font-black tracking-widest text-(--wwf-ocean-light) uppercase"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="explorer@wildlife.com"
            disabled={loginMutation.isPending}
            {...register("email")}
            className={`flex h-12 w-full rounded-xl border-2 bg-(--wwf-white) px-4 py-2 text-sm font-medium text-(--wwf-ocean-deep) transition-all focus:ring-4 focus:ring-(--wwf-sea-green)/20 focus:outline-none disabled:opacity-50 ${
              errors.email
                ? "border-red-200 focus:border-red-500"
                : "border-(--wwf-border) focus:border-(--wwf-sea-green)"
            }`}
          />
          {errors.email && (
            <p className="ml-1 text-xs font-bold text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <div className="ml-1 flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-xs font-black tracking-widest text-(--wwf-ocean-light) uppercase"
            >
              Password
            </label>
          </div>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            disabled={loginMutation.isPending}
            {...register("password")}
            className={`flex h-12 w-full rounded-xl border-2 bg-(--wwf-white) px-4 py-2 text-sm font-medium text-(--wwf-ocean-deep) transition-all focus:ring-4 focus:ring-(--wwf-sea-green)/20 focus:outline-none disabled:opacity-50 ${
              errors.password
                ? "border-red-200 focus:border-red-500"
                : "border-(--wwf-border) focus:border-(--wwf-sea-green)"
            }`}
          />
          {errors.password && (
            <p className="ml-1 text-xs font-bold text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="btn-wwf-primary group relative mt-4 flex h-14 w-full items-center justify-center gap-2 overflow-hidden rounded-xl text-lg font-black shadow-xl hover:-translate-y-1 disabled:pointer-events-none disabled:opacity-50"
        >
          {loginMutation.isPending ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              Sign In
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
        {errors.root?.serverError && (
          <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            <FileExclamationPoint />
            {errors.root.serverError.message}
          </div>
        )}
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

export function LoginForm() {
  return (
    <QueryProvider>
      <LoginFormComponent />
    </QueryProvider>
  )
}
