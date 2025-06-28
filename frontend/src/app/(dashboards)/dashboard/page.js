"use client";

import DashboardPage from "@/components/dashboard";
import { useRouter } from "next/navigation";
import { useThemeStore } from "@/store/theme-store"
export default function Login( ){
    const router = useRouter();
    const {isDarkMode, setIsDarkMode} = useThemeStore()
    
    return (
        <DashboardPage
            isDarkMode={isDarkMode}
            onToggleTheme={() => {setIsDarkMode(!isDarkMode)}}
            onNavigate={(page) => {router.push(`/${page}`)}}
        />
    )
}