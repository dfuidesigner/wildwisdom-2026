import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import api from "@/lib/axios"
import { Loader2, Info, FileExclamationPoint } from "lucide-react"
import { QueryProvider } from "@/components/providers/QueryProvider"
import type { ErrorResponse, RegisterSchoolResponse } from "@/types/school"
import type { AxiosError } from "axios"
import type { ValidationErrorResponse } from "@/types/api"
import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha,
} from "react-google-recaptcha-v3"

const BOARD_OPTIONS = [
  "CBSE (Central Board of Secondary Education)",
  "ICSE (Council for the Indian School Certificate Examinations)",
  "IB (International Baccalaureate)",
  "State Board",
  "Other",
]

const INDIA_STATES = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
]
// Updated safeString to include a max length limit (defaults to 255 for standard database columns)
const safeString = (msg: string, maxLen: number = 255) =>
  z
    .string()
    .min(1, msg)
    .max(maxLen, "Input is too long to be processed")
    .regex(/^[^<>]*$/, "Invalid characters detected (< and > are not allowed)")

const schoolSchema = z
  .object({
    school_name: safeString("Please Enter School Name !"),
    address: safeString("Please Enter Address !", 500),
    school_city: safeString("Please Enter City !"),
    school_state: z.enum(INDIA_STATES as [string, ...string[]], {
      errorMap: () => ({ message: "Please Enter State !" }),
    }),

    pincode: z
      .string()
      .length(6, "Pincode must be exactly 6 digits")
      .regex(/^\d+$/, "Pincode must contain only numbers"),

    board: z.enum(
      [
        "CBSE (Central Board of Secondary Education)",
        "ICSE (Council for the Indian School Certificate Examinations)",
        "IB (International Baccalaureate)",
        "State Board",
        "Other",
      ],
      { errorMap: () => ({ message: "Please select a valid board" }) }
    ),

    affiliation_number: z
      .string()
      .regex(/^[a-zA-Z0-9]+$/, "Alphanumeric characters only")
      .min(
        5,
        "Make sure the affiliation number is between 5-15 characters long."
      )
      .max(
        15,
        "Make sure the affiliation number is between 5-15 characters long."
      ),

    confirm_affiliation_number: z
      .string()
      .min(1, "Please confirm affiliation number")
      .max(15, "Confirmation number is too long"),

    principal_name: safeString("Please Enter Principal Name !"),

    principal_email: z
      .string()
      .email("Please Enter Principal Email Id !")
      .max(255, "Email is too long"),
    school_email: z
      .string()
      .email("Please Enter Your E-mail !")
      .max(255, "Email is too long"),

    school_mobile: z
      .string()
      .regex(/^[1-9][0-9]{9}$/, "Please enter a valid mobile number."),

    teacher_coordinator: safeString("Please Enter Teacher First name !"),
    teacher_name: safeString("Please Enter Teacher Last Name !"),

    teacher_email: z
      .string()
      .email("Please Enter Your E-mail !")
      .max(255, "Email is too long"),

    teacher_mobile: z
      .string()
      .regex(/^[1-9][0-9]{9}$/, "Please enter a valid mobile number."),

    how_many_student: z.coerce
      .number()
      .min(50, "A minimum of 50 students is required per school.")
      .max(9999, "Please enter a valid 4-digit number."),
  })
  .refine(
    (data) => data.affiliation_number === data.confirm_affiliation_number,
    {
      message: "Affiliation numbers do not match.",
      path: ["confirm_affiliation_number"],
    }
  )
type SchoolFormData = z.infer<typeof schoolSchema>
type RegisterSchoolPayload = Omit<
  SchoolFormData,
  "confirm_affiliation_number"
> & {
  "g-recaptcha-response": string
}

function RegistrationFormComponent() {
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<SchoolFormData>({
    resolver: zodResolver(schoolSchema),
  })

  const { executeRecaptcha } = useGoogleReCaptcha()
  const PLATFORM_SLUG = import.meta.env.PUBLIC_PLATFORM_SLUG || "wildwisdom"

  const registerMutation = useMutation<
    RegisterSchoolResponse,
    AxiosError<ValidationErrorResponse | ErrorResponse>,
    RegisterSchoolPayload
  >({
    mutationFn: async (data) => {
      const response = await api.post(`/register-school/${PLATFORM_SLUG}`, data)
      return response.data
    },
    onSuccess: () => {
      toast.success("Registration Successful!")
      const baseUrl = import.meta.env.BASE_URL || "/"
      window.location.href = `${baseUrl}thank-you`
    },
    onError: (error) => {
      const res = error.response?.data
      let message = "Registration failed. Please try again."

      if (res) {
        if ("errors" in res) {
          message = Object.values(res.errors)[0]?.[0] || message
        } else if ("message" in res) {
          message = res.message
        }
      }

      const lowerMsg = message.toLowerCase()
      if (
        lowerMsg.includes("captcha") ||
        lowerMsg.includes("recaptcha") ||
        lowerMsg.includes("bot")
      ) {
        setError("root.captcha", {
          type: "server",
          message: "Security Validation Failed. Please try again.",
        })
      } else {
        toast.error("Registration Failed", { description: message })
      }
    },
  })

  const onSubmit = async (data: SchoolFormData) => {
    clearErrors("root")

    if (!executeRecaptcha) {
      console.warn("reCAPTCHA has not loaded yet.")
      setError("root.captcha", {
        type: "manual",
        message:
          "Security check is still loading. Please wait a moment and try again.",
      })
      return
    }

    try {
      const token = await executeRecaptcha("school_register")
      if (!token) {
        throw new Error("reCAPTCHA token generation returned empty.")
      }

      const { confirm_affiliation_number, ...submitData } = data

      const payload: RegisterSchoolPayload = {
        ...submitData,
        "g-recaptcha-response": token,
      }

      registerMutation.mutate(payload)
    } catch (e) {
      console.error("reCAPTCHA Error:", e)
      setError("root.captcha", {
        type: "manual",
        message:
          "Unable to verify security check. Please disable strict ad-blockers and try again.",
      })
    }
  }

  const renderInput = (
    name: keyof SchoolFormData,
    placeholder: string,
    type = "text",
    maxLength?: number
  ) => (
    <div className="w-full space-y-1">
      <input
        type={type}
        placeholder={placeholder}
        maxLength={maxLength}
        {...register(name)}
        disabled={registerMutation.isPending}
        onInput={(e) => {
          if (
            name === "affiliation_number" ||
            name === "confirm_affiliation_number"
          ) {
            e.currentTarget.value = e.currentTarget.value
              .replace(/[^a-zA-Z0-9]/g, "")
              .slice(0, 15)
          }
          if (type === "tel") {
            e.currentTarget.value = e.currentTarget.value
              .replace(/[^0-9]/g, "")
              .slice(0, 10)
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
    name: keyof SchoolFormData,
    placeholder: string,
    options: string[]
  ) => (
    <div className="w-full space-y-1">
      <select
        {...register(name)}
        disabled={registerMutation.isPending}
        defaultValue=""
        className={`flex h-14 w-full rounded-2xl border-2 bg-slate-50/50 px-4 py-2 text-base font-medium text-(--wwf-ocean-deep) transition-all focus:bg-white focus:ring-4 focus:ring-(--wwf-ocean)/20 focus:outline-none ${
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
            {opt}
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

  // --- FORM UI ---
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
      {/* 1. School Information */}
      <fieldset>
        <legend className="mb-2 text-2xl font-bold text-(--wwf-ocean-deep)">
          School Information
        </legend>
        <span className="mb-5 flex items-center rounded-lg bg-yellow-100/50 px-3 py-2 text-sm font-medium text-yellow-800">
          <Info className="mr-2 h-4 w-4" />
          <mark className="bg-transparent">
            Only schools to register. No individual student registrations
            accepted.
          </mark>
        </span>

        {/* Row 1 */}
        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {renderInput("school_name", "School Name*")}
          {renderInput("address", "Address*")}
        </div>

        {/* Row 2 */}
        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {renderInput("school_city", "City*")}
          {renderSelect(
            "school_state",
            "Select State/ Union Territory*",
            INDIA_STATES
          )}
        </div>

        {/* Row 3 - Separated Pincode & Board to make room for the Confirm field */}
        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {renderInput("pincode", "Pincode*", "number")}
          {renderSelect("board", "Select Board*", BOARD_OPTIONS)}
        </div>

        {/* Row 4 - Affiliation Numbers */}
        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {renderInput("affiliation_number", "Affiliation Number*", "text", 15)}
          {renderInput(
            "confirm_affiliation_number",
            "Confirm Affiliation Number*",
            "text",
            15
          )}
        </div>

        {/* Row 5 */}
        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {renderInput("principal_name", "Principal Name*")}
          {renderInput("principal_email", "Principal Email*", "email")}
        </div>

        {/* Row 6 */}
        <div className="mb-4">
          {renderInput("school_email", "School Email*", "email")}
        </div>

        {/* Row 7 */}
        <div className="mb-4">
          {renderInput("school_mobile", "Contact No.*", "tel", 10)}
        </div>
      </fieldset>

      {/* 2. Teacher Information */}
      <fieldset className="pt-4">
        <legend className="text-2xl font-bold text-(--wwf-ocean-deep)">
          Teacher Information
        </legend>
        <p className="mb-5 text-sm text-slate-700">
          All communication regarding the challenge will be sent on their email
          address
        </p>

        {/* Row 1 */}
        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {renderInput("teacher_coordinator", "First name*")}
          {renderInput("teacher_name", "Last name*")}
        </div>

        {/* Row 2 */}
        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {renderInput("teacher_email", "Email*", "email")}
          {renderInput("teacher_mobile", "Mobile Number*", "tel", 10)}
        </div>

        {/* Row 3 */}
        <div className="mb-4 space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            All students from Grades 6 to 9 are eligible to participate{" "}
            <span className="text-xs text-slate-500">
              (minimum 50 students per school)
            </span>
          </label>
          {renderInput(
            "how_many_student",
            "Estimated number of participating students*",
            "number",
            4
          )}
        </div>
      </fieldset>

      {errors.root?.captcha && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          <FileExclamationPoint className="h-5 w-5 shrink-0" />
          {errors.root.captcha.message}
        </div>
      )}

      <div className="pt-4">
        <button
          type="submit"
          disabled={registerMutation.isPending}
          className="btn btn-success relative flex h-14 w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-green-600 text-lg font-black text-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl disabled:pointer-events-none disabled:opacity-50"
        >
          {registerMutation.isPending ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Registering...
            </>
          ) : (
            <>Submit Now</>
          )}
        </button>
      </div>
    </form>
  )
}

export function SchoolRegistrationForm() {
  return (
    <QueryProvider>
      <GoogleReCaptchaProvider
        reCaptchaKey={import.meta.env.PUBLIC_RECAPTCHAV3_SITEKEY}
      >
        <RegistrationFormComponent />
      </GoogleReCaptchaProvider>
    </QueryProvider>
  )
}
