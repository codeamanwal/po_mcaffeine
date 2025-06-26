"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Database, Package } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import NavigationHeader from "@/components/header"
import { useThemeStore } from "@/store/theme-store"

// Sample data based on provided format
const poFormatData = [
  {
    entryDate: "2024-12-04",
    brand: "MCaffeine",
    channel: "Zepto",
    location: "Hyderabad",
    poDate: "3-Dec-2024",
    poNumber: "3100495853",
    srNo: 1,
    skuName: "mCaffeine Naked & Raw Coffee Espresso Body Wash",
    skuCode: "15MCaf177",
    channelSkuCode: "8906129573451",
    qty: 24,
    gmv: 11976,
    poValue: 8024,
    actualPoNumber: "",
    updatedQty: 24,
    updatedGmv: "11,976",
    updatedPoValue: "8,024",
    facility: "MUM_WAREHOUSE2",
    accountsWorking: 0,
    channelInwardingQuantity: "",
    workingDate: "1900/01/00",
    dispatchDate: "",
    currentAppointmentDate: "1900/01/00",
    statusPlanning: "Confirmed",
    statusWarehouse: "",
    statusLogistics: "0",
    orderNo: "2024120409",
    poNumberInward: "0",
    invoiceLink: "0",
    cnLink: "0",
    maxPoEntryCount: 1,
    poCheck: "0",
    temp: "Ignore",
    inwardPos: "",
    sku: "",
    uidDb: "",
    channelType: "Quick-commerce",
    actualWeight: 2.376,
    check: "",
  },
  {
    entryDate: "2024-12-04",
    brand: "MCaffeine",
    channel: "Zepto",
    location: "Hyderabad",
    poDate: "3-Dec-2024",
    poNumber: "3100495853",
    srNo: 2,
    skuName: "Green Tea Hydrogel Under Eye Patches",
    skuCode: "15MCaf225",
    channelSkuCode: "8906129573468",
    qty: 22,
    gmv: 10978,
    poValue: 7355,
    actualPoNumber: "",
    updatedQty: 22,
    updatedGmv: "10,978",
    updatedPoValue: "7,355",
    facility: "MUM_WAREHOUSE2",
    accountsWorking: 0,
    channelInwardingQuantity: "",
    workingDate: "1900/01/00",
    dispatchDate: "",
    currentAppointmentDate: "1900/01/00",
    statusPlanning: "Confirmed",
    statusWarehouse: "",
    statusLogistics: "0",
    orderNo: "2024120409",
    poNumberInward: "0",
    invoiceLink: "0",
    cnLink: "0",
    maxPoEntryCount: 1,
    poCheck: "0",
    temp: "Ignore",
    inwardPos: "",
    sku: "",
    uidDb: "",
    channelType: "Quick-commerce",
    actualWeight: 2.2,
    check: "",
  },
]

const shipmentStatusData = [
  {
    uid: 135290,
    entryDate: "2024/12/04",
    poDate: "2024/12/03",
    facility: "MUM_WAREHOUSE2",
    channel: "Zepto",
    location: "Hyderabad",
    poNumber: "3100495853",
    totalUnits: 839,
    brandName: "MCaffeine",
    remarksPlanning: "",
    specialRemarksCopt: "",
    newShipmentReference: "",
    statusActiveInactive: "Active",
    statusPlanning: "Confirmed",
    statusWarehouse: "",
    statusLogistics: "0",
    channelInwardingRemarks: "",
    dispatchRemarksLogistics: "",
    dispatchRemarksWarehouse: "",
    dispatchDateTentative: "",
    workingDatePlanner: "",
    rtsDate: "",
    dispatchDate: "1900/01/00",
    currentAppointmentDate: "",
    firstAppointmentDate: "",
    noOfBoxes: "",
    orderNo1: "2024120409",
    orderNo2: "",
    orderNo3: "",
    poNumberInward: "",
    pickListNo: "",
    workingTypeWarehouse: "",
    inventoryRemarksWarehouse: "",
    b2bWorkingTeamRemarks: "",
    actualWeight: "",
    volumetricWeight: "",
    channelType: "Quick-commerce",
    firstTransporter: "",
    firstDocketNo: "",
    secondTransporter: "",
    secondDocketNo: "",
    thirdTransporter: "",
    thirdDocketNo: "",
    appointmentLetter: "",
    labelsAmazonFlipkart: "",
    invoiceDate: "",
    invoiceLink: "",
    cnLink: "",
    eWayLink: "",
    invoiceValue: "",
    remarksAccountsTeam: "",
    invoiceChallanNumber: "",
    invoiceCheckedBy: "",
    tallyCustomerName: "",
    customerCode: "",
    extraCol2: "",
    extraCol3: "",
    extraCol4: "",
    poEntryCount: 232042,
    orderNoCombined: "",
    uid1: "",
    temp: "Missing",
    deliveryDate: "0",
    secondAppointmentDate: "0",
    thirdAppointmentDate: "",
    updatedPoQty: 1,
    updatedPoValue: "2024120409",
    poValue: "3100495853_|Active",
    gmv: "#REF!",
    rescheduleLag: "1900/01/00",
    finalRemarks: "1900/01/00",
    updatedGmv: "1900/01/00",
    physicalWeight: 839,
    rivigoTatIp: 232042,
    criticalDispatchDate: 232042,
    coptFinalRemark: 342657,
    updatedExpiry: "0/0/0",
    check1: "1900/01/00",
    check2: 342657,
    uid2: 152,
    check: 4,
  },
]


export default function DashboardPage({ onNavigate }) {

  const {isDarkMode, setIsDarkMode} = useThemeStore()

  const [activeTab, setActiveTab] = useState("po-format")

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark bg-gray-900" : "bg-gray-50"}`}>
      <NavigationHeader
        currentPage="dashboard"
        onNavigate={onNavigate}
      />

      {/* Main Content */}
      <main className="container mx-auto p-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Data Management Dashboard</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">Manage PO formats and shipment status data</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 h-12">
            <TabsTrigger value="po-format" className="flex items-center space-x-2 text-base">
              <Package className="h-5 w-5" />
              <span>PO Format Data</span>
            </TabsTrigger>
            <TabsTrigger value="shipment-status" className="flex items-center space-x-2 text-base">
              <Database className="h-5 w-5" />
              <span>Shipment Status</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="po-format">
            <Card className="shadow-lg">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center justify-between text-xl">
                  <span>PO Format Data</span>
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-sm px-3 py-1"
                  >
                    {poFormatData.length} Records
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="w-full">
                  <div className="min-w-[2000px]">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
                          <TableHead className="font-semibold">Entry Date</TableHead>
                          <TableHead className="font-semibold">Brand</TableHead>
                          <TableHead className="font-semibold">Channel</TableHead>
                          <TableHead className="font-semibold">Location</TableHead>
                          <TableHead className="font-semibold">PO Date</TableHead>
                          <TableHead className="font-semibold">PO Number</TableHead>
                          <TableHead className="font-semibold">Sr No</TableHead>
                          <TableHead className="font-semibold">SKU Name</TableHead>
                          <TableHead className="font-semibold">SKU Code</TableHead>
                          <TableHead className="font-semibold">Channel SKU Code</TableHead>
                          <TableHead className="font-semibold">Qty</TableHead>
                          <TableHead className="font-semibold">GMV</TableHead>
                          <TableHead className="font-semibold">PO Value</TableHead>
                          <TableHead className="font-semibold">Updated Qty</TableHead>
                          <TableHead className="font-semibold">Updated GMV</TableHead>
                          <TableHead className="font-semibold">Updated PO Value</TableHead>
                          <TableHead className="font-semibold">Facility</TableHead>
                          <TableHead className="font-semibold">Status (Planning)</TableHead>
                          <TableHead className="font-semibold">Channel Type</TableHead>
                          <TableHead className="font-semibold">Actual Weight</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {poFormatData.map((row, index) => (
                          <TableRow key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                            <TableCell>{row.entryDate}</TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900 dark:text-purple-200"
                              >
                                {row.brand}
                              </Badge>
                            </TableCell>
                            <TableCell>{row.channel}</TableCell>
                            <TableCell>{row.location}</TableCell>
                            <TableCell>{row.poDate}</TableCell>
                            <TableCell className="font-mono text-sm">{row.poNumber}</TableCell>
                            <TableCell>{row.srNo}</TableCell>
                            <TableCell className="max-w-xs truncate" title={row.skuName}>
                              {row.skuName}
                            </TableCell>
                            <TableCell className="font-mono text-sm">{row.skuCode}</TableCell>
                            <TableCell className="font-mono text-sm">{row.channelSkuCode}</TableCell>
                            <TableCell className="text-right">{row.qty}</TableCell>
                            <TableCell className="text-right">₹{row.gmv.toLocaleString()}</TableCell>
                            <TableCell className="text-right">₹{row.poValue.toLocaleString()}</TableCell>
                            <TableCell className="text-right">{row.updatedQty}</TableCell>
                            <TableCell className="text-right">₹{row.updatedGmv}</TableCell>
                            <TableCell className="text-right">₹{row.updatedPoValue}</TableCell>
                            <TableCell>{row.facility}</TableCell>
                            <TableCell>
                              <Badge
                                variant="default"
                                className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              >
                                {row.statusPlanning}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="secondary"
                                className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                              >
                                {row.channelType}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">{row.actualWeight} kg</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shipment-status">
            <Card className="shadow-lg">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center justify-between text-xl">
                  <span>Shipment Status Data</span>
                  <Badge
                    variant="secondary"
                    className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 text-sm px-3 py-1"
                  >
                    {shipmentStatusData.length} Records
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="w-full">
                  <div className="min-w-[2000px]">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
                          <TableHead className="font-semibold">UID</TableHead>
                          <TableHead className="font-semibold">Entry Date</TableHead>
                          <TableHead className="font-semibold">PO Date</TableHead>
                          <TableHead className="font-semibold">Facility</TableHead>
                          <TableHead className="font-semibold">Channel</TableHead>
                          <TableHead className="font-semibold">Location</TableHead>
                          <TableHead className="font-semibold">PO Number</TableHead>
                          <TableHead className="font-semibold">Total Units</TableHead>
                          <TableHead className="font-semibold">Brand Name</TableHead>
                          <TableHead className="font-semibold">Status (Active/Inactive)</TableHead>
                          <TableHead className="font-semibold">Status (Planning)</TableHead>
                          <TableHead className="font-semibold">Dispatch Date</TableHead>
                          <TableHead className="font-semibold">Order No 1</TableHead>
                          <TableHead className="font-semibold">Channel Type</TableHead>
                          <TableHead className="font-semibold">PO Entry Count</TableHead>
                          <TableHead className="font-semibold">Updated PO Qty</TableHead>
                          <TableHead className="font-semibold">Updated PO Value</TableHead>
                          <TableHead className="font-semibold">GMV</TableHead>
                          <TableHead className="font-semibold">Physical Weight</TableHead>
                          <TableHead className="font-semibold">Temp</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {shipmentStatusData.map((row, index) => (
                          <TableRow key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                            <TableCell className="font-mono">{row.uid}</TableCell>
                            <TableCell>{row.entryDate}</TableCell>
                            <TableCell>{row.poDate}</TableCell>
                            <TableCell>{row.facility}</TableCell>
                            <TableCell>{row.channel}</TableCell>
                            <TableCell>{row.location}</TableCell>
                            <TableCell className="font-mono text-sm">{row.poNumber}</TableCell>
                            <TableCell className="text-right">{row.totalUnits.toLocaleString()}</TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className="bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900 dark:text-purple-200"
                              >
                                {row.brandName}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="default"
                                className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              >
                                {row.statusActiveInactive}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="default"
                                className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                              >
                                {row.statusPlanning}
                              </Badge>
                            </TableCell>
                            <TableCell>{row.dispatchDate}</TableCell>
                            <TableCell className="font-mono text-sm">{row.orderNo1}</TableCell>
                            <TableCell>
                              <Badge
                                variant="secondary"
                                className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                              >
                                {row.channelType}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">{row.poEntryCount.toLocaleString()}</TableCell>
                            <TableCell className="text-right">{row.updatedPoQty}</TableCell>
                            <TableCell className="font-mono text-sm">{row.updatedPoValue}</TableCell>
                            <TableCell className="font-mono text-sm">{row.gmv}</TableCell>
                            <TableCell className="text-right">{row.physicalWeight}</TableCell>
                            <TableCell>
                              <Badge
                                variant="destructive"
                                className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                              >
                                {row.temp}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
