"use client";

import UserSettingsPage from "@/components/user-settings";
import { useRouter } from "next/navigation";
import { useThemeStore } from "@/store/theme-store"

export default function UserSettings( ){
    const router = useRouter();
    const {isDarkMode, setIsDarkMode} = useThemeStore()
    
    return (
        <UserSettingsPage
            isDarkMode={isDarkMode}
            onToggleTheme={() => {setIsDarkMode(!isDarkMode)}}
            onNavigate={(page) => {router.push(`/${page}`)}}
        />
    )
}