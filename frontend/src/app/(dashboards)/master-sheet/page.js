"use client";

import { MasterSheetsDashboard } from "@/components/master/master-sheet-dasboard";
import { useRouter } from "next/navigation";
import { useThemeStore } from "@/store/theme-store"

export default function UserManagement( ){
    const router = useRouter();
    const {isDarkMode, setIsDarkMode} = useThemeStore()
    
    return (
        <MasterSheetsDashboard
            isDarkMode={isDarkMode}
            onToggleTheme={() => {setIsDarkMode(!isDarkMode)}}
            onNavigate={(page) => {router.push(`/${page}`)}}
        />
    )
}