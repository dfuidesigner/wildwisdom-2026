import { useState } from "react"
import { LogOut, Loader2 } from "lucide-react"
import api from "@/lib/axios"

export function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    let role = "student"
    try {
      const userStr = localStorage.getItem("ws_user")
      if (userStr) {
        const parsedUser = JSON.parse(userStr)
        role = parsedUser.role || "student"
      }
    } catch (e) {
      console.error("Could not parse user role from local storage", e)
    }

    try {
      setIsLoading(true)
      await api.post("/logout")
    } catch (error) {
      console.error(
        "Server logout failed, but clearing local session anyway.",
        error
      )
    } finally {
      localStorage.removeItem("ws_token")
      localStorage.removeItem("ws_user")

      let redirectPath = "login"
      if (role === "teacher") {
        redirectPath = "teacher/login"
      } else if (role === "state_admin") {
        redirectPath = "state-admin/login"
      } else if (role === "admin") {
        redirectPath = "login"
      }
      const base = import.meta.env.BASE_URL || "/"
      window.location.assign(`${base}${redirectPath}`)
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="flex items-center gap-2 rounded-full bg-(--wwf-coral) px-6 py-2.5 font-wwf text-xl tracking-wide text-white shadow-sm transition-all hover:bg-(--wwf-orange) hover:shadow-(--wwf-coral)/20 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {isLoading ? (
        <Loader2 size={20} className="animate-spin" />
      ) : (
        <LogOut size={20} strokeWidth={2.5} />
      )}
      <span className="-mt-1 hidden md:block">Sign Out</span>
    </button>
  )
}
