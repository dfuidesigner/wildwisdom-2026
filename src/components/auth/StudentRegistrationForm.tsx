import { useEffect, useState } from "react"
import { useForm, useWatch } from "react-hook-form"
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

    email: z
      .string()
      .email("Please enter a valid email address")
      .max(255, "Email is too long"),

    phone_number: z
      .string()
      .length(10, "Phone number must be exactly 10 digits")
      .regex(/^\d+$/, "Phone number must contain only numbers"),

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
type RegisterPayload = StudentFormData

interface SimpleApiResponse {
  status: "success" | "error"
  message?: string
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

  const {
    register,
    handleSubmit,
    control,
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
      email: "",
      phone_number: "",
      otp: "",
      section: "",
      roll_number: "",
      grade: "6",
      password: "",
      password_confirmation: "",
    },
  })

  const watchedEmail = watch("email")
  const watchedPhone = watch("phone_number")
  const watchedOtp = watch("otp")

  const [debouncedPhone, setDebouncedPhone] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedPhone(watchedPhone)
    }, 500)

    return () => clearTimeout(timer)
  }, [watchedPhone])

  const { data: phoneCheck, isFetching: isCheckingPhone } = useQuery({
    queryKey: ["checkStudentPhone", debouncedPhone],
    queryFn: async () => {
      const response = await api.get(`/student/check-phone/${debouncedPhone}`)
      return response.data.data as { available: boolean }
    },
    enabled: debouncedPhone.length === 10,
    retry: false,
  })

  const phoneNumberTaken =
    watchedPhone === debouncedPhone &&
    debouncedPhone.length === 10 &&
    phoneCheck?.available === false

  const showOtpInput =
    watchedPhone?.length === 10 && phoneCheck?.available === true

  const [otpSent, setOtpSent] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)
  const [resendSeconds, setResendSeconds] = useState(0)

  useEffect(() => {
    setOtpSent(false)
    setOtpVerified(false)
    setValue("otp", "")
    clearErrors("phone_number")
  }, [watchedEmail, watchedPhone, setValue, clearErrors])

  useEffect(() => {
    if (phoneNumberTaken) {
      setError("phone_number", {
        type: "manual",
        message: "This mobile number is already registered.",
      })
    }
  }, [phoneNumberTaken, setError])

  useEffect(() => {
    if (resendSeconds <= 0 || otpVerified) return

    const timer = setTimeout(() => {
      setResendSeconds((value) => value - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [resendSeconds, otpVerified])

  const currentSchoolCode = useWatch({
    control,
    name: "school_code",
  })

  const [debouncedCode, setDebouncedCode] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCode(currentSchoolCode)
    }, 500)

    return () => clearTimeout(timer)
  }, [currentSchoolCode])

  const PLATFORM_SLUG = import.meta.env.PUBLIC_PLATFORM_SLUG || "wildwisdom"

  const {
    data: schoolInfo,
    isFetching: isCheckingSchool,
    isError: isSchoolError,
  } = useQuery({
    queryKey: ["checkSchoolCode", debouncedCode],
    queryFn: async () => {
      const response = await api.get(
        `/schools/verify/${PLATFORM_SLUG}/${debouncedCode}`
      )
      return response.data.data
    },
    enabled: debouncedCode.length >= 4,
    retry: false,
  })

  const sendOtpMutation = useMutation<
    SimpleApiResponse,
    AxiosError<ValidationErrorResponse>,
    {
      email: string
      phone_number: string
    }
  >({
    mutationFn: async (payload) => {
      const response = await api.post("/student/send-otp", payload)
      return response.data
    },
    onSuccess: (data) => {
      setOtpSent(true)
      setOtpVerified(false)
      setValue("otp", "")
      setResendSeconds(60)

      toast.success("OTP Sent", {
        description: data.message || "OTP sent to your mobile number.",
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
    {
      email: string
      phone_number: string
      otp: string
    }
  >({
    mutationFn: async (payload) => {
      const response = await api.post("/student/verify-otp", payload)
      return response.data
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
    RegisterPayload
  >({
    mutationFn: async (data) => {
      const response = await api.post("/register-student", data)
      return response.data
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
      const message = getErrorMessage(
        error,
        "Could not register. Please try again."
      )

      toast.error("Registration Failed", { description: message })
    },
  })

  const handleSendOtp = async () => {
    clearErrors("root")

    const email = getValues("email")
    const phoneNumber = getValues("phone_number")

    if (!email || phoneNumber.length !== 10) {
      toast.error("Missing Details", {
        description: "Enter a valid email and 10 digit mobile number first.",
      })
      return
    }

    sendOtpMutation.mutate({
      email,
      phone_number: phoneNumber,
    })
  }

  const handleVerifyOtp = async () => {
    clearErrors("root")

    const email = getValues("email")
    const phoneNumber = getValues("phone_number")
    const otp = getValues("otp")

    if (!email || phoneNumber.length !== 10 || otp.length !== 6) {
      toast.error("Invalid OTP Details", {
        description: "Enter the 6 digit OTP sent to your mobile.",
      })
      return
    }

    verifyOtpMutation.mutate({
      email,
      phone_number: phoneNumber,
      otp,
    })
  }

  const onSubmit = async (data: StudentFormData) => {
    clearErrors("root")

    if (!otpVerified) {
      toast.error("OTP Required", {
        description: "Please verify your mobile OTP before registering.",
      })
      return
    }

    try {
      const encryptedPassword = await encryptPayload(data.password)

      const payload: RegisterPayload = {
        ...data,
        password: encryptedPassword,
        password_confirmation: encryptedPassword,
      }

      registerMutation.mutate(payload)
    } catch {
      setError("root.serverError", {
        type: "manual",
        message: "Unable to encrypt your password. Please try again.",
      })
    }
  }

  const renderInput = (
    name: keyof StudentFormData,
    placeholder: string,
    type = "text",
    maxLength?: number,
    disabled = registerMutation.isPending
  ) => (
    <div className="w-full space-y-1">
      <input
        type={type}
        placeholder={placeholder}
        maxLength={maxLength}
        {...register(name)}
        disabled={disabled}
        onInput={(e) => {
          if (name === "phone_number" || name === "otp") {
            e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, "")
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
          {errors[name]?.message}
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
          {errors[name]?.message}
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

      <fieldset className="pt-4">
        <legend className="mb-1 text-2xl font-bold text-(--wwf-ocean-deep)">
          Student Information
        </legend>

        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {renderInput("email", "Email Address*", "email")}
          {renderSelect("grade", "Select Grade*", grades)}
        </div>

        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {renderInput("roll_number", "Roll Number*")}
          {renderInput("section", "Section*")}
        </div>

        <div className="mb-4">
          {renderInput("phone_number", "Mobile Number*", "tel", 10)}
        </div>

        {showOtpInput && (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-bold text-(--wwf-ocean-deep)">
              <ShieldCheck size={18} />
              Mobile OTP Verification
            </div>

            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              {renderInput(
                "otp",
                "Enter 6 digit OTP",
                "text",
                6,
                registerMutation.isPending || !otpSent || otpVerified
              )}

              <button
                type="button"
                onClick={otpSent ? handleVerifyOtp : handleSendOtp}
                disabled={
                  sendOtpMutation.isPending ||
                  verifyOtpMutation.isPending ||
                  otpVerified ||
                  (otpSent && watchedOtp?.length !== 6)
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
                        : "Send OTP"}
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
                  ? `Resend OTP in ${resendSeconds}s`
                  : "Resend OTP"}
              </button>
            )}
          </div>
        )}
      </fieldset>

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
            <>Verify OTP to Continue</>
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
