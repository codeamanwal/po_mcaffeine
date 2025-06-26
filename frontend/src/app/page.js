"use client"

import { useState, useEffect } from "react"
// import { useAuth } from "../hooks/useAuth"
import LoginPage from "@/components/login"
import ForgotPasswordPage from "@/components/login"
import DashboardPage from "@/components/login"
import UserSettingsPage from "@/components/login"
import CreateUserPage from "@/components/login"
import UserManagementPage from "@/components/login"
import { set } from "date-fns"

export default function Page() {
  const [currentPage, setCurrentPage] = useState()
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isAuthenticated, setIsAuthenticated ] = useState(true)

  // if(currentPage === "dummy"){
  //   return (
  //     <div className="font-2xl text-center">
  //       Loading ....
  //     </div>
  //   )
  // }

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("mcaffeine-theme")
    if (savedTheme === "dark") {
      setIsDarkMode(true)
      document.documentElement.classList.add("dark")
    }
  }, [])

  // Handle theme toggle
  const handleToggleTheme = () => {
    const newTheme = !isDarkMode
    setIsDarkMode(newTheme)

    if (newTheme) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("mcaffeine-theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("mcaffeine-theme", "light")
    }
  }

  // Redirect to login if not authenticated and trying to access protected pages
  useEffect(() => {
    const loggedInUser = localStorage.getItem("mcaffeine_user");
    console.log("loggedInUser", loggedInUser)
    if(loggedInUser){
      setIsAuthenticated(true)
      setCurrentPage("dashboard")
    }else {
      if (!isAuthenticated && currentPage !== "login" && currentPage !== "forgot-password") {
        setCurrentPage("login")
      }
    }
  }, [isAuthenticated, currentPage])

  // Redirect to dashboard after successful login
  useEffect(() => {
    if (isAuthenticated && currentPage === "login") {
      setCurrentPage("dashboard")
    }
  }, [isAuthenticated, currentPage])

  const renderPage = () => {
    switch (currentPage) {
      case "login":
        return (
          <LoginPage
            onLogin={() => setCurrentPage("dashboard")}
            onForgotPassword={() => setCurrentPage("forgot-password")}
            isDarkMode={isDarkMode}
            onToggleTheme={handleToggleTheme}
          />
        )
      case "forgot-password":
        return (
          <ForgotPasswordPage
            onBack={() => setCurrentPage("login")}
            onResetSuccess={() => setCurrentPage("login")}
            isDarkMode={isDarkMode}
            onToggleTheme={handleToggleTheme}
          />
        )
      case "dashboard":
        return (
          <DashboardPage
            onNavigate={(page) => setCurrentPage(page)}
            isDarkMode={isDarkMode}
            onToggleTheme={handleToggleTheme}
          />
        )
      case "user-settings":
        return (
          <UserSettingsPage
            onNavigate={(page) => setCurrentPage(page)}
            isDarkMode={isDarkMode}
            onToggleTheme={handleToggleTheme}
          />
        )
      case "create-user":
        return (
          <CreateUserPage
            onNavigate={(page) => setCurrentPage(page)}
            isDarkMode={isDarkMode}
            onToggleTheme={handleToggleTheme}
          />
        )
      case "user-management":
        return (
          <UserManagementPage
            onNavigate={(page) => setCurrentPage(page)}
            isDarkMode={isDarkMode}
            onToggleTheme={handleToggleTheme}
          />
        )
      default:
        return isAuthenticated ? (
          <DashboardPage
            onNavigate={(page) => setCurrentPage(page)}
            isDarkMode={isDarkMode}
            onToggleTheme={handleToggleTheme}
          />
        ) : (
          <LoginPage
            onLogin={() => setCurrentPage("dashboard")}
            onForgotPassword={() => setCurrentPage("forgot-password")}
            isDarkMode={isDarkMode}
            onToggleTheme={handleToggleTheme}
          />
        )
    }
  }

  return renderPage()
}
