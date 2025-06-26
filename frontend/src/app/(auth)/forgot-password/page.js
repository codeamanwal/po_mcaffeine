"use client";

import ForgotPasswordPage from "@/components/forgot-password";
import { useRouter } from "next/navigation";
import { useThemeStore } from "@/store/theme-store"

export default function ForgotPassword( ){
    const router = useRouter();
    const {isDarkMode, setIsDarkMode} = useThemeStore()
    
    return (
        <ForgotPasswordPage 
            onBack={() => router.push("/login")}
            onResetSuccess={() => router.push("/login")}
            isDarkMode={isDarkMode}
            onToggleTheme={() => {setIsDarkMode(!isDarkMode)}}
        />
    )
}