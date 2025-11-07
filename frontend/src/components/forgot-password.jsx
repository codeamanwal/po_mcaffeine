"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Mail, Smartphone, AlertCircle, CheckCircle, Moon, Sun } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useThemeStore } from "@/store/theme-store"


export default function ForgotPasswordPage({
  onBack,
  onResetSuccess,
  isDarkMode,
  onToggleTheme,
}) {
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [step, setStep] = useState("email")
  const [method, setMethod] = useState("email")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const { sendOTP, resetPassword } = useAuth()

  const {theme, setTheme} = useThemeStore()

  const handleSendOTP = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    const result = await sendOTP(email)

    if (result.success) {
      setSuccess("OTP sent successfully! Check your email/phone.")
      setStep("otp")
    } else {
      setError(result.error || "Failed to send OTP")
    }

    setIsLoading(false)
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    if (otp === "123456") {
      setStep("reset")
      setError("")
      setSuccess("OTP verified successfully!")
    } else {
      setError("Invalid OTP. Please try again.")
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long")
      setIsLoading(false)
      return
    }

    const result = await resetPassword(email, otp, newPassword)

    if (result.success) {
      setSuccess("Password reset successfully!")
      setTimeout(() => {
        onResetSuccess()
      }, 2000)
    } else {
      setError(result.error || "Failed to reset password")
    }

    setIsLoading(false)
  }

  return (
    <div className={`min-h-screen`}>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Theme Toggle */}
        <div className="absolute top-4 right-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if(theme === 'dark') setTheme('light')
              else setTheme('dark')
            }}
            className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>

        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 pb-6">
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onBack}
                  className="p-2 h-auto hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                  <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
                  <CardDescription className="mt-1">
                    {step === "email" && "Choose how you'd like to reset your password"}
                    {step === "otp" && "Enter the verification code we sent you"}
                    {step === "reset" && "Create your new password"}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-8">
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="mb-6 border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              {step === "email" && (
                <Tabs value={method} onValueChange={(value) => setMethod(value)}>
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="email" className="flex items-center space-x-2">
                      <Mail className="h-4 w-4" />
                      <span>Email</span>
                    </TabsTrigger>
                    <TabsTrigger value="otp" className="flex items-center space-x-2">
                      <Smartphone className="h-4 w-4" />
                      <span>OTP</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="email">
                    <form onSubmit={handleSendOTP} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="h-11"
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        disabled={isLoading}
                      >
                        {isLoading ? "Sending..." : "Send Reset Link"}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="otp">
                    <form onSubmit={handleSendOTP} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email-otp">Email Address</Label>
                        <Input
                          id="email-otp"
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="h-11"
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        disabled={isLoading}
                      >
                        {isLoading ? "Sending..." : "Send OTP"}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              )}

              {step === "otp" && (
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="otp">Verification Code</Label>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="Enter 6-digit code"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                      required
                      className="h-11 text-center text-lg tracking-widest"
                    />
                  </div>
                  <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <p className="text-xs text-blue-800 dark:text-blue-200">
                      <strong>Demo OTP:</strong> 123456
                    </p>
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    Verify Code
                  </Button>
                </form>
              )}

              {step === "reset" && (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Resetting..." : "Reset Password"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
