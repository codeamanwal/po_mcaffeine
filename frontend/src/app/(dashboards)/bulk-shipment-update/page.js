"use client";

import BulkShipmentUpdate from "@/components/bulk-shipment-update";

import { useRouter } from "next/navigation";
import { useThemeStore } from "@/store/theme-store"

export default function BulkShipmentUpdatePage( ){
    const router = useRouter();
    const {isDarkMode, setIsDarkMode} = useThemeStore()
    
    return (
        <BulkShipmentUpdate
            isDarkMode={isDarkMode}
            onToggleTheme={() => {setIsDarkMode(!isDarkMode)}}
            onNavigate={(page) => {router.push(`/${page}`)}}
        />
    )
}