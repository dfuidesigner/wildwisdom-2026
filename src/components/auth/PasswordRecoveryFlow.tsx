import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import type { AxiosError } from "axios"

import api from "@/lib/axios"
import { encryptPayload } from "@/lib/encryption"
import { QueryProvider } from "@/components/providers/QueryProvider"

import {
  Loader2,
  LockKeyhole,
  ArrowLeft,
  RefreshCw,
  ArrowRight,
  FileExclamationPoint,
  Smartphone,
} from "lucide-react"

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp"

const stepOneSchema = z.object({
  phone_number: z
    .string()
    .length(10, "Phone number must be exactly 10 digits")
    .regex(/^\d+$/, "Phone number must contain only numbers"),
})

const stepTwoSchema = z.object({
  code: z
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
})

const stepThreeSchema = z
  .object({
    password: z
      .string()
      .min(8, "Minimum 8 characters")
      .max(100, "Password is too long"),
    password_confirmation: z.string().max(100, "Confirmation is too long"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  })

type StepOneData = z.infer<typeof stepOneSchema>
type StepTwoData = z.infer<typeof stepTwoSchema>
type StepThreeData = z.infer<typeof stepThreeSchema>

interface ApiResponse {
  status: string
  message: string
}

interface ApiErrorResponse {
  message?: string
  errors?: Record<string, string[]>
}

const getErrorMessage = (
  error: AxiosError<ApiErrorResponse>,
  defaultMsg: string
) => {
  const res = error.response?.data

  if (res?.errors && Object.keys(res.errors).length > 0) {
    return Object.values(res.errors)[0]?.[0] || defaultMsg
  }

  return res?.message || defaultMsg
}

function PasswordRecoveryContent() {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [savedPhone, setSavedPhone] = useState("")
  const [savedCode, setSavedCode] = useState("")
  const [resendSeconds, setResendSeconds] = useState(0)

  useEffect(() => {
    if (resendSeconds <= 0) return

    const timer = setTimeout(() => {
      setResendSeconds((value) => value - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [resendSeconds])

  const formOne = useForm<StepOneData>({
    resolver: zodResolver(stepOneSchema),
    defaultValues: { phone_number: "" },
  })

  const sendCodeMutation = useMutation<
    ApiResponse,
    AxiosError<ApiErrorResponse>,
    StepOneData
  >({
    mutationFn: async (data) => {
      const response = await api.post("/recovery/send-code", data)
      return response.data
    },
    onSuccess: (data, variables) => {
      setSavedPhone(variables.phone_number)
      setSavedCode("")
      setStep(2)
      setResendSeconds(60)
      formTwo.reset({ code: "" })

      toast.success("OTP Sent!", {
        description:
          data.message || "OTP sent to your registered mobile number.",
      })
    },
    onError: (error) => {
      toast.error("OTP Failed", {
        description: getErrorMessage(error, "Failed to send OTP."),
      })
    },
  })

  const resendCodeMutation = useMutation<
    ApiResponse,
    AxiosError<ApiErrorResponse>,
    void
  >({
    mutationFn: async () => {
      const response = await api.post("/recovery/send-code", {
        phone_number: savedPhone,
      })
      return response.data
    },
    onSuccess: (data) => {
      setSavedCode("")
      setResendSeconds(60)
      formTwo.reset({ code: "" })

      toast.success("OTP Resent!", {
        description: data.message || "A new OTP has been sent.",
      })
    },
    onError: (error) => {
      toast.error("Resend Failed", {
        description: getErrorMessage(error, "Please try again later."),
      })
    },
  })

  const onSubmitStepOne = async (data: StepOneData) => {
    formOne.clearErrors("root")
    sendCodeMutation.mutate(data)
  }

  const onResendCode = async () => {
    if (resendSeconds > 0) return
    resendCodeMutation.mutate()
  }

  const formTwo = useForm<StepTwoData>({
    resolver: zodResolver(stepTwoSchema),
    defaultValues: { code: "" },
  })

  const watchedCode = formTwo.watch("code")

  const verifyCodeMutation = useMutation<
    ApiResponse,
    AxiosError<ApiErrorResponse>,
    StepTwoData
  >({
    mutationFn: async (data) => {
      const response = await api.post("/recovery/verify-code", {
        ...data,
        phone_number: savedPhone,
      })
      return response.data
    },
    onSuccess: (data, variables) => {
      setSavedCode(variables.code)
      setStep(3)

      toast.success("Verified!", {
        description:
          data.message || "OTP accepted. Please enter a new password.",
      })
    },
    onError: (error) => {
      toast.error("Verification Failed", {
        description: getErrorMessage(error, "Invalid OTP."),
      })
    },
  })

  const onSubmitStepTwo = async (data: StepTwoData) => {
    formTwo.clearErrors("root")
    verifyCodeMutation.mutate(data)
  }

  const formThree = useForm<StepThreeData>({
    resolver: zodResolver(stepThreeSchema),
    defaultValues: { password: "", password_confirmation: "" },
  })

  const resetMutation = useMutation<
    ApiResponse,
    AxiosError<ApiErrorResponse>,
    {
      password: string
      password_confirmation: string
      code: string
      phone_number: string
    }
  >({
    mutationFn: async (data) => {
      const response = await api.post("/recovery/reset", data)
      return response.data
    },
    onSuccess: (data) => {
      toast.success("Password Restored!", {
        description: data.message || "You can now log in securely.",
      })

      setTimeout(
        () => window.location.assign(`${import.meta.env.BASE_URL}login`),
        2000
      )
    },
    onError: (error) => {
      toast.error("Reset Failed", {
        description: getErrorMessage(error, "Failed to reset password."),
      })
    },
  })

  const onSubmitStepThree = async (data: StepThreeData) => {
    formThree.clearErrors("root")

    if (!savedPhone || !savedCode) {
      toast.error("OTP Required", {
        description: "Please verify OTP before resetting password.",
      })
      setStep(1)
      return
    }

    try {
      const encryptedPassword = await encryptPayload(data.password)

      resetMutation.mutate({
        password: encryptedPassword,
        password_confirmation: encryptedPassword,
        phone_number: savedPhone,
        code: savedCode,
      })
    } catch {
      formThree.setError("root.serverError", {
        type: "manual",
        message: "Something went wrong while preparing your request.",
      })
    }
  }

  return (
    <div className="w-full">
      <div className="mb-8 flex items-center justify-center gap-2 sm:gap-4">
        <div
          className={`flex items-center gap-1.5 text-xs font-bold sm:text-sm ${
            step >= 1 ? "text-(--wwf-ocean-deep)" : "text-slate-400"
          }`}
        >
          <div
            className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
              step >= 1
                ? "border-(--wwf-ocean-deep) bg-(--wwf-sea-green)/10"
                : "border-slate-300"
            }`}
          >
            1
          </div>
          <span className="hidden sm:inline">Mobile</span>
        </div>

        <div
          className={`my-auto h-px w-4 sm:w-8 ${
            step >= 2 ? "bg-(--wwf-sea-green)" : "bg-slate-300"
          }`}
        />

        <div
          className={`flex items-center gap-1.5 text-xs font-bold sm:text-sm ${
            step >= 2 ? "text-(--wwf-orange)" : "text-slate-400"
          }`}
        >
          <div
            className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
              step >= 2
                ? "border-(--wwf-orange) bg-(--wwf-sea-green)/10"
                : "border-slate-300"
            }`}
          >
            2
          </div>
          <span className="hidden sm:inline">OTP</span>
        </div>

        <div
          className={`my-auto h-px w-4 sm:w-8 ${
            step === 3 ? "bg-(--wwf-sea-green)" : "bg-slate-300"
          }`}
        />

        <div
          className={`flex items-center gap-1.5 text-xs font-bold sm:text-sm ${
            step === 3 ? "text-(--wwf-coral)" : "text-slate-400"
          }`}
        >
          <div
            className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${
              step === 3
                ? "border-(--wwf-coral) bg-(--wwf-coral)/10"
                : "border-slate-300"
            }`}
          >
            3
          </div>
          <span className="hidden sm:inline">Reset</span>
        </div>
      </div>

      {step === 1 && (
        <form
          onSubmit={formOne.handleSubmit(onSubmitStepOne)}
          className="animate-in space-y-5 duration-300 fade-in slide-in-from-left-4"
          noValidate
        >
          <div className="mb-6 text-center">
            <p className="font-medium text-(--wwf-ocean-deep)">
              Enter your registered mobile number. We will send a 6 digit OTP.
            </p>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="phone_number"
              className="ml-1 text-xs font-black tracking-widest text-(--wwf-ocean-light) uppercase"
            >
              Registered Mobile Number
            </label>

            <input
              id="phone_number"
              type="tel"
              placeholder="10 digit mobile number"
              maxLength={10}
              disabled={sendCodeMutation.isPending}
              {...formOne.register("phone_number")}
              onInput={(e) => {
                e.currentTarget.value = e.currentTarget.value
                  .replace(/[^0-9]/g, "")
                  .slice(0, 10)
              }}
              className={`flex h-12 w-full rounded-xl border-2 bg-white/80 px-4 py-2 text-sm font-medium text-(--wwf-ocean-deep) transition-all focus:ring-4 focus:ring-(--wwf-sea-green)/20 focus:outline-none disabled:opacity-50 ${
                formOne.formState.errors.phone_number
                  ? "border-red-200 focus:border-red-500"
                  : "border-slate-200 focus:border-(--wwf-sea-green)"
              }`}
            />

            {formOne.formState.errors.phone_number && (
              <p className="ml-1 text-xs font-bold text-red-500">
                {formOne.formState.errors.phone_number.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={
              sendCodeMutation.isPending ||
              formOne.watch("phone_number")?.length !== 10
            }
            className="btn-wwf-primary group relative mt-4 flex h-14 w-full items-center justify-center gap-2 overflow-hidden rounded-xl text-lg font-black shadow-xl hover:-translate-y-1 disabled:pointer-events-none disabled:opacity-50"
          >
            {sendCodeMutation.isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Smartphone className="h-5 w-5" />
            )}
            Send OTP
          </button>
        </form>
      )}

      {step === 2 && (
        <form
          onSubmit={formTwo.handleSubmit(onSubmitStepTwo)}
          className="animate-in space-y-5 duration-300 fade-in slide-in-from-right-4"
          noValidate
        >
          <div className="mb-6 rounded-xl bg-(--wwf-sea-green)/10 p-4 text-center text-sm font-medium text-(--wwf-ocean-deep)">
            OTP sent to <strong>{savedPhone}</strong>.
          </div>

          <div className="flex flex-col items-center space-y-2">
            <div className="flex w-full items-center justify-between px-1">
              <button
                type="button"
                onClick={onResendCode}
                disabled={
                  resendCodeMutation.isPending ||
                  verifyCodeMutation.isPending ||
                  resendSeconds > 0
                }
                className="flex items-center gap-1 text-xs font-bold text-(--wwf-ocean-deep) transition-colors hover:text-(--wwf-orange) disabled:opacity-50"
              >
                {resendCodeMutation.isPending ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <RefreshCw size={12} />
                )}
                {resendSeconds > 0
                  ? `Resend OTP in ${resendSeconds}s`
                  : "Resend OTP"}
              </button>
            </div>

            <Controller
              control={formTwo.control}
              name="code"
              render={({ field }) => (
                <InputOTP
                  maxLength={6}
                  disabled={verifyCodeMutation.isPending}
                  {...field}
                >
                  <InputOTPGroup>
                    <InputOTPSlot
                      index={0}
                      className="h-12 w-10 rounded-l-xl border-2 border-slate-200 bg-white/80 text-lg font-black text-(--wwf-ocean-deep) sm:w-12"
                    />
                    <InputOTPSlot
                      index={1}
                      className="h-12 w-10 border-2 border-x-transparent border-y-slate-200 bg-white/80 text-lg font-black text-(--wwf-ocean-deep) sm:w-12"
                    />
                    <InputOTPSlot
                      index={2}
                      className="h-12 w-10 rounded-r-xl border-2 border-slate-200 bg-white/80 text-lg font-black text-(--wwf-ocean-deep) sm:w-12"
                    />
                  </InputOTPGroup>
                  <InputOTPSeparator className="text-slate-300" />
                  <InputOTPGroup>
                    <InputOTPSlot
                      index={3}
                      className="h-12 w-10 rounded-l-xl border-2 border-slate-200 bg-white/80 text-lg font-black text-(--wwf-ocean-deep) sm:w-12"
                    />
                    <InputOTPSlot
                      index={4}
                      className="h-12 w-10 border-2 border-x-transparent border-y-slate-200 bg-white/80 text-lg font-black text-(--wwf-ocean-deep) sm:w-12"
                    />
                    <InputOTPSlot
                      index={5}
                      className="h-12 w-10 rounded-r-xl border-2 border-slate-200 bg-white/80 text-lg font-black text-(--wwf-ocean-deep) sm:w-12"
                    />
                  </InputOTPGroup>
                </InputOTP>
              )}
            />

            {formTwo.formState.errors.code && (
              <p className="text-xs font-bold text-red-500">
                {formTwo.formState.errors.code.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={verifyCodeMutation.isPending || watchedCode?.length !== 6}
            className="btn-wwf-primary group relative mt-4 flex h-14 w-full items-center justify-center gap-2 overflow-hidden rounded-xl text-lg font-black shadow-xl hover:-translate-y-1 disabled:pointer-events-none disabled:opacity-50"
          >
            {verifyCodeMutation.isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Verify OTP"
            )}
            {!verifyCodeMutation.isPending && (
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setStep(1)}
            className="mt-2 flex w-full items-center justify-center text-xs font-bold text-(--wwf-ocean) transition-colors hover:text-(--wwf-ocean-deep)"
          >
            <ArrowLeft className="mr-1 h-3 w-3" /> Wrong number? Go back.
          </button>
        </form>
      )}

      {step === 3 && (
        <form
          onSubmit={formThree.handleSubmit(onSubmitStepThree)}
          className="animate-in space-y-5 duration-300 fade-in slide-in-from-right-4"
          noValidate
        >
          <div className="mb-6 text-center">
            <h3 className="text-xl font-black text-(--wwf-ocean-deep)">
              Secure Your Account
            </h3>
            <p className="mt-1 text-sm font-medium text-(--wwf-ocean)">
              Please enter a strong new password.
            </p>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="ml-1 text-xs font-black tracking-widest text-(--wwf-ocean-light) uppercase"
            >
              New Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              disabled={resetMutation.isPending}
              {...formThree.register("password")}
              className={`flex h-12 w-full rounded-xl border-2 bg-white/80 px-4 py-2 text-sm font-medium text-(--wwf-ocean-deep) transition-all focus:ring-4 focus:ring-(--wwf-sea-green)/20 focus:outline-none disabled:opacity-50 ${
                formThree.formState.errors.password
                  ? "border-red-200 focus:border-red-500"
                  : "border-slate-200 focus:border-(--wwf-sea-green)"
              }`}
            />
            {formThree.formState.errors.password && (
              <p className="ml-1 text-xs font-bold text-red-500">
                {formThree.formState.errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="password_confirmation"
              className="ml-1 text-xs font-black tracking-widest text-(--wwf-ocean-light) uppercase"
            >
              Confirm Password
            </label>
            <input
              id="password_confirmation"
              type="password"
              placeholder="Confirm password"
              disabled={resetMutation.isPending}
              {...formThree.register("password_confirmation")}
              className={`flex h-12 w-full rounded-xl border-2 bg-white/80 px-4 py-2 text-sm font-medium text-(--wwf-ocean-deep) transition-all focus:ring-4 focus:ring-(--wwf-sea-green)/20 focus:outline-none disabled:opacity-50 ${
                formThree.formState.errors.password_confirmation
                  ? "border-red-200 focus:border-red-500"
                  : "border-slate-200 focus:border-(--wwf-sea-green)"
              }`}
            />
            {formThree.formState.errors.password_confirmation && (
              <p className="ml-1 text-xs font-bold text-red-500">
                {formThree.formState.errors.password_confirmation.message}
              </p>
            )}
          </div>

          {formThree.formState.errors.root?.serverError && (
            <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              <FileExclamationPoint className="h-4 w-4" />
              {formThree.formState.errors.root.serverError.message}
            </div>
          )}

          <button
            type="submit"
            disabled={resetMutation.isPending}
            className="btn-wwf-primary group relative mt-4 flex h-14 w-full items-center justify-center gap-2 overflow-hidden rounded-xl text-lg font-black shadow-xl hover:-translate-y-1 disabled:pointer-events-none disabled:opacity-50"
          >
            {resetMutation.isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <LockKeyhole className="h-5 w-5" />
            )}
            Save New Password
          </button>
        </form>
      )}
    </div>
  )
}

export function PasswordRecoveryFlow() {
  return (
    <QueryProvider>
      <PasswordRecoveryContent />
    </QueryProvider>
  )
}
