"use client"

import { useState, useEffect } from "react"

// Mock users data
const mockUsers = [
  {
    id: "1",
    name: "Super Admin",
    email: "superadmin@mcaffeine.com",
    role: "superadmin",
    createdAt: "2024-01-01",
    lastLogin: "2024-12-04",
  },
  {
    id: "2",
    name: "Admin User",
    email: "admin@mcaffeine.com",
    role: "admin",
    createdAt: "2024-01-15",
    lastLogin: "2024-12-03",
  },
  {
    id: "3",
    name: "Warehouse Manager",
    email: "warehouse@mcaffeine.com",
    role: "warehouse",
    createdAt: "2024-02-01",
    lastLogin: "2024-12-04",
  },
  {
    id: "4",
    name: "Logistics Coordinator",
    email: "logistics@mcaffeine.com",
    role: "logistics",
    createdAt: "2024-02-15",
    lastLogin: "2024-12-02",
  },
]

export function useAuth() {

  const [authState, setAuthState] = useState({
    user: null,
    isAuthenticated: false,
  })

  useEffect(() => {
    // Check for stored auth state
    const storedUser = localStorage.getItem("mcaffeine_user")
    if (storedUser) {
      setAuthState({
        user: JSON.parse(storedUser),
        isAuthenticated: true,
      })
    }
  }, [])

  const login = async (email, password) => {
    // Mock login logic
    const user = mockUsers.find((u) => u.email === email)
    if (user && password === "password123") {
      const updatedUser = { ...user, lastLogin: new Date().toISOString().split("T")[0] }
      setAuthState({ user: updatedUser, isAuthenticated: true })
      localStorage.setItem("mcaffeine_user", JSON.stringify(updatedUser))
      return { success: true }
    }
    return { success: false, error: "Invalid credentials" }
  }

  const logout = () => {
    setAuthState({ user: null, isAuthenticated: false })
    localStorage.removeItem("mcaffeine_user")
  }

  const getAllUsers = ()=> {
    return mockUsers
  }

  const createUser = async (userData) => {
    // Mock create user logic
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString().split("T")[0],
    }
    mockUsers.push(newUser)
    return { success: true }
  }

  const changePassword = async (
    currentPassword,
    newPassword,
  ) => {
    // Mock change password logic
    if (currentPassword === "password123") {
      return { success: true }
    }
    return { success: false, error: "Current password is incorrect" }
  }

  const resetPassword = async (
    email,
    otp,
    newPassword,
  ) => {
    // Mock reset password logic
    if (otp === "123456") {
      return { success: true }
    }
    return { success: false, error: "Invalid OTP" }
  }

  const sendOTP = async (email) => {
    // Mock send OTP logic
    const user = mockUsers.find((u) => u.email === email)
    if (user) {
      return { success: true }
    }
    return { success: false, error: "Email not found" }
  }

  return {
    ...authState,
    login,
    logout,
    getAllUsers,
    createUser,
    changePassword,
    resetPassword,
    sendOTP,
  }
}
