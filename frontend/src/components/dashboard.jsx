"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Database, Edit, Eye, Package, Trash, MoreHorizontal, Search, Download, Calendar, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import NavigationHeader from "@/components/header"
import { useThemeStore } from "@/store/theme-store"
import { getPoFormatOrderList, getShipmentStatusList, updateSinglePoOrder } from "@/lib/order"
import { poFormatDataType, shipmentStatusDataType } from "@/constants/data_type"
import EditOrderModal from "@/components/edit-order-modal"
import EditShipmentModal from "@/components/edit-shipment-modal"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import BulkUpdateShipmentModal from "@/components/bulk-shipment-update"
import SkuLevelEditModal from "@/components/sku-level-edit-modal"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import ShipmentViewModal from "@/components/view-shipment-modal"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { format, parse, isSameDay } from "date-fns"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

// Sample data based on provided format
const poData = [
  {
    entryDate: "04-12-2024",
    brand: "MCaffeine",
    channel: "Zepto",
    location: "Hyderabad",
    poDate: "03-12-2024",
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
    workingDate: "01-01-1900",
    dispatchDate: "",
    currentAppointmentDate: "01-01-1900",
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
    entryDate: "04-12-2024",
    brand: "MCaffeine",
    channel: "Zepto",
    location: "Hyderabad",
    poDate: "03-12-2024",
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
    workingDate: "01-01-1900",
    dispatchDate: "",
    currentAppointmentDate: "01-01-1900",
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
    entryDate: "04-12-2024",
    poDate: "03-12-2024",
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
    dispatchDate: "01-01-1900",
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
    rescheduleLag: "01-01-1900",
    finalRemarks: "01-01-1900",
    updatedGmv: "01-01-1900",
    physicalWeight: 839,
    rivigoTatIp: 232042,
    criticalDispatchDate: 232042,
    coptFinalRemark: 342657,
    updatedExpiry: "0/0/0",
    check1: "01-01-1900",
    check2: 342657,
    uid2: 152,
    check: 4,
  },
]

// Multi-select filter component
const MultiSelectFilter = ({ label, options, selectedValues, onSelectionChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleToggle = (value) => {
    const newSelection = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value]
    onSelectionChange(newSelection)
  }

  const handleSelectAll = () => {
    if (selectedValues.length === options.length) {
      onSelectionChange([])
    } else {
      onSelectionChange(options)
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between text-left font-normal bg-transparent">
            <span className="truncate">
              {selectedValues.length === 0
                ? placeholder
                : selectedValues.length === 1
                  ? selectedValues[0]
                  : `${selectedValues.length} selected`}
            </span>
            <X className={cn("ml-2 h-4 w-4 shrink-0 opacity-50 transition-transform", isOpen && "rotate-180")} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <div className="max-h-60 overflow-auto">
            <div className="p-2 border-b">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="select-all"
                  checked={selectedValues.length === options.length}
                  onCheckedChange={handleSelectAll}
                />
                <Label htmlFor="select-all" className="text-sm font-medium">
                  Select All
                </Label>
              </div>
            </div>
            <div className="p-2 space-y-2">
              {options.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={option}
                    checked={selectedValues.includes(option)}
                    onCheckedChange={() => handleToggle(option)}
                  />
                  <Label htmlFor={option} className="text-sm cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default function DashboardPage({ onNavigate }) {
  const router = useRouter()
  const { isDarkMode, setIsDarkMode } = useThemeStore()
  const [activeTab, setActiveTab] = useState("po-format")

  const [poFormatData, setPoFormatData] = useState([])
  const [shipmentStatusData, setShipmentStatusData] = useState([])

  // Search states
  const [poSearchTerm, setPoSearchTerm] = useState("")
  const [shipmentSearchTerm, setShipmentSearchTerm] = useState("")

  // Filter states for PO Format - Updated to support multi-select
  const [poFilters, setPoFilters] = useState({
    entryDateFrom: null,
    entryDateTo: null,
    brand: [],
    channel: [],
    location: [],
    poDateFrom: null,
    poDateTo: null,
    skuCode: "",
    workingDateFrom: null,
    workingDateTo: null,
    dispatchDateFrom: null,
    dispatchDateTo: null,
    currentAppointmentDateFrom: null,
    currentAppointmentDateTo: null,
    statusPlanning: [],
    statusWarehouse: [],
    statusLogistics: [],
  })

  // Filter states for Shipment - Updated to support multi-select
  const [shipmentFilters, setShipmentFilters] = useState({
    entryDateFrom: null,
    entryDateTo: null,
    brand: [],
    channel: [],
    location: [],
    poDateFrom: null,
    poDateTo: null,
    currentAppointmentDateFrom: null,
    currentAppointmentDateTo: null,
    statusPlanning: [],
    statusWarehouse: [],
    statusLogistics: [],
  })

  const [isEditModal, setEditModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState({})
  const [selectedShipment, setSelectedShipment] = useState({})
  const [isShipmentEditModal, setShipmentEditModal] = useState(false)
  const [isShipmentBulkEditModal, setShipmentBulkEditModal] = useState(false)
  const [isShipmentViewModal, setShipmentViewModal] = useState(false)
  const [isSkuEditModal, setSkuEditModal] = useState(false)

  // Utility function to parse DD-MM-YYYY date strings
  const parseDate = (dateStr) => {
    if (!dateStr || dateStr === "01-01-1900" || dateStr === "" || dateStr === "0") return null
    try {
      return parse(dateStr, "dd-MM-yyyy", new Date())
    } catch {
      return null
    }
  }

  // Utility function to format date to DD-MM-YYYY
  const formatDate = (date) => {
    if (!date) return ""
    return format(date, "dd-MM-yyyy")
  }

  // Get unique values for dropdown filters
  const getUniqueValues = (data, field) => {
    const values = data.map((item) => item[field]).filter((value) => value && value !== "" && value !== "0")
    return [...new Set(values)].sort()
  }

  async function getPoFormateData() {
    try {
      const res = await getPoFormatOrderList()
      console.log(res.data)
      setPoFormatData(res.data.orders)
    } catch (error) {
      console.log(error)
      setPoFormatData(poData)
    }
  }

  async function getShipmentData() {
    try {
      const res = await getShipmentStatusList()
      console.log("Shipment Data: ", res.data.shipments)
      setShipmentStatusData(res.data.shipments)
    } catch (error) {
      console.log(error)
      setShipmentStatusData(shipmentData)
    }
  }

  // Enhanced filter function for PO data - Updated for multi-select
  const filteredPoData = poFormatData.filter((item) => {
    // Search filter
    const searchLower = poSearchTerm.toLowerCase()
    const matchesSearch =
      !poSearchTerm ||
      item.poNumber?.toString().toLowerCase().includes(searchLower) ||
      item.skuCode?.toString().toLowerCase().includes(searchLower)

    // Date filters
    const entryDate = parseDate(item.entryDate)
    const poDate = parseDate(item.poDate)
    const workingDate = parseDate(item.workingDate)
    const dispatchDate = parseDate(item.dispatchDate)
    const currentAppointmentDate = parseDate(item.currentAppointmentDate)

    const matchesFilters =
      (!poFilters.entryDateFrom || (entryDate && entryDate >= poFilters.entryDateFrom)) &&
      (!poFilters.entryDateTo || (entryDate && entryDate <= poFilters.entryDateTo)) &&
      (poFilters.brand.length === 0 || poFilters.brand.includes(item.brand)) &&
      (poFilters.channel.length === 0 || poFilters.channel.includes(item.channel)) &&
      (poFilters.location.length === 0 || poFilters.location.includes(item.location)) &&
      (!poFilters.poDateFrom || (poDate && poDate >= poFilters.poDateFrom)) &&
      (!poFilters.poDateTo || (poDate && poDate <= poFilters.poDateTo)) &&
      (!poFilters.skuCode || item.skuCode?.toLowerCase().includes(poFilters.skuCode.toLowerCase())) &&
      (!poFilters.workingDateFrom || (workingDate && workingDate >= poFilters.workingDateFrom)) &&
      (!poFilters.workingDateTo || (workingDate && workingDate <= poFilters.workingDateTo)) &&
      (!poFilters.dispatchDateFrom || (dispatchDate && dispatchDate >= poFilters.dispatchDateFrom)) &&
      (!poFilters.dispatchDateTo || (dispatchDate && dispatchDate <= poFilters.dispatchDateTo)) &&
      (!poFilters.currentAppointmentDateFrom ||
        (currentAppointmentDate && currentAppointmentDate >= poFilters.currentAppointmentDateFrom)) &&
      (!poFilters.currentAppointmentDateTo ||
        (currentAppointmentDate && currentAppointmentDate <= poFilters.currentAppointmentDateTo)) &&
      (poFilters.statusPlanning.length === 0 || poFilters.statusPlanning.includes(item.statusPlanning)) &&
      (poFilters.statusWarehouse.length === 0 || poFilters.statusWarehouse.includes(item.statusWarehouse)) &&
      (poFilters.statusLogistics.length === 0 || poFilters.statusLogistics.includes(item.statusLogistics))

    return matchesSearch && matchesFilters
  })

  // Enhanced filter function for Shipment data - Updated for multi-select
  const filteredShipmentData = shipmentStatusData.filter((item) => {
    // Search filter
    const searchLower = shipmentSearchTerm.toLowerCase()
    const matchesSearch =
      !shipmentSearchTerm ||
      item.poNumber?.toString().toLowerCase().includes(searchLower) ||
      item.uid?.toString().toLowerCase().includes(searchLower)

    // Date filters
    const entryDate = parseDate(item.entryDate)
    const poDate = parseDate(item.poDate)
    const currentAppointmentDate = parseDate(item.currentAppointmentDate)

    const matchesFilters =
      (!shipmentFilters.entryDateFrom || (entryDate && entryDate >= shipmentFilters.entryDateFrom)) &&
      (!shipmentFilters.entryDateTo || (entryDate && entryDate <= shipmentFilters.entryDateTo)) &&
      (shipmentFilters.brand.length === 0 || shipmentFilters.brand.includes(item.brandName)) &&
      (shipmentFilters.channel.length === 0 || shipmentFilters.channel.includes(item.channel)) &&
      (shipmentFilters.location.length === 0 || shipmentFilters.location.includes(item.location)) &&
      (!shipmentFilters.poDateFrom || (poDate && poDate >= shipmentFilters.poDateFrom)) &&
      (!shipmentFilters.poDateTo || (poDate && poDate <= shipmentFilters.poDateTo)) &&
      (!shipmentFilters.currentAppointmentDateFrom ||
        (currentAppointmentDate && currentAppointmentDate >= shipmentFilters.currentAppointmentDateFrom)) &&
      (!shipmentFilters.currentAppointmentDateTo ||
        (currentAppointmentDate && currentAppointmentDate <= shipmentFilters.currentAppointmentDateTo)) &&
      (shipmentFilters.statusPlanning.length === 0 || shipmentFilters.statusPlanning.includes(item.statusPlanning)) &&
      (shipmentFilters.statusWarehouse.length === 0 ||
        shipmentFilters.statusWarehouse.includes(item.statusWarehouse)) &&
      (shipmentFilters.statusLogistics.length === 0 || shipmentFilters.statusLogistics.includes(item.statusLogistics))

    return matchesSearch && matchesFilters
  })

  // CSV Export function - only export visible table columns
  const exportToCSV = (data, filename, dataType) => {
    if (data.length === 0) return

    // Get only the fields that are visible in the table
    const visibleFields = dataType.map((item) => item.fieldName)
    const headers = dataType.map((item) => item.label)

    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        visibleFields
          .map((fieldName) => {
            const value = row[fieldName] || ""
            return typeof value === "string" && value.includes(",") ? `"${value}"` : value
          })
          .join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", filename)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Clear filters functions - Updated for multi-select
  const clearPoFilters = () => {
    setPoFilters({
      entryDateFrom: null,
      entryDateTo: null,
      brand: [],
      channel: [],
      location: [],
      poDateFrom: null,
      poDateTo: null,
      skuCode: "",
      workingDateFrom: null,
      workingDateTo: null,
      dispatchDateFrom: null,
      dispatchDateTo: null,
      currentAppointmentDateFrom: null,
      currentAppointmentDateTo: null,
      statusPlanning: [],
      statusWarehouse: [],
      statusLogistics: [],
    })
    setPoSearchTerm("")
  }

  const clearShipmentFilters = () => {
    setShipmentFilters({
      entryDateFrom: null,
      entryDateTo: null,
      brand: [],
      channel: [],
      location: [],
      poDateFrom: null,
      poDateTo: null,
      currentAppointmentDateFrom: null,
      currentAppointmentDateTo: null,
      statusPlanning: [],
      statusWarehouse: [],
      statusLogistics: [],
    })
    setShipmentSearchTerm("")
  }

  // Date picker component
  const DatePicker = ({ date, onDateChange, placeholder }) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
        >
          <Calendar className="mr-2 h-4 w-4" />
          {date ? formatDate(date) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <CalendarComponent
          mode="single"
          selected={date}
          onSelect={(next) => {
            // Toggle off if user selects the same date again
            if (date && next && isSameDay(date, next)) {
              onDateChange(null)
            } else {
              onDateChange(next ?? null)
            }
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )

  function handleEditOrder(data) {
    console.log(data)
    setSelectedOrder(data)
    setEditModal(true)
  }

  function handleDeleteOrder(data) {
    console.log("Delete order:", data)
  }

  function handleViewShipment(data) {
    console.log(data)
    setSelectedShipment(data)
    setShipmentViewModal(true)
  }

  function handleEditSkuShipment(data) {
    console.log(data)
    setSelectedShipment(data)
    setSkuEditModal(true)
  }

  function handleEditShipment(data) {
    console.log(data)
    setSelectedShipment(data)
    setShipmentEditModal(true)
  }

  function handleDeleteShipment(data) {
    console.log("Delete Shipment:", data)
  }

  async function onUpdateSingleOrder(data) {
    try {
      let updatedData = localStorage.getItem("orderData")
      updatedData = JSON.parse(updatedData)
      console.log("Parsed Data: ", updatedData)
      const res = await updateSinglePoOrder(updatedData)
      console.log(res)
      if (res.status === 200) {
        console.log("Order updated successfully")
        setEditModal(false)
        getPoFormateData()
      }
    } catch (error) {
      console.log(error)
    }
  }

  async function onSavingUpdate() {
    setSelectedShipment({})
    setSelectedOrder({})
    setShipmentEditModal(false)
    setShipmentViewModal(false)
    setSkuEditModal(false)
    setEditModal(false)
    await getPoFormateData()
    await getShipmentData()
  }

  // Get fixed columns for PO Format (up to PO Number)
  const getPoFixedColumns = () => {
    const poNumberIndex = poFormatDataType.findIndex((item) => item.fieldName === "poNumber")
    return poFormatDataType.slice(0, poNumberIndex + 1)
  }

  // Get scrollable columns for PO Format (after PO Number)
  const getPoScrollableColumns = () => {
    const poNumberIndex = poFormatDataType.findIndex((item) => item.fieldName === "poNumber")
    return poFormatDataType.slice(poNumberIndex + 1)
  }

  // Get fixed columns for Shipment (up to PO Number)
  const getShipmentFixedColumns = () => {
    const poNumberIndex = shipmentStatusDataType.findIndex((item) => item.fieldName === "poNumber")
    return shipmentStatusDataType.slice(0, poNumberIndex + 1)
  }

  // Get scrollable columns for Shipment (after PO Number)
  const getShipmentScrollableColumns = () => {
    const poNumberIndex = shipmentStatusDataType.findIndex((item) => item.fieldName === "poNumber")
    return shipmentStatusDataType.slice(poNumberIndex + 1)
  }

  useEffect(() => {
    getPoFormateData()
    getShipmentData()
  }, [])

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark bg-gray-900" : "bg-gray-50"}`}>
      <NavigationHeader currentPage="dashboard" onNavigate={onNavigate} />

      <main className="max-w-[97%] mx-auto py-3">
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

          {/* PO Format Table */}
          <TabsContent value="po-format">
            <Card className="shadow-lg">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center justify-between text-xl">
                  <span>PO Format Data</span>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-sm px-3 py-1"
                    >
                      {filteredPoData.length} of {poFormatData.length} Records
                    </Badge>
                    <Button
                      onClick={() => exportToCSV(filteredPoData, "po-format-data.csv", poFormatDataType)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                </CardTitle>

                {/* Search and Filters */}
                <div className="space-y-4">
                  {/* Search */}
                  <div className="flex items-center space-x-2">
                    <div className="relative flex-1 max-w-sm">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search by PO Number or SKU Code..."
                        value={poSearchTerm}
                        onChange={(e) => setPoSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Button variant="outline" onClick={clearPoFilters}>
                      <X className="h-4 w-4 mr-2" />
                      Clear All
                    </Button>
                  </div>

                  {/* Filters */}
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {/* Entry Date Range */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Entry Date From</label>
                      <DatePicker
                        date={poFilters.entryDateFrom}
                        onDateChange={(date) => setPoFilters((prev) => ({ ...prev, entryDateFrom: date }))}
                        placeholder="From date"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Entry Date To</label>
                      <DatePicker
                        date={poFilters.entryDateTo}
                        onDateChange={(date) => setPoFilters((prev) => ({ ...prev, entryDateTo: date }))}
                        placeholder="To date"
                      />
                    </div>

                    {/* Multi-select Brand */}
                    <MultiSelectFilter
                      label="Brand"
                      options={getUniqueValues(poFormatData, "brand")}
                      selectedValues={poFilters.brand}
                      onSelectionChange={(values) => setPoFilters((prev) => ({ ...prev, brand: values }))}
                      placeholder="Select brands"
                    />

                    {/* Multi-select Channel */}
                    <MultiSelectFilter
                      label="Channel"
                      options={getUniqueValues(poFormatData, "channel")}
                      selectedValues={poFilters.channel}
                      onSelectionChange={(values) => setPoFilters((prev) => ({ ...prev, channel: values }))}
                      placeholder="Select channels"
                    />

                    {/* Multi-select Location */}
                    <MultiSelectFilter
                      label="Location"
                      options={getUniqueValues(poFormatData, "location")}
                      selectedValues={poFilters.location}
                      onSelectionChange={(values) => setPoFilters((prev) => ({ ...prev, location: values }))}
                      placeholder="Select locations"
                    />

                    {/* SKU Code */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">SKU Code</label>
                      <Input
                        placeholder="Enter SKU code"
                        value={poFilters.skuCode}
                        onChange={(e) => setPoFilters((prev) => ({ ...prev, skuCode: e.target.value }))}
                      />
                    </div>

                    {/* Multi-select Status Planning */}
                    <MultiSelectFilter
                      label="Status Planning"
                      options={getUniqueValues(poFormatData, "statusPlanning")}
                      selectedValues={poFilters.statusPlanning}
                      onSelectionChange={(values) => setPoFilters((prev) => ({ ...prev, statusPlanning: values }))}
                      placeholder="Select status"
                    />

                    {/* Multi-select Status Warehouse */}
                    <MultiSelectFilter
                      label="Status Warehouse"
                      options={getUniqueValues(poFormatData, "statusWarehouse")}
                      selectedValues={poFilters.statusWarehouse}
                      onSelectionChange={(values) => setPoFilters((prev) => ({ ...prev, statusWarehouse: values }))}
                      placeholder="Select status"
                    />

                    {/* Multi-select Status Logistics */}
                    <MultiSelectFilter
                      label="Status Logistics"
                      options={getUniqueValues(poFormatData, "statusLogistics")}
                      selectedValues={poFilters.statusLogistics}
                      onSelectionChange={(values) => setPoFilters((prev) => ({ ...prev, statusLogistics: values }))}
                      placeholder="Select status"
                    />
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="relative">
                  {/* Fixed columns container */}
                  <div className="flex overflow-auto">
                    {/* Fixed columns */}
                    <div className="absolute left-0 top-0 z-50 bg-background border-r border-gray-200 dark:border-gray-800">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
                            {getPoFixedColumns().map((item, index) => (
                              <TableHead
                                key={index}
                                className="font-semibold mx-1 border-1 border-x-white py-1 whitespace-nowrap"
                              >
                                {item.label}
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredPoData.map((row, index) => (
                            <TableRow key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                              {getPoFixedColumns().map((item, idx) => (
                                <TableCell key={idx} className="mx-1 border-1 border-x-white py-1 whitespace-nowrap">
                                  {row[item.fieldName]}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Scrollable columns container */}
                    <div className="flex-1 ml-[37rem]">
                      <ScrollArea className="w-full">
                        <div className="min-w-max">
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
                                {getPoScrollableColumns().map((item, index) => (
                                  <TableHead
                                    key={index}
                                    className="font-semibold mx-1 border-1 border-x-white py-1 whitespace-nowrap"
                                  >
                                    {item.label}
                                  </TableHead>
                                ))}
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {filteredPoData.map((row, index) => (
                                <TableRow key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                  {getPoScrollableColumns().map((item, idx) => (
                                    <TableCell
                                      key={idx}
                                      className="mx-1 border-1 border-x-white py-1 whitespace-nowrap"
                                    >
                                      {row[item.fieldName]}
                                    </TableCell>
                                  ))}
                                  <TableCell className={"min-w-28"}></TableCell>
                                </TableRow>
                              ))}
                              
                            </TableBody>
                          </Table>
                        </div>
                        <ScrollBar orientation="horizontal" />
                      </ScrollArea>
                    </div>

                    {/* Sticky Action Column */}
                    <div className="absolute right-0 top-0 z-50 bg-background border-l border-gray-200 dark:border-gray-800 shadow-lg">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
                            <TableHead className="font-semibold py-2 px-4 w-32 text-center">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredPoData.map((row, index) => (
                            <TableRow key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800 border-none">
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
                                    <DropdownMenuItem
                                      onClick={() => handleViewShipment(row)}
                                      className="cursor-pointer"
                                    >
                                      <Eye className="mr-2 h-4 w-4 text-blue-500" />
                                      View Details
                                    </DropdownMenuItem>
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
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Shipment Table */}
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
                      {filteredShipmentData.length} of {shipmentStatusData.length} Records
                    </Badge>
                    <Button
                      onClick={() =>
                        exportToCSV(filteredShipmentData, "shipment-status-data.csv", shipmentStatusDataType)
                      }
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
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

                {/* Search and Filters */}
                <div className="space-y-4">
                  {/* Search */}
                  <div className="flex items-center space-x-2">
                    <div className="relative flex-1 max-w-sm">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search by PO Number or UID..."
                        value={shipmentSearchTerm}
                        onChange={(e) => setShipmentSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Button variant="outline" onClick={clearShipmentFilters}>
                      <X className="h-4 w-4 mr-2" />
                      Clear All
                    </Button>
                  </div>

                  {/* Filters */}
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {/* Entry Date Range */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Entry Date From</label>
                      <DatePicker
                        date={shipmentFilters.entryDateFrom}
                        onDateChange={(date) => setShipmentFilters((prev) => ({ ...prev, entryDateFrom: date }))}
                        placeholder="From date"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Entry Date To</label>
                      <DatePicker
                        date={shipmentFilters.entryDateTo}
                        onDateChange={(date) => setShipmentFilters((prev) => ({ ...prev, entryDateTo: date }))}
                        placeholder="To date"
                      />
                    </div>

                    {/* Multi-select Brand */}
                    <MultiSelectFilter
                      label="Brand"
                      options={getUniqueValues(shipmentStatusData, "brandName")}
                      selectedValues={shipmentFilters.brand}
                      onSelectionChange={(values) => setShipmentFilters((prev) => ({ ...prev, brand: values }))}
                      placeholder="Select brands"
                    />

                    {/* Multi-select Channel */}
                    <MultiSelectFilter
                      label="Channel"
                      options={getUniqueValues(shipmentStatusData, "channel")}
                      selectedValues={shipmentFilters.channel}
                      onSelectionChange={(values) => setShipmentFilters((prev) => ({ ...prev, channel: values }))}
                      placeholder="Select channels"
                    />

                    {/* Multi-select Location */}
                    <MultiSelectFilter
                      label="Location"
                      options={getUniqueValues(shipmentStatusData, "location")}
                      selectedValues={shipmentFilters.location}
                      onSelectionChange={(values) => setShipmentFilters((prev) => ({ ...prev, location: values }))}
                      placeholder="Select locations"
                    />

                    {/* Multi-select Status Planning */}
                    <MultiSelectFilter
                      label="Status Planning"
                      options={getUniqueValues(shipmentStatusData, "statusPlanning")}
                      selectedValues={shipmentFilters.statusPlanning}
                      onSelectionChange={(values) =>
                        setShipmentFilters((prev) => ({ ...prev, statusPlanning: values }))
                      }
                      placeholder="Select status"
                    />

                    {/* Multi-select Status Warehouse */}
                    <MultiSelectFilter
                      label="Status Warehouse"
                      options={getUniqueValues(shipmentStatusData, "statusWarehouse")}
                      selectedValues={shipmentFilters.statusWarehouse}
                      onSelectionChange={(values) =>
                        setShipmentFilters((prev) => ({ ...prev, statusWarehouse: values }))
                      }
                      placeholder="Select status"
                    />

                    {/* Multi-select Status Logistics */}
                    <MultiSelectFilter
                      label="Status Logistics"
                      options={getUniqueValues(shipmentStatusData, "statusLogistics")}
                      selectedValues={shipmentFilters.statusLogistics}
                      onSelectionChange={(values) =>
                        setShipmentFilters((prev) => ({ ...prev, statusLogistics: values }))
                      }
                      placeholder="Select status"
                    />
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="relative">
                  {/* Fixed columns container */}
                  <div className="flex overflow-auto">
                    {/* Fixed columns */}
                    <div className="absolute left-0 top-0 z-50 bg-background border-r border-gray-200 dark:border-gray-800">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
                            {getShipmentFixedColumns().map((item, idx) => (
                              <TableHead
                                key={idx}
                                className="font-semibold mx-1 border-1 border-x-white py-3 whitespace-nowrap"
                              >
                                {item.label}
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredShipmentData.map((row, index) => (
                            <TableRow key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                              {getShipmentFixedColumns().map((item, idx) => (
                                <TableCell key={idx} className="mx-1 border-1 border-x-white py-3 whitespace-nowrap">
                                  {row[item.fieldName]}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Scrollable columns container */}
                    <div className="flex-1 ml-[38rem]">
                      <ScrollArea className="w-full">
                        <div className="min-w-max">
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
                                {getShipmentScrollableColumns().map((item, idx) => (
                                  <TableHead
                                    key={idx}
                                    className="font-semibold mx-1 border-1 border-x-white py-3 whitespace-nowrap"
                                  >
                                    {item.label}
                                  </TableHead>
                                ))}
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {filteredShipmentData.map((row, index) => (
                                <TableRow key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                  {getShipmentScrollableColumns().map((item, idx) => (
                                    <TableCell
                                      key={idx}
                                      className="mx-1 border-1 border-x-white py-3 whitespace-nowrap"
                                    >
                                      {row[item.fieldName]}
                                    </TableCell>
                                  ))}
                                  <TableCell className={"min-w-28"}></TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                        <ScrollBar orientation="horizontal" />
                      </ScrollArea>
                    </div>

                    {/* Sticky Action Column */}
                    <div className="absolute right-0 top-0 z-50 bg-background border-l border-gray-200 dark:border-gray-800 shadow-lg">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
                            <TableHead className="font-semibold py-3 px-4 w-32 text-center">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredShipmentData.map((row, index) => (
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
                                    <DropdownMenuItem
                                      onClick={() => handleViewShipment(row)}
                                      className="cursor-pointer"
                                    >
                                      <Eye className="mr-2 h-4 w-4 text-blue-500" />
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleEditSkuShipment(row)}
                                      className="cursor-pointer"
                                    >
                                      <Package className="mr-2 h-4 w-4 text-green-500" />
                                      Edit SKU Level
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleEditShipment(row)}
                                      className="cursor-pointer"
                                    >
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
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modals */}
        <EditOrderModal
          isOpen={isEditModal}
          onClose={() => {
            setEditModal(false)
          }}
          orderData={selectedOrder}
          onSave={() => {
            onSavingUpdate()
          }}
        />

        <EditShipmentModal
          isOpen={isShipmentEditModal}
          onClose={() => {
            setShipmentEditModal(false)
          }}
          shipmentData={selectedShipment}
          onSave={() => {
            onSavingUpdate()
          }}
        />

        <BulkUpdateShipmentModal
          isOpen={isShipmentBulkEditModal}
          onClose={() => {
            setShipmentBulkEditModal(false)
          }}
          shipmentData={selectedShipment}
          onSave={() => {
            onSavingUpdate()
          }}
        />

        <SkuLevelEditModal
          isOpen={isSkuEditModal}
          onClose={() => {
            setSkuEditModal(false)
          }}
          shipmentId={selectedShipment.uid}
          onSave={() => {
            onSavingUpdate()
          }}
        />

        <ShipmentViewModal
          isOpen={isShipmentViewModal}
          onClose={() => {
            setShipmentViewModal(false)
            setSelectedShipment({})
          }}
          shipment={selectedShipment}
          shipmentId={selectedShipment.uid}
          poNumber={selectedShipment.poNumber}
        />
      </main>
    </div>
  )
}
