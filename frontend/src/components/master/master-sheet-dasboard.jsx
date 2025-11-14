"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MasterSheetUpload } from "./master-sheet-upload"
import { MASTER_SHEETS_CONFIG } from "@/lib/master-sheets-config"
import NavigationHeader from "../header"

export function MasterSheetsDashboard({ onNavigate }) {
  const masterSheetTypes = [
    "facility",
    "courierPartner",
    "status",
    "courierRates",
    "channel",
    "appointmentRemarks",
    "sku",
  ]

  return (
    <div className="min-h-screen dark:bg-gray-900  bg-gray-50">
          <NavigationHeader currentPage="master-sheet" onNavigate={onNavigate} />
          
          <main className="w-full space-y-6 p-6">
            <div>
              <h1 className="text-3xl font-bold">Master Data Management</h1>
              <p className="text-gray-600 mt-2">Upload and manage all master sheets</p>
            </div>

            <Tabs defaultValue="facility" className="w-full">
              <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
                {masterSheetTypes.map((sheetType) => (
                  <TabsTrigger key={sheetType} value={sheetType} className="text-xs">
                    {MASTER_SHEETS_CONFIG[sheetType].name.split(" ").slice(0,2)}
                  </TabsTrigger>
                ))}
              </TabsList>

              {masterSheetTypes.map((sheetType) => (
                <TabsContent key={sheetType} value={sheetType} className="space-y-4">
                  <MasterSheetUpload sheetType={sheetType} />
                </TabsContent>
              ))}
            </Tabs>
          </main>
    </div>
  )
}
