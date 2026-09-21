import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type { AxiosError } from "axios"

import api from "@/lib/axios"
import { encryptPayload } from "@/lib/encryption"
import { QueryProvider } from "@/components/providers/QueryProvider"
import type { StudentRegisterResponse } from "@/types/auth"
import type { ValidationErrorResponse } from "@/types/api"

import {
  Loader2,
  CheckCircle2,
  XCircle,
  Building2,
  Info,
  FileExclamationPoint,
  Copy,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react"

const grades = ["6", "7", "8", "9"] as const

const studentSchema = z
  .object({
    school_code: z
      .string()
      .min(4, "School code is required")
      .max(20, "School code is too long")
      .regex(/^[^<>]*$/, "Invalid characters detected"),

    grade: z.enum(grades, {
      errorMap: () => ({ message: "Please select a valid grade" }),
    }),

    section: z
      .string()
      .min(1, "Section is required")
      .max(20, "Section is too long"),

    roll_number: z
      .string()
      .min(1, "Roll Number is required")
      .max(50, "Roll Number is too long"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password is too long"),

    password_confirmation: z
      .string()
      .min(8, "Please confirm your password")
      .max(100, "Confirmation is too long"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  })

type StudentFormData = z.infer<typeof studentSchema>

const getErrorMessage = (
  error: AxiosError<ValidationErrorResponse>,
  fallback: string
) => {
  const res = error.response?.data
  if (res?.errors && Object.keys(res.errors).length > 0) {
    return Object.values(res.errors)[0]?.[0] || fallback
  }
  return res?.message || fallback
}

function StudentRegistrationFormComponent() {
  const queryClient = useQueryClient()
  const PLATFORM_SLUG = import.meta.env.PUBLIC_PLATFORM_SLUG || "wildwisdom"

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      school_code: "",
      section: "",
      roll_number: "",
      grade: "6",
      password: "",
      password_confirmation: "",
    },
  })

  const watchedSchoolCode = watch("school_code") ?? ""
  const [debouncedCode, setDebouncedCode] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedCode(watchedSchoolCode), 500)
    return () => clearTimeout(timer)
  }, [watchedSchoolCode])

  const {
    data: schoolInfo,
    isFetching: isCheckingSchool,
    isError: isSchoolError,
  } = useQuery({
    queryKey: ["checkSchoolCode", debouncedCode],
    queryFn: async () => {
      const r = await api.get(
        `/schools/verify/${PLATFORM_SLUG}/${debouncedCode}`
      )
      return r.data.data
    },
    enabled: debouncedCode.length >= 4,
    retry: false,
  })

  const [credentials, setCredentials] = useState<{
    studentId: string
    password: string
  } | null>(null)
  const [hasConfirmedSaved, setHasConfirmedSaved] = useState(false)

  const registerMutation = useMutation<
    StudentRegisterResponse,
    AxiosError<ValidationErrorResponse>,
    { payload: Record<string, string>; rawPassword: string }
  >({
    mutationFn: async (vars) => {
      const r = await api.post("/register-student", vars.payload)
      return r.data
    },
    onSuccess: (data, variables) => {
      localStorage.setItem("ws_token", data.token)
      localStorage.setItem("ws_user", JSON.stringify(data.user))
      queryClient.setQueryData(["authUser"], data.user)

      setCredentials({
        studentId: data.user.phone_number,
        password: variables.rawPassword,
      })
    },
    onError: (error) => {
      toast.error("Registration Failed", {
        description: getErrorMessage(error, "Could not register."),
      })
    },
  })

  const onSubmit = async (data: StudentFormData) => {
    clearErrors("root")
    try {
      const encryptedPassword = await encryptPayload(data.password)
      registerMutation.mutate({
        payload: {
          grade: data.grade,
          section: data.section,
          roll_number: data.roll_number,
          password: encryptedPassword,
          password_confirmation: encryptedPassword,
          school_code: data.school_code,
        },
        rawPassword: data.password,
      })
    } catch {
      setError("root.serverError", {
        type: "manual",
        message: "Unable to encrypt your password. Please try again.",
      })
    }
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(label + " copied")
  }

  const continueToPlay = () => {
    window.location.assign(import.meta.env.BASE_URL + "play/levels")
  }

  if (credentials) {
    return (
      <div className="flex flex-col items-center py-4 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-(--wwf-sea-green)/15">
          <ShieldCheck size={32} className="text-(--wwf-sea-green)" />
        </div>

        <h3 className="mb-2 text-2xl font-black text-(--wwf-ocean-deep)">
          Thank you for registering!
        </h3>

        <p className="mb-6 max-w-sm text-sm font-semibold text-slate-600">
          Please find your login credentials below and keep them safely saved
          for future use. We also request you to note down your username
          carefully and ensure that it is stored securely.
        </p>

        <div className="mb-3 w-full max-w-sm space-y-3">
          <div>
            <span className="ml-1 text-[11px] font-black tracking-widest text-(--wwf-ocean-deep)/60 uppercase">
              Student ID
            </span>
            <div className="mt-1 flex items-center justify-between rounded-2xl border-2 border-(--wwf-sea-green) bg-(--wwf-sea-green)/5 px-5 py-3.5">
              <span className="font-mono text-2xl font-black tracking-[0.15em] text-(--wwf-ocean-deep)">
                {credentials.studentId}
              </span>
              <button
                type="button"
                onClick={() =>
                  copyToClipboard(credentials.studentId, "Student ID")
                }
                className="rounded-lg bg-white p-2 text-(--wwf-ocean) shadow-sm hover:text-(--wwf-coral)"
              >
                <Copy size={18} />
              </button>
            </div>
          </div>

          <div>
            <span className="ml-1 text-[11px] font-black tracking-widest text-(--wwf-ocean-deep)/60 uppercase">
              Password
            </span>
            <div className="mt-1 flex items-center justify-between rounded-2xl border-2 border-slate-200 bg-slate-50 px-5 py-3.5">
              <span className="font-mono text-lg font-bold text-(--wwf-ocean-deep)">
                {credentials.password}
              </span>
              <button
                type="button"
                onClick={() =>
                  copyToClipboard(credentials.password, "Password")
                }
                className="rounded-lg bg-white p-2 text-(--wwf-ocean) shadow-sm hover:text-(--wwf-coral)"
              >
                <Copy size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="mb-6 flex w-full max-w-sm items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-left text-xs font-semibold text-amber-800">
          <AlertTriangle size={16} className="mt-0.5 shrink-0" />
          <span>
            In case you forget your username or password, please contact your
            Teacher Coordinator and request the credentials again. Thank you,
            and please keep your login details safe and confidential.
          </span>
        </div>

        <label className="mb-5 flex items-center gap-2 text-sm font-bold text-(--wwf-ocean-deep)">
          <input
            type="checkbox"
            checked={hasConfirmedSaved}
            onChange={(e) => setHasConfirmedSaved(e.target.checked)}
            className="h-4 w-4 rounded"
          />
          I've saved my Student ID and password
        </label>

        <button
          type="button"
          onClick={continueToPlay}
          disabled={!hasConfirmedSaved}
          className="btn btn-success flex h-14 w-full max-w-sm items-center justify-center rounded-2xl bg-green-600 text-lg font-black text-white shadow-lg transition-all hover:-translate-y-1 disabled:pointer-events-none disabled:opacity-50"
        >
          Continue to Play
        </button>
      </div>
    )
  }

  const renderInput = (
    name: keyof StudentFormData,
    placeholder: string,
    type: string = "text"
  ) => (
    <div className="w-full space-y-1">
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        {...register(name)}
        disabled={registerMutation.isPending}
        className={
          "flex h-14 w-full rounded-2xl border-2 bg-slate-50/50 px-4 py-2 text-base font-medium text-(--wwf-ocean-deep) transition-all placeholder:text-slate-500 focus:bg-white focus:ring-4 focus:ring-(--wwf-ocean)/20 focus:outline-none disabled:opacity-50 " +
          (errors[name]
            ? "border-red-200 focus:border-red-500"
            : "border-slate-200 hover:border-(--wwf-ocean-light)/50 focus:border-(--wwf-ocean)")
        }
      />
      {errors[name] && (
        <p className="ml-1 text-xs font-bold text-red-500">
          {errors[name]?.message as string}
        </p>
      )}
    </div>
  )

  const renderSelect = (
    name: keyof StudentFormData,
    placeholder: string,
    options: readonly string[]
  ) => (
    <div className="w-full space-y-1">
      <select
        id={name}
        {...register(name)}
        disabled={registerMutation.isPending}
        className={
          "flex h-14 w-full rounded-2xl border-2 bg-slate-50/50 px-4 py-2 text-base font-medium text-(--wwf-ocean-deep) transition-all focus:bg-white focus:ring-4 focus:ring-(--wwf-ocean)/20 focus:outline-none disabled:opacity-50 " +
          (errors[name]
            ? "border-red-200 focus:border-red-500"
            : "border-slate-200 hover:border-(--wwf-ocean-light)/50 focus:border-(--wwf-ocean)")
        }
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            Grade {opt}
          </option>
        ))}
      </select>
      {errors[name] && (
        <p className="ml-1 text-xs font-bold text-red-500">
          {errors[name]?.message as string}
        </p>
      )}
    </div>
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
      <fieldset>
        <legend className="mb-2 text-2xl font-bold text-(--wwf-ocean-deep)">
          School Authorization
        </legend>

        <span className="mb-5 flex items-center rounded-lg bg-yellow-100/50 px-3 py-2 text-sm font-medium text-yellow-800">
          <Info className="mr-2 h-4 w-4 shrink-0" />
          <mark className="bg-transparent">
            Ask your teacher for your school's unique WWGC-XXXXX code to
            register.
          </mark>
        </span>

        <div className="mb-4">
          <div className="relative">
            <input
              id="school_code"
              type="text"
              placeholder="School Code (e.g. WWGC26-XXXXX)*"
              disabled={registerMutation.isPending}
              {...register("school_code")}
              className={
                "flex h-14 w-full rounded-2xl border-2 bg-slate-50/50 px-4 py-2 text-base font-bold tracking-widest text-(--wwf-ocean-deep) uppercase transition-colors placeholder:font-medium placeholder:tracking-normal placeholder:text-slate-500 placeholder:normal-case focus:bg-white focus:ring-4 focus:ring-(--wwf-ocean)/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 " +
                (errors.school_code || isSchoolError
                  ? "border-red-500 focus:border-red-500"
                  : schoolInfo
                    ? "border-(--wwf-sea-green) focus:border-(--wwf-sea-green)"
                    : "border-slate-200 hover:border-(--wwf-ocean-light)/50 focus:border-(--wwf-ocean)")
              }
            />
            <div className="absolute inset-y-0 right-4 flex items-center">
              {isCheckingSchool ? (
                <Loader2 className="h-6 w-6 animate-spin text-(--wwf-ocean)" />
              ) : schoolInfo ? (
                <CheckCircle2 className="h-6 w-6 text-(--wwf-sea-green)" />
              ) : isSchoolError && debouncedCode.length >= 4 ? (
                <XCircle className="h-6 w-6 text-red-500" />
              ) : null}
            </div>
          </div>

          {errors.school_code ? (
            <p className="mt-1 ml-1 text-xs font-bold text-red-500">
              {errors.school_code.message}
            </p>
          ) : isCheckingSchool ? (
            <p className="mt-1 ml-1 animate-pulse text-xs font-bold text-(--wwf-ocean)">
              Searching for school...
            </p>
          ) : schoolInfo ? (
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-(--wwf-sea-green)/20 px-4 py-3 text-sm font-bold text-(--wwf-ocean-deep)">
              <Building2 size={18} className="text-(--wwf-ocean-dark)" />
              {schoolInfo.school_name}
            </div>
          ) : isSchoolError && debouncedCode.length >= 4 ? (
            <p className="mt-1 ml-1 text-xs font-bold text-red-500">
              Invalid School Code. Please check again.
            </p>
          ) : null}
        </div>
      </fieldset>

      <fieldset className="pt-4">
        <legend className="mb-1 text-2xl font-bold text-(--wwf-ocean-deep)">
          Student Information
        </legend>

        {/* <p className="mb-5 text-xs font-semibold text-slate-500">
          We'll generate a unique Student ID for you after registration — no
          email or phone number needed.
        </p> */}

        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {renderSelect("grade", "Select Grade*", grades)}
          {renderInput("roll_number", "Roll Number*")}
        </div>

        <div className="mb-4">{renderInput("section", "Section*")}</div>
      </fieldset>

      <fieldset className="pt-4">
        <legend className="text-2xl font-bold text-(--wwf-ocean-deep)">
          Password
        </legend>

        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {renderInput("password", "Password*", "password")}
          {renderInput(
            "password_confirmation",
            "Confirm Password*",
            "password"
          )}
        </div>
      </fieldset>

      {errors.root?.serverError && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          <FileExclamationPoint className="h-5 w-5" />
          {errors.root.serverError.message}
        </div>
      )}

      <div className="pt-4">
        <button
          type="submit"
          disabled={
            registerMutation.isPending ||
            (debouncedCode.length >= 4 && isSchoolError)
          }
          className="btn btn-success relative flex h-14 w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-green-600 text-lg font-black text-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl disabled:pointer-events-none disabled:opacity-50"
        >
          {registerMutation.isPending ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Registering...
            </>
          ) : (
            <>Submit and Play</>
          )}
        </button>
      </div>
    </form>
  )
}

export function StudentRegistrationForm() {
  return (
    <QueryProvider>
      <StudentRegistrationFormComponent />
    </QueryProvider>
  )
}
