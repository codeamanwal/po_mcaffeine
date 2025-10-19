"use client"

import { useUserStore } from "@/store/user-store"
import { useThemeStore } from "@/store/theme-store"
import NavigationHeader from "@/components/header"
import { useRouter } from "next/navigation";
export default function Page() {

  const router = useRouter();

  const { isLoggedIn } = useUserStore()
  const {isDarkMode, setIsDarkMode} = useThemeStore()

  const handleGo = () => {
    if (isLoggedIn) {
      window.location.href = "/dashboard"
    } else {
      window.location.href = "/login"
    }
  }

  return (
    <div className={`min-h-screen`}>
          <NavigationHeader
            currentPage="/"
            onNavigate={(page) => {router.push(`/${page}`)}}
          />
    
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
      
      <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Welcome to PO CMS</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
        Manage your purchase orders and shipments efficiently.
      </p>
      <button
        onClick={handleGo}
        className="px-6 py-3 rounded bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg shadow hover:from-blue-700 hover:to-purple-700 transition"
      >
        {isLoggedIn ? "Go to Dashboard" : "Go to Login"}
      </button>
    </div>
    </div>
  )
}
