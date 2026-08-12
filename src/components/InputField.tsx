import type {
  FieldErrors,
  UseFormRegister,
  Path,
  FieldValues,
} from "react-hook-form"

interface InputFieldProps<T extends FieldValues> {
  label: string
  name: Path<T>
  type?: string
  placeholder?: string
  register: UseFormRegister<T>
  errors: FieldErrors<T>
  disabled?: boolean
}

export function InputField<T extends FieldValues>({
  label,
  name,
  type = "text",
  placeholder,
  register,
  errors,
  disabled,
}: InputFieldProps<T>) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="text-sm font-semibold text-slate-900">
        {label}
      </label>

      <input
        id={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        {...register(name)}
        className={`flex h-10 w-full rounded-md border px-3 py-2 text-sm ${
          errors[name] ? "border-red-500" : "border-slate-200"
        }`}
      />

      {errors[name] && (
        <p className="text-xs text-red-500">
          {errors[name]?.message as string}
        </p>
      )}
    </div>
  )
}

