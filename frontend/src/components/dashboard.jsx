"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Database, Edit, Edit2, Package, Trash } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import NavigationHeader from "@/components/header"
import { useThemeStore } from "@/store/theme-store"
import { getPoFormatOrderList,getShipmentStatusList,updateSinglePoOrder } from "@/lib/order"
import { poFormatDataType, shipmentStatusDataType } from "@/constants/data_type"
import EditOrderModal from "./edit-order-modal"
import EditShipmentModal from "./edit-shipment-modal"

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

  const {isDarkMode, setIsDarkMode} = useThemeStore()

  const [activeTab, setActiveTab] = useState("po-format")

  const [poFormatData, setPoFormatData] = useState([])
  const [shipmentStatusData, setShipmentStatusData] = useState([])

  const [isEditModal, setEditModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState({})
  const [selectedShipment, setSelectedShipment] = useState({})
  const [isShipmentEditModal, setShipmentEditModal] = useState(false)

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
                            <TableHead key="action" className="font-semibold mx-1 border-1 border-x-white py-1"> Action </TableHead>
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

                            <TableCell className="mx-1 flex flex-row space-x-2 cursor-pointer">
                              {
                                <>
                                <span onClick={() => handleEditOrder(row)}><Edit className="h-6 w-6 text-blue-500" /></span>
                                <span onClick={() => handleDeleteOrder(row)}><Trash className="h-6 w-6 text-red-500"/></span>
                                </>
                              }
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
          
          {/* Shipment table  */}
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
                  <div className="">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
                          {
                            shipmentStatusDataType.map((item, idx) => (
                              <TableHead key={idx} className="font-semibold mx-1 border-1 border-x-white py-1">{item.label}</TableHead>
                            ))
                          }
                          {
                            <TableHead key="action" className="font-semibold mx-1 border-1 border-x-white py-1"> Action </TableHead>
                          }
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {shipmentStatusData.map((row, index) => (
                          <TableRow key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                            {
                              shipmentStatusDataType.map((item, idx) => (
                                <TableCell key={idx} className="mx-1 border-1 border-x-white py-1">
                                  {row[item.fieldName]}
                                </TableCell>
                              ))
                            }
                            {

                              <TableCell className="mx-2 py-1 flex flex-row">
                                <span onClick={() => handleEditShipment(row)}><Edit className="text-blue-500 h-6 w-6"  /></span>
                                <span onClick={() => handleDeleteShipment(row)}><Trash className="text-red-500 h-6 w-6 mx-1" /></span>
                              </TableCell>
                            } 
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

        <EditOrderModal 
          isOpen={isEditModal}
          onClose={()=>{setEditModal(false)}}
          orderData={selectedOrder}
          onSave={() => {onUpdateSingleOrder(selectedOrder);setSelectedOrder({})}}
        />

        <EditShipmentModal 
          isOpen={isShipmentEditModal}
          onClose={()=>{setShipmentEditModal(false)}}
          shipmentData={selectedShipment}
          onSave={(data) => {onUpdateSingleShipment(selectedShipment);setSelectedShipment({}); console.log("onSave: ",data)}}
        />

      </main>
    </div>
  )
}
