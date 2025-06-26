"use client";

import CreateUserPage from "@/components/create-user";

import { useRouter } from "next/navigation";
import { useThemeStore } from "@/store/theme-store"

export default function CreateUser( ){
    const router = useRouter();
    const {isDarkMode, setIsDarkMode} = useThemeStore()
    
    return (
        <CreateUserPage
            isDarkMode={isDarkMode}
            onToggleTheme={() => {setIsDarkMode(!isDarkMode)}}
            onNavigate={(page) => {router.push(`/${page}`)}}
        />
    )
}