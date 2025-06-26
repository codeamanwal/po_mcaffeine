"use client";

import LoginPage from "@/components/login";
import { useRouter } from "next/navigation";
import { useThemeStore } from "@/store/theme-store"
export default function Login( ){
    const router = useRouter();
    const {isDarkMode, setIsDarkMode} = useThemeStore()
    
    return (
        <LoginPage 
            onLogin={() => {router.push("/dashboard")}}
            onForgotPassword={() => {router.push("/forgot-password")}}
            isDarkMode={isDarkMode}
            onToggleTheme={() => {setIsDarkMode(!isDarkMode)}}
        />
    )
}