"use client";

import UserManagementPage from "@/components/user-management";
import { useRouter } from "next/navigation";
import { useThemeStore } from "@/store/theme-store"

export default function UserManagement( ){
    const router = useRouter();
    const {isDarkMode, setIsDarkMode} = useThemeStore()
    
    return (
        <UserManagementPage
            isDarkMode={isDarkMode}
            onToggleTheme={() => {setIsDarkMode(!isDarkMode)}}
            onNavigate={(page) => {router.push(`/${page}`)}}
        />
    )
}