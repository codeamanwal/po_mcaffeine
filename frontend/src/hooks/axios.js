import axios from "axios"
import { useUserStore } from "@/store/user-store"

// Create an Axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
})

// Add a request interceptor to include the Bearer token
api.interceptors.request.use(
  (config) => {
    // Get the token from the user store
    const { token } = useUserStore.getState()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

export default api