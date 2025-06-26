"use client";

import { useState } from "react";
import { Package, Database } from "lucide-react";
import CreateOrderPage from "@/components/create-order";
import BulkOrderPage from "@/components/bulk-order";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { useThemeStore } from "@/store/theme-store"
import NavigationHeader from "@/components/header";

export default function CreateOrder( ){
    const router = useRouter();
    const {isDarkMode, setIsDarkMode} = useThemeStore()

    const [activeTab, setActiveTab] = useState("single-order")
    
    return (
        <div className={`min-h-screen ${isDarkMode ? "dark bg-gray-900" : "bg-gray-50"}`}>
        <NavigationHeader
            currentPage="create-order"
            onNavigate={(page) => {router.push(`/${page}`)}}
        />
        <Tabs value={activeTab} onValueChange={setActiveTab} className={`w-full ${isDarkMode ? "dark bg-gray-900" : "bg-gray-50"}`}>
            
            <TabsList className="grid w-full grid-cols-2 mb-8 h-12">
                <TabsTrigger value="single-order" className="flex items-center space-x-2 text-base">
                <Package className="h-5 w-5" />
                <span>Create Single Order</span>
                </TabsTrigger>
                <TabsTrigger value="bulk-order" className="flex items-center space-x-2 text-base">
                <Database className="h-5 w-5" />
                <span>Create Bulk Order</span>
                </TabsTrigger>
            </TabsList>

            <TabsContent value="single-order">
                <CreateOrderPage
                    isDarkMode={isDarkMode}
                    onToggleTheme={() => {setIsDarkMode(!isDarkMode)}}
                    onNavigate={(page) => {router.push(`/${page}`)}}
                />
            </TabsContent>
            <TabsContent value="bulk-order">
                <BulkOrderPage
                    isDarkMode={isDarkMode}
                    onToggleTheme={() => {setIsDarkMode(!isDarkMode)}}
                    onNavigate={(page) => {router.push(`/${page}`)}}
                />
            </TabsContent>
        </Tabs>
        </div>
    )
}