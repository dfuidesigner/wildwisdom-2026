// import axios from "axios"

// export const api = axios.create({
//   baseURL: import.meta.env.PUBLIC_API_URL || "http://localhost:8000/api/v2",
//   headers: {
//     Accept: "application/json",
//     "Content-Type": "application/json",
//   },
// })

// // --- REQUEST INTERCEPTOR ---
// // Automatically attach the token to every single request
// api.interceptors.request.use((config) => {
//   if (typeof window !== "undefined") {
//     const token = localStorage.getItem("ws_token")
//     if (token) {
//       // Use .set() instead of direct assignment
//       config.headers.set("Authorization", `Bearer ${token}`)
//     }
//   }
//   return config
// })

// // --- RESPONSE INTERCEPTOR ---
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       if (typeof window !== "undefined") {
//         localStorage.removeItem("ws_token")

//         // FIX: Construct the correct login path using BASE_URL
//         // This turns "/login" into "/vishal/wildswisdom/login"
//         const loginPath = `${import.meta.env.BASE_URL}login`

//         // Don't cause an infinite loop if they are already on the login page
//         // window.location.pathname includes the subfolder, so we check against loginPath
//         if (window.location.pathname !== loginPath) {
//           window.location.assign(loginPath)
//         }
//       }
//     }
//     return Promise.reject(error)
//   }
// )

// export default api

import axios from "axios"

export const api = axios.create({
  // baseURL: "http://localhost:8000/api/v2",
  baseURL: import.meta.env.PUBLIC_API_URL || "",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("ws_token")
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`)
      config.headers["X-Authorization"] = `Bearer ${token}`
    }
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        const hadToken = !!localStorage.getItem("ws_token")
        localStorage.removeItem("ws_token")
        localStorage.removeItem("ws_user")

        const loginPath = `${import.meta.env.BASE_URL}login`

        // Only hard-redirect if this was an authenticated session that
        // got invalidated. A 401 straight from /login (wrong password)
        // is just a validation error — let the calling component handle it.
        if (hadToken && window.location.pathname !== loginPath) {
          window.location.assign(loginPath)
        }
      }
    }
    return Promise.reject(error)
  }
)

export default api
