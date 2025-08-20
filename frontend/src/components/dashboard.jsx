"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Database, Edit, Edit2, Edit3, Eye, Package, Trash, MoreHorizontal } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import NavigationHeader from "@/components/header"
import { useThemeStore } from "@/store/theme-store"
import { getPoFormatOrderList,getShipmentStatusList,updateSinglePoOrder } from "@/lib/order"
import { poFormatDataType, shipmentStatusDataType } from "@/constants/data_type"
import EditOrderModal from "./edit-order-modal"
import EditShipmentModal from "./edit-shipment-modal"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"
import BulkUpdateShipmentModal from "./bulk-shipment-edit-modal"
import SkuLevelEditModal from "./sku-level-edit-modal"
import { Input } from "./ui/input"
import { Select } from "./ui/select"
import ShipmentViewModal from "./view-shipment-modal"
import { DropdownMenu, DropdownMenuTrigger,DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "./ui/dropdown-menu"

// Sample data based on provided format
const poData = [
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

const shipmentData = [
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

  const router = useRouter()

  const {isDarkMode, setIsDarkMode} = useThemeStore()

  const [activeTab, setActiveTab] = useState("po-format")

  const [poFormatData, setPoFormatData] = useState([])
  const [shipmentStatusData, setShipmentStatusData] = useState([])

  const [isEditModal, setEditModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState({})

  const [selectedShipment, setSelectedShipment] = useState({})
  // shipment actions
  const [isShipmentEditModal, setShipmentEditModal] = useState(false)
  const [isShipmentBulkEditModal, setShipmentBulkEditModal] = useState(false)
  const [isShipmentViewModal, setShipmentViewModal] = useState(false)
  const [isSkuEditModal, setSkuEditModal] = useState(false);




  async function getPoFormateData() {
    try {
      const res = await getPoFormatOrderList();
      console.log(res.data)
      setPoFormatData(res.data.orders)
    } catch (error) {
      console.log(error);
      setPoFormatData(poData)
    }
  }

  async function getShipmentData() {
    try {
      const res = await getShipmentStatusList();
      console.log("Shipment Data: ", res.data.shipments);
      setShipmentStatusData(res.data.shipments)
    } catch (error) {
      console.log(error);
    }
  }

  function handleEditOrder(data){
    console.log(data)
    setSelectedOrder(data)
    setEditModal(true)
  }

  function handleDeleteOrder(data) {
    console.log("Delete order:", data);
    // Implement delete functionality here
  }

  function handleViewShipment(data) {
    console.log(data);
    setSelectedShipment(data)
    setShipmentViewModal(true);
  }

  function handleEditSkuShipment(data) {
    console.log(data);
    setSelectedShipment(data)
    setSkuEditModal(true);
  }

  function handleEditShipment(data) {
    console.log(data)
    setSelectedShipment(data)
    setShipmentEditModal(true)
  }


  function handleDeleteShipment(data) {
    console.log("Delete Shipment:", data);
    // Implement delete functionality here
  }

  async function onUpdateSingleOrder(data) {
    try {
      let updatedData = localStorage.getItem("orderData");
      // console.log("Updated Data: ", updatedData);
      updatedData = JSON.parse(updatedData);
      console.log("Parsed Data: ", updatedData);
      const res = await updateSinglePoOrder(updatedData);
      console.log(res);
      if(res.status === 200) {
        console.log("Order updated successfully");
        setEditModal(false);
        getPoFormateData(); 
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function onSavingUpdate() {
    setSelectedShipment({});
    setSelectedOrder({});
    setShipmentEditModal(false);
    // setShipmentBulkEditModal(false);
    setShipmentViewModal(false);
    setSkuEditModal(false);
    setEditModal(false);
    await getPoFormateData();
    await getShipmentData();
  }

  useEffect(() => {
    getPoFormateData()
    getShipmentData()
  },[])

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

          {/* po format table  */}
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
                <div className="relative">
                <ScrollArea className="w-full">
                  <div className="min-w-[2000px]">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
                          {
                            poFormatDataType.map((item, index) => (
                              <TableHead key={index} className="font-semibold mx-1 border-1 border-x-white py-1">{item.label}</TableHead>
                            ))
                          }
                            {/* <TableHead key="action" className="font-semibold mx-1 border-1 border-x-white py-1"> Action </TableHead> */}
                            <TableCell className="w-32 no-wrap">{" "}</TableCell>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {poFormatData.map((row, index) => (
                          <TableRow key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">

                            {
                              poFormatDataType.map((item, index) => (
                                <TableCell key={index} className="mx-1 border-1 border-x-white py-1">{row[item.fieldName]}</TableCell>
                              ))
                            }

                            {/* <TableCell className="mx-1 flex flex-row space-x-2 cursor-pointer">
                              {
                                <>
                                <span onClick={() => handleEditOrder(row)}><Edit className="h-6 w-6 text-blue-500" /></span>
                                <span onClick={() => handleDeleteOrder(row)}><Trash className="h-6 w-6 text-red-500"/></span>
                                </>
                              }
                            </TableCell> */}
                            <TableCell className="min-w-32 mx-1 border-1 border-x-white py-3 whitespace-nowrap">
                                {}
                            </TableCell>
                            {/* Spacer for sticky action column */}
                            <TableCell className="w-32"></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>

                {/* Sticky Action Column */}
                <div className="absolute top-0 right-0 bg-white dark:bg-gray-950 shadow-lg">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
                        <TableHead className="font-semibold py-2 px-4 w-32 text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {poFormatData.map((row, index) => (
                        <TableRow
                          key={index}
                          className="hover:bg-gray-50 dark:hover:bg-gray-800 border-none"
                        >
                          <TableCell className="py-0 px-2 w-28 border-none">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="py-0 my-[-0.23rem] flex flex-row">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-5 w-5 my-0" />
                                  <span className="hidden md:block py-0 my-0">Action</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem onClick={() => handleViewShipment(row)} className="cursor-pointer">
                                  <Eye className="mr-2 h-4 w-4 text-blue-500" />
                                  View Details
                                </DropdownMenuItem>
                                {/* <DropdownMenuItem onClick={() => handleEditSkuShipment(row)} className="cursor-pointer">
                                  <Package className="mr-2 h-4 w-4 text-green-500" />
                                  Edit SKU Level
                                </DropdownMenuItem> */}
                                {/* <DropdownMenuItem onClick={() => handleEditShipment(row)} className="cursor-pointer">
                                  <Edit className="mr-2 h-4 w-4 text-orange-500" />
                                  Edit Shipment
                                </DropdownMenuItem> */}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleDeleteOrder(row)}
                                  className="cursor-pointer text-red-600 focus:text-red-600"
                                >
                                  <Trash className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Shipment table  */}
          <TabsContent value="shipment-status">
          <Card className="shadow-lg">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center justify-between text-xl">
                <span>Shipment Status Data</span>
                <div className="flex items-center gap-3">
                  <Badge
                    variant="secondary"
                    className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 text-sm px-3 py-1"
                  >
                    {shipmentStatusData.length} Records
                  </Badge>
                  <Button
                    className="bg-blue-500 text-white hover:bg-blue-600"
                    onClick={() => {
                      setShipmentBulkEditModal(true)
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Bulk Edit
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <ScrollArea className="w-full">
                  <div className="relative">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
                          {shipmentStatusDataType.map((item, idx) => (
                            <TableHead
                              key={idx}
                              className="font-semibold mx-1 border-1 border-x-white py-3 whitespace-nowrap"
                            >
                              {item.label}
                            </TableHead>
                          ))}
                          {/* Spacer for sticky action column */}
                          <TableHead className="w-32"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {shipmentStatusData.map((row, index) => (
                          <TableRow key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                            {shipmentStatusDataType.map((item, idx) => (
                              <TableCell key={idx} className="mx-1 border-1 border-x-white py-3 whitespace-nowrap">
                                {row[item.fieldName]}
                              </TableCell>
                            ))}
                            <TableCell className="min-w-32 mx-1 border-1 border-x-white py-3 whitespace-nowrap">
                                {}
                            </TableCell>
                            {/* Spacer for sticky action column */}
                            <TableCell className="w-32"></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>

                {/* Sticky Action Column */}
                <div className="absolute top-0 right-0 bg-white dark:bg-gray-950 border-l border-gray-200 dark:border-gray-800 shadow-lg">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
                        <TableHead className="font-semibold py-3 px-4 w-32 text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {shipmentStatusData.map((row, index) => (
                        <TableRow
                          key={index}
                          className="hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-200 dark:border-gray-700"
                        >
                          <TableCell className="py-[0.26rem] px-2 w-28">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="p-0 m-0 flex flex-row">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-5 w-5" />
                                  <span className="hidden md:block">Action</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem onClick={() => handleViewShipment(row)} className="cursor-pointer">
                                  <Eye className="mr-2 h-4 w-4 text-blue-500" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEditSkuShipment(row)} className="cursor-pointer">
                                  <Package className="mr-2 h-4 w-4 text-green-500" />
                                  Edit SKU Level
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleEditShipment(row)} className="cursor-pointer">
                                  <Edit className="mr-2 h-4 w-4 text-orange-500" />
                                  Edit Shipment
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => handleDeleteShipment(row)}
                                  className="cursor-pointer text-red-600 focus:text-red-600"
                                >
                                  <Trash className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        </Tabs>

        <EditOrderModal 
          isOpen={isEditModal}
          onClose={()=>{setEditModal(false)}}
          orderData={selectedOrder}
          onSave={() => {onSavingUpdate()}}
        />

        <EditShipmentModal 
          isOpen={isShipmentEditModal}
          onClose={()=>{setShipmentEditModal(false)}}
          shipmentData={selectedShipment}
          onSave={() => {onSavingUpdate()}}
        />

        <BulkUpdateShipmentModal 
          isOpen={isShipmentBulkEditModal}
          onClose={()=>{setShipmentBulkEditModal(false)}}
          shipmentData={selectedShipment}
          onSave={() => {onSavingUpdate()}}
        />

        <SkuLevelEditModal 
          isOpen={isSkuEditModal}
          onClose={()=>{setSkuEditModal(false)}}
          shipmentId={selectedShipment.uid}
          onSave={() => {onSavingUpdate()}}
        />

        <ShipmentViewModal 
          isOpen={isShipmentViewModal}
          onClose={() => {setShipmentViewModal(false); setSelectedShipment({})}}
          shipment={selectedShipment}
          shipmentId={selectedShipment.uid}
          poNumber={selectedShipment.poNumber}
        />

      </main>
    </div>
  )
}
