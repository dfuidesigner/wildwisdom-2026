import { useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/axios"
import { toast } from "sonner"
import { useAuth } from "@/hooks/useAuth"
import { QueryProvider } from "@/components/providers/QueryProvider"
import { encryptPayload } from "@/lib/encryption"
import {
  Mail,
  Building2,
  GraduationCap,
  // Phone,
  Lock,
  Loader2,
  ShieldCheck,
  Edit3,
  X,
  KeyRound,
  FileExclamationPoint,
} from "lucide-react"
import type { AxiosError } from "axios"

const profileSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .optional()
      .or(z.literal("")),
    password_confirmation: z.string().optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      if (data.password && data.password !== data.password_confirmation)
        return false
      return true
    },
    {
      message: "Passwords do not match",
      path: ["password_confirmation"],
    }
  )

type ProfileFormData = z.infer<typeof profileSchema>

function UserProfileContent() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [isEditing, setIsEditing] = useState(false)

  const passwordSectionRef = useRef<HTMLDivElement>(null)

  const baseUrl = import.meta.env.BASE_URL || "/"

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      password: "",
      password_confirmation: "",
    },
  })

  const updateMutation = useMutation({
    mutationFn: async (payload: Record<string, string>) => {
      const response = await api.put("/user/profile", payload)
      return response.data
    },
    onSuccess: (data) => {
      toast.success("Profile Updated", { description: data.message })
      queryClient.setQueryData(["authUser"], data.user)
      localStorage.setItem("ws_user", JSON.stringify(data.user))
      setIsEditing(false)
      reset({
        password: "",
        password_confirmation: "",
      })
    },
    onError: (error: AxiosError<{ message?: string; errors?: string }>) => {
      const res = error.response?.data
      let message = "Could not update profile."

      if (res) {
        if (res.errors) {
          message = (Object.values(res.errors)[0]?.[0] as string) || message
        } else if (res.message) {
          message = res.message
        }
      }

      toast.error("Update Failed", { description: message })
    },
  })

  const onSubmit = async (data: ProfileFormData) => {
    clearErrors("root")

    try {
      const payload: Record<string, string> = { ...data }

      if (payload.password) {
        const encryptedPassword = await encryptPayload(payload.password)
        payload.password = encryptedPassword
        payload.password_confirmation = encryptedPassword
      } else {
        delete payload.password
        delete payload.password_confirmation
      }

      updateMutation.mutate(payload)
    } catch (error) {
      console.error(error)
      setError("root.serverError", {
        type: "manual",
        message: "Failed to encrypt password. Please try again.",
      })
    }
  }

  if (!user) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-(--wwf-ocean-light)">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="font-bold tracking-widest uppercase">Loading Profile</p>
        </div>
      </div>
    )
  }

  const schoolName =
    user.school?.school_name ||
    (user.school as { school_name?: string })?.school_name ||
    "Independent"

  const handleEditToggle = () => {
    if (isEditing) {
      setIsEditing(false)
      reset({
        password: "",
        password_confirmation: "",
      })
      clearErrors()
    } else {
      setIsEditing(true)
      setTimeout(() => {
        passwordSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }, 100)
    }
  }

  return (
    <div className="relative mx-auto px-4 py-8 sm:px-6 lg:min-w-4xl">
      <img
        src={`${baseUrl}images/blue-fish.webp`}
        alt=""
        className="pointer-events-none absolute top-32 -right-6 z-0 w-32 opacity-15 md:w-48 lg:-right-12"
      />
      <img
        src={`${baseUrl}images/svgs/dark-cora-right.svg`}
        alt=""
        className="pointer-events-none absolute bottom-10 -left-8 z-0 w-24 opacity-15 md:w-32 lg:-left-12"
      />

      <div className="relative z-10 overflow-hidden rounded-[2.5rem] border border-(--wwf-border) bg-white shadow-xl">
        <div className="relative h-40 w-full overflow-hidden bg-(--wwf-ocean-deep) sm:h-48">
          <img
            src={`${baseUrl}images/section-bg-3.webp`}
            alt="Ocean Banner"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-linear-to-t from-(--wwf-ocean-deep)/90 via-(--wwf-ocean-deep)/20 to-transparent"></div>
          <img
            src={`${baseUrl}images/gold-fish.webp`}
            alt=""
            className="pointer-events-none absolute right-[15%] bottom-4 z-10 w-16 opacity-80 md:w-24 lg:right-[20%]"
          />
        </div>

        <div className="px-6 pb-12 sm:px-10">
          <div className="relative mb-12 flex flex-col items-center sm:flex-row sm:items-end sm:justify-between">
            <div className="-mt-8 flex flex-col items-center gap-5 sm:flex-row sm:items-end">
              <div className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-3xl border-[6px] border-white bg-(--wwf-ocean-deep) font-wwf text-6xl text-white shadow-md sm:h-32 sm:w-32">
                {user.name.charAt(0).toUpperCase()}
                <div className="absolute -right-2 -bottom-2 flex h-8 w-8 items-center justify-center rounded-full border-[3px] border-white bg-(--wwf-orange) text-white shadow-sm">
                  <ShieldCheck size={14} />
                </div>
              </div>

              <div className="pb-1 text-center sm:text-left">
                <h1 className="font-wwf text-4xl tracking-wide text-(--wwf-ocean-deep) uppercase md:text-5xl">
                  {user.name}
                </h1>
                <p className="mt-1 text-sm font-bold tracking-widest text-(--wwf-ocean) uppercase">
                  {user.role === "teacher" ? "Teacher" : "Student"}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-center sm:mt-0 sm:pb-2">
              <button
                onClick={handleEditToggle}
                className={`flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-bold transition-all active:scale-95 ${
                  isEditing
                    ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    : "bg-[#FFF0E5] text-(--wwf-coral) hover:bg-[#FFE4D1]"
                }`}
              >
                {isEditing ? (
                  <>
                    <X size={16} /> Cancel Editing
                  </>
                ) : (
                  <>
                    <Edit3 size={16} /> Edit Password
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div className="flex flex-col gap-6">
              <div className="border-b border-(--wwf-border) pb-3">
                <h3 className="flex items-center gap-2 text-xl font-bold text-(--wwf-ocean-deep)">
                  <ShieldCheck size={22} className="text-(--wwf-orange)" />
                  Information
                </h3>
              </div>

              <div className="overflow-hidden rounded-3xl border border-(--wwf-ocean-light)/15 bg-white shadow-sm">
                <div className="flex flex-col divide-y divide-(--wwf-ocean-light)/10">
                  <div className="flex items-center gap-5 p-5 transition-colors hover:bg-slate-50">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F0F4F8] text-(--wwf-ocean)">
                      <Mail size={18} />
                    </div>
                    <div className="flex flex-1 flex-col justify-center overflow-hidden">
                      <p className="mb-0.5 text-[10px] font-black tracking-widest text-(--wwf-ocean-light) uppercase">
                        Email Address
                      </p>
                      <p className="truncate text-base font-bold text-(--wwf-ocean-deep)">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-5 p-5 transition-colors hover:bg-slate-50">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F0F4F8] text-(--wwf-ocean)">
                      <Building2 size={18} />
                    </div>
                    <div className="flex flex-1 flex-col justify-center overflow-hidden">
                      <p className="mb-0.5 text-[10px] font-black tracking-widest text-(--wwf-ocean-light) uppercase">
                        Registered School
                      </p>
                      <p className="truncate text-base font-bold text-(--wwf-ocean-deep)">
                        {schoolName}
                      </p>
                    </div>
                  </div>

                  {user.role === "student" && (
                    <div className="flex items-center gap-5 p-5 transition-colors hover:bg-slate-50">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F0F4F8] text-(--wwf-ocean)">
                        <GraduationCap size={18} />
                      </div>
                      <div className="flex flex-1 flex-col justify-center">
                        <p className="mb-0.5 text-[10px] font-black tracking-widest text-(--wwf-ocean-light) uppercase">
                          Grade Level
                        </p>
                        <p className="text-base font-bold text-(--wwf-ocean-deep)">
                          {user.grade || "N/A"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div
              ref={passwordSectionRef}
              className="flex scroll-mt-24 flex-col gap-6"
            >
              <div className="border-b border-(--wwf-border) pb-3">
                <h3 className="flex items-center gap-2 text-xl font-bold text-(--wwf-ocean-deep)">
                  <KeyRound size={22} className="text-(--wwf-orange)" />
                  Password
                </h3>
              </div>

              {isEditing ? (
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="animate-in space-y-5 duration-300 fade-in slide-in-from-right-4"
                >
                  {errors.root?.serverError && (
                    <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                      <FileExclamationPoint className="h-5 w-5 shrink-0" />
                      {errors.root.serverError.message}
                    </div>
                  )}

                  <div className="rounded-3xl border border-(--wwf-border) bg-[#F8FAFC] p-6 shadow-sm">
                    <p className="mb-5 text-xs font-semibold text-(--wwf-ocean-deep)/70">
                      Enter a new strong password below to update your account
                      security.
                    </p>

                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <input
                          type="password"
                          placeholder="New Password"
                          disabled={updateMutation.isPending}
                          {...register("password")}
                          className={`flex h-12 w-full rounded-xl border-2 bg-white px-4 py-2 text-sm font-medium transition-all focus:outline-none disabled:opacity-50 ${
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

                      <div className="space-y-1.5">
                        <input
                          type="password"
                          placeholder="Confirm New Password"
                          disabled={updateMutation.isPending}
                          {...register("password_confirmation")}
                          className={`flex h-12 w-full rounded-xl border-2 bg-white px-4 py-2 text-sm font-medium transition-all focus:outline-none disabled:opacity-50 ${
                            errors.password_confirmation
                              ? "border-red-200 focus:border-red-500"
                              : "border-(--wwf-border) focus:border-(--wwf-sea-green)"
                          }`}
                        />
                        {errors.password_confirmation && (
                          <p className="ml-1 text-xs font-bold text-red-500">
                            {errors.password_confirmation.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={updateMutation.isPending}
                      className="btn-wwf-primary group flex h-12 w-full items-center justify-center gap-2 rounded-full px-8 text-base font-bold shadow-md hover:-translate-y-0.5 disabled:opacity-50 sm:w-auto"
                    >
                      {updateMutation.isPending ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" /> Saving...
                        </>
                      ) : (
                        "Update Password"
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="animate-in duration-300 fade-in slide-in-from-left-4">
                  <div className="flex items-center gap-5 rounded-3xl border border-(--wwf-ocean-deep)/20 bg-[#F8FAFC] p-4 sm:p-5">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-(--wwf-ocean-light) shadow-sm">
                      <Lock size={22} />
                    </div>
                    <div className="flex flex-col justify-center">
                      <p className="mb-1 text-[10px] font-black tracking-widest text-(--wwf-ocean-deep) uppercase">
                        Password
                      </p>
                      <p className="text-3xl leading-none tracking-[0.3em] text-(--wwf-ocean-deep)">
                        ••••••••
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function UserProfile() {
  return (
    <QueryProvider>
      <UserProfileContent />
    </QueryProvider>
  )
}
