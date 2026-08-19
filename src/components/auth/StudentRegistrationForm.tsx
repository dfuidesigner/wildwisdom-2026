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
  RefreshCw,
  ShieldCheck,
} from "lucide-react"

const grades = ["6", "7", "8", "9"] as const

const studentSchema = z
  .object({
    school_code: z
      .string()
      .min(4, "School code is required")
      .max(20, "School code is too long")
      .regex(/^[^<>]*$/, "Invalid characters detected"),

    identifier: z
      .string()
      .min(1, "Email or phone number is required")
      .max(255, "Identifier is too long")
      .refine((v) => {
        const val = v.trim()
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || /^\d{10}$/.test(val)
      }, "Enter a valid email address or a 10-digit mobile number"),

    otp: z
      .string()
      .length(6, "OTP must be exactly 6 digits")
      .regex(/^\d+$/, "OTP must contain only numbers"),

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

interface SimpleApiResponse {
  status: "success" | "error"
  message?: string
}
interface AvailabilityResponse {
  available: boolean
}

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
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      school_code: "",
      identifier: "",
      otp: "",
      section: "",
      roll_number: "",
      grade: "6",
      password: "",
      password_confirmation: "",
    },
  })

  const watchedIdentifier = watch("identifier") ?? ""
  const watchedOtp = watch("otp") ?? ""
  const watchedSchoolCode = watch("school_code") ?? ""

  // debounce
  const [debouncedIdentifier, setDebouncedIdentifier] = useState("")
  const [debouncedCode, setDebouncedCode] = useState("")

  useEffect(() => {
    const timer = setTimeout(
      () => setDebouncedIdentifier(watchedIdentifier),
      500
    )
    return () => clearTimeout(timer)
  }, [watchedIdentifier])

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedCode(watchedSchoolCode), 500)
    return () => clearTimeout(timer)
  }, [watchedSchoolCode])

  // detect channel from identifier
  const debouncedTrimmed = debouncedIdentifier.trim()
  const detectedIsEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(debouncedTrimmed)
  const detectedIsPhone = /^\d{10}$/.test(debouncedTrimmed)
  const channel: "phone" | "email" | null = detectedIsPhone
    ? "phone"
    : detectedIsEmail
      ? "email"
      : null

  // identifier availability checks
  const { data: phoneCheck } = useQuery({
    queryKey: ["checkStudentPhone", debouncedIdentifier],
    queryFn: async () => {
      const r = await api.get(`/student/check-phone/${debouncedTrimmed}`)
      return r.data.data as AvailabilityResponse
    },
    enabled: detectedIsPhone,
    retry: false,
  })

  const { data: emailCheck } = useQuery({
    queryKey: ["checkStudentEmail", debouncedIdentifier],
    queryFn: async () => {
      const r = await api.get(
        `/student/check-email?email=${encodeURIComponent(debouncedTrimmed)}`
      )
      return r.data.data as AvailabilityResponse
    },
    enabled: detectedIsEmail,
    retry: false,
  })

  const isTaken = detectedIsPhone
    ? phoneCheck?.available === false
    : detectedIsEmail
      ? emailCheck?.available === false
      : false

  const isAvailable = detectedIsPhone
    ? phoneCheck?.available === true
    : detectedIsEmail
      ? emailCheck?.available === true
      : false

  const showOtpInput = isAvailable

  // OTP state
  const [otpSent, setOtpSent] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)
  const [resendSeconds, setResendSeconds] = useState(0)

  // Reset OTP state whenever the identifier changes
  useEffect(() => {
    setOtpSent(false)
    setOtpVerified(false)
    setValue("otp", "")
    clearErrors(["identifier"])
  }, [watchedIdentifier, setValue, clearErrors])

  // Resend countdown
  useEffect(() => {
    if (resendSeconds <= 0 || otpVerified) return
    const timer = setTimeout(() => setResendSeconds((v) => v - 1), 1000)
    return () => clearTimeout(timer)
  }, [resendSeconds, otpVerified])

  // school code check
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

  // mutations
  const identifierPayload = () => {
    const val = getValues("identifier").trim()
    return channel === "phone" ? { phone_number: val } : { email: val }
  }

  const sendOtpMutation = useMutation<
    SimpleApiResponse,
    AxiosError<ValidationErrorResponse>,
    { email?: string; phone_number?: string }
  >({
    mutationFn: async (payload) => {
      const r = await api.post("/student/send-otp", payload)
      return r.data
    },
    onSuccess: (data) => {
      setOtpSent(true)
      setOtpVerified(false)
      setValue("otp", "")
      setResendSeconds(60)
      toast.success("OTP Sent", {
        description:
          channel === "phone"
            ? "OTP sent to your mobile."
            : "OTP sent to your email address.",
      })
    },
    onError: (error) => {
      toast.error("OTP Failed", {
        description: getErrorMessage(error, "Could not send OTP."),
      })
    },
  })

  const verifyOtpMutation = useMutation<
    SimpleApiResponse,
    AxiosError<ValidationErrorResponse>,
    { email?: string; phone_number?: string; otp: string }
  >({
    mutationFn: async (payload) => {
      const r = await api.post("/student/verify-otp", payload)
      return r.data
    },
    onSuccess: (data) => {
      setOtpVerified(true)
      toast.success("OTP Verified", {
        description: data.message || "You can now complete registration.",
      })
    },
    onError: (error) => {
      setOtpVerified(false)
      toast.error("OTP Verification Failed", {
        description: getErrorMessage(error, "Invalid or expired OTP."),
      })
    },
  })

  const registerMutation = useMutation<
    StudentRegisterResponse,
    AxiosError<ValidationErrorResponse>,
    Record<string, string>
  >({
    mutationFn: async (data) => {
      const r = await api.post("/register-student", data)
      return r.data
    },
    onSuccess: async (data) => {
      localStorage.setItem("ws_token", data.token)
      localStorage.setItem("ws_user", JSON.stringify(data.user))
      queryClient.setQueryData(["authUser"], data.user)

      toast.success("Registration Successful!", {
        description: "Welcome to WildWisdom!",
      })

      setTimeout(() => {
        window.location.assign(`${import.meta.env.BASE_URL}play/levels`)
      }, 800)
    },
    onError: (error) => {
      toast.error("Registration Failed", {
        description: getErrorMessage(error, "Could not register."),
      })
    },
  })

  // handlers
  const handleSendOtp = async () => {
    clearErrors("root")
    if (!channel) {
      toast.error("Provide a contact", {
        description:
          "Enter a valid 10-digit mobile number or email so we can send your code.",
      })
      return
    }
    sendOtpMutation.mutate(identifierPayload())
  }

  const handleVerifyOtp = async () => {
    clearErrors("root")
    const otp = getValues("otp")
    if (!channel || otp.length !== 6) {
      toast.error("Invalid code", {
        description: "Enter the 6-digit code we just sent.",
      })
      return
    }
    verifyOtpMutation.mutate({ ...identifierPayload(), otp })
  }

  const onSubmit = async (data: StudentFormData) => {
    clearErrors("root")

    if (!otpVerified) {
      toast.error("OTP Required", {
        description: "Please verify your code before registering.",
      })
      return
    }

    try {
      const encryptedPassword = await encryptPayload(data.password)
      const input = data.identifier.trim()
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input)

      const payload: Record<string, string> = {
        otp: data.otp,
        grade: data.grade,
        section: data.section,
        roll_number: data.roll_number,
        password: encryptedPassword,
        password_confirmation: encryptedPassword,
        school_code: data.school_code,
      }

      if (isEmail) {
        payload.email = input
      } else {
        payload.phone_number = input
      }

      registerMutation.mutate(payload)
    } catch {
      setError("root.serverError", {
        type: "manual",
        message: "Unable to encrypt your password. Please try again.",
      })
    }
  }

  // render helpers
  const renderInput = (
    name: keyof StudentFormData,
    placeholder: string,
    type: string = "text",
    maxLength?: number,
    disabled: boolean = registerMutation.isPending,
    onInputSanitizer?: (raw: string) => string
  ) => (
    <div className="w-full space-y-1">
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        maxLength={maxLength}
        {...register(name)}
        disabled={disabled}
        onInput={(e) => {
          if (onInputSanitizer) {
            const cleaned = onInputSanitizer(e.currentTarget.value)
            if (cleaned !== e.currentTarget.value)
              e.currentTarget.value = cleaned
          }
        }}
        className={`flex h-14 w-full rounded-2xl border-2 bg-slate-50/50 px-4 py-2 text-base font-medium text-(--wwf-ocean-deep) transition-all placeholder:text-slate-500 focus:bg-white focus:ring-4 focus:ring-(--wwf-ocean)/20 focus:outline-none disabled:opacity-50 ${
          errors[name]
            ? "border-red-200 focus:border-red-500"
            : "border-slate-200 hover:border-(--wwf-ocean-light)/50 focus:border-(--wwf-ocean)"
        }`}
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
        className={`flex h-14 w-full rounded-2xl border-2 bg-slate-50/50 px-4 py-2 text-base font-medium text-(--wwf-ocean-deep) transition-all focus:bg-white focus:ring-4 focus:ring-(--wwf-ocean)/20 focus:outline-none disabled:opacity-50 ${
          errors[name]
            ? "border-red-200 focus:border-red-500"
            : "border-slate-200 hover:border-(--wwf-ocean-light)/50 focus:border-(--wwf-ocean)"
        }`}
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
      {/* School Authorization */}
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
              className={`flex h-14 w-full rounded-2xl border-2 bg-slate-50/50 px-4 py-2 text-base font-bold tracking-widest text-(--wwf-ocean-deep) uppercase transition-colors placeholder:font-medium placeholder:tracking-normal placeholder:text-slate-500 placeholder:normal-case focus:bg-white focus:ring-4 focus:ring-(--wwf-ocean)/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${
                errors.school_code || isSchoolError
                  ? "border-red-500 focus:border-red-500"
                  : schoolInfo
                    ? "border-(--wwf-sea-green) focus:border-(--wwf-sea-green)"
                    : "border-slate-200 hover:border-(--wwf-ocean-light)/50 focus:border-(--wwf-ocean)"
              }`}
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

      {/* Student Information */}
      <fieldset className="pt-4">
        <legend className="mb-1 text-2xl font-bold text-(--wwf-ocean-deep)">
          Student Information
        </legend>

        <p className="mb-5 text-xs font-semibold text-slate-500">
          Enter your <strong>email address</strong> or{" "}
          <strong>10-digit mobile number</strong> — we'll send a verification
          code there.
        </p>

        {renderInput("identifier", "Email or 10-digit mobile number*")}

        <div className="mt-4 mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {renderSelect("grade", "Select Grade*", grades)}
          {renderInput("roll_number", "Roll Number*")}
        </div>

        <div className="mb-4">{renderInput("section", "Section*")}</div>

        {/* Taken identifier notice */}
        {isTaken && channel && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            <XCircle className="h-5 w-5 shrink-0" />
            {channel === "phone"
              ? "This mobile number is already registered."
              : "This email is already registered."}
          </div>
        )}

        {/* OTP section */}
        {showOtpInput && (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-bold text-(--wwf-ocean-deep)">
              <ShieldCheck size={18} />
              {channel === "phone"
                ? "Mobile Verification"
                : "Email Verification"}
            </div>

            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <input
                id="otp"
                type="text"
                maxLength={6}
                placeholder="Enter 6 digit OTP"
                disabled={registerMutation.isPending || !otpSent || otpVerified}
                {...register("otp")}
                onInput={(e) => {
                  e.currentTarget.value = e.currentTarget.value
                    .replace(/[^0-9]/g, "")
                    .slice(0, 6)
                }}
                className={`flex h-14 w-full rounded-2xl border-2 bg-slate-50/50 px-4 py-2 text-base font-medium text-(--wwf-ocean-deep) transition-all placeholder:text-slate-500 focus:bg-white focus:ring-4 focus:ring-(--wwf-ocean)/20 focus:outline-none disabled:opacity-50 ${
                  errors.otp
                    ? "border-red-200 focus:border-red-500"
                    : "border-slate-200 hover:border-(--wwf-ocean-light)/50 focus:border-(--wwf-ocean)"
                }`}
              />

              <button
                type="button"
                onClick={otpSent ? handleVerifyOtp : handleSendOtp}
                disabled={
                  sendOtpMutation.isPending ||
                  verifyOtpMutation.isPending ||
                  otpVerified ||
                  (otpSent && watchedOtp.length !== 6)
                }
                className="h-14 rounded-2xl bg-(--wwf-ocean-deep) px-5 text-sm font-bold text-white disabled:opacity-50"
              >
                {otpVerified
                  ? "Verified"
                  : verifyOtpMutation.isPending
                    ? "Verifying..."
                    : sendOtpMutation.isPending
                      ? "Sending..."
                      : otpSent
                        ? "Verify OTP"
                        : channel === "email"
                          ? "Send Email OTP"
                          : "Send SMS OTP"}
              </button>
            </div>

            {otpSent && !otpVerified && (
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={sendOtpMutation.isPending || resendSeconds > 0}
                className="mt-3 flex items-center gap-1 text-xs font-bold text-(--wwf-ocean-deep) disabled:opacity-50"
              >
                <RefreshCw size={13} />
                {resendSeconds > 0
                  ? `Resend in ${resendSeconds}s`
                  : "Resend OTP"}
              </button>
            )}
          </div>
        )}
      </fieldset>

      {/* Security */}
      <fieldset className="pt-4">
        <legend className="text-2xl font-bold text-(--wwf-ocean-deep)">
          Security
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
            !otpVerified ||
            (debouncedCode.length >= 4 && isSchoolError)
          }
          className="btn btn-success relative flex h-14 w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-green-600 text-lg font-black text-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl disabled:pointer-events-none disabled:opacity-50"
        >
          {registerMutation.isPending ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Registering...
            </>
          ) : !otpVerified ? (
            <>Verify your code to continue</>
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
