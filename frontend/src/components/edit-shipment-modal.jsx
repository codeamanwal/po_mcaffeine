"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea,ScrollBar } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, AlertCircle, CheckCircle, Save, X, Shield, Warehouse, Truck } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useUserStore } from "@/store/user-store"
import { shipmentStatusDataType } from "@/constants/data_type"

// const shipmentStatusDataType = [
//   { fieldName: "uid", label: "UID", id: "uid", type: "text" },
//   { fieldName: "entryDate", label: "Entry Date", id: "entryDate", type: "date" },
//   { fieldName: "poDate", label: "PO Date", id: "poDate", type: "date" },
//   {
//     fieldName: "facility",
//     label: "Facility",
//     id: "facility",
//     type: "select",
//     options: ["MUM_WAREHOUSE1", "MUM_WAREHOUSE2", "DEL_WAREHOUSE1", "BLR_WAREHOUSE1"],
//   },
//   {
//     fieldName: "channel",
//     label: "Channel",
//     id: "channel",
//     type: "select",
//     options: ["Zepto", "Amazon", "Flipkart", "Nykaa", "BigBasket", "Swiggy Instamart", "Blinkit"],
//   },
//   {
//     fieldName: "location",
//     label: "Location",
//     id: "location",
//     type: "select",
//     options: ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune"],
//   },
//   { fieldName: "poNumber", label: "PO Number", id: "poNumber", type: "text" },
//   { fieldName: "totalUnits", label: "Total Units", id: "totalUnits", type: "number" },
//   { fieldName: "brandName", label: "Brand Name", id: "brandName", type: "text" },
//   { fieldName: "remarksPlanning", label: "Remarks (Planning)", id: "remarksPlanning", type: "text" },
//   { fieldName: "specialRemarksCOPT", label: "Special Remarks (COPT)", id: "specialRemarksCOPT", type: "text" },
//   { fieldName: "newShipmentReference", label: "New Shipment Reference", id: "newShipmentReference", type: "text" },
//   {
//     fieldName: "statusActive",
//     label: "Status (Active/Inactive)",
//     id: "statusActive",
//     type: "select",
//     options: ["Active", "Inactive"],
//   },
//   {
//     fieldName: "statusPlanning",
//     label: "Status (Planning)",
//     id: "statusPlanning",
//     type: "select",
//     options: ["Confirmed", "Pending", "Cancelled", "In Progress"],
//   },
//   {
//     fieldName: "statusWarehouse",
//     label: "Status (Warehouse)",
//     id: "statusWarehouse",
//     type: "select",
//     options: ["Ready", "Processing", "Dispatched", ""],
//   },
//   {
//     fieldName: "statusLogistics",
//     label: "Status (Logistics)",
//     id: "statusLogistics",
//     type: "select",
//     options: ["0", "1", "2", "3"],
//   },
//   {
//     fieldName: "channelInwardingRemarks",
//     label: "Channel Inwarding Remarks",
//     id: "channelInwardingRemarks",
//     type: "text",
//   },
//   {
//     fieldName: "dispatchRemarksLogistics",
//     label: "Dispatch Remarks (Logistics)",
//     id: "dispatchRemarksLogistics",
//     type: "text",
//   },
//   {
//     fieldName: "dispatchRemarksWarehouse",
//     label: "Dispatch Remarks (Warehouse)",
//     id: "dispatchRemarksWarehouse",
//     type: "text",
//   },
//   {
//     fieldName: "dispatchDateTentative",
//     label: "Dispatch Date - Tentative (Planning)",
//     id: "dispatchDateTentative",
//     type: "date",
//   },
//   { fieldName: "workingDatePlanner", label: "Working Date (Planner)", id: "workingDatePlanner", type: "date" },
//   { fieldName: "rtsDate", label: "RTS Date", id: "rtsDate", type: "date" },
//   { fieldName: "dispatchDate", label: "Dispatch Date", id: "dispatchDate", type: "date" },
//   {
//     fieldName: "currentAppointmentDate",
//     label: "Current Appointment Date",
//     id: "currentAppointmentDate",
//     type: "date",
//   },
//   {
//     fieldName: "firstAppointmentDateCOPT",
//     label: "First Appointment Date (COPT)",
//     id: "firstAppointmentDateCOPT",
//     type: "date",
//   },
//   { fieldName: "noOfBoxes", label: "No of Boxes", id: "noOfBoxes", type: "number" },
//   { fieldName: "orderNo1", label: "Order No 1", id: "orderNo1", type: "text" },
//   { fieldName: "orderNo2", label: "Order No 2", id: "orderNo2", type: "text" },
//   { fieldName: "orderNo3", label: "Order No 3", id: "orderNo3", type: "text" },
//   { fieldName: "poNumberInwardCWH", label: "PO Number (Inward - CWH)", id: "poNumberInwardCWH", type: "text" },
//   { fieldName: "pickListNo", label: "Pick List No", id: "pickListNo", type: "text" },
//   { fieldName: "workingTypeWarehouse", label: "Working Type (Warehouse)", id: "workingTypeWarehouse", type: "text" },
//   {
//     fieldName: "inventoryRemarksWarehouse",
//     label: "Inventory Remarks (Warehouse)",
//     id: "inventoryRemarksWarehouse",
//     type: "text",
//   },
//   { fieldName: "b2bWorkingTeamRemarks", label: "B2B Working Team Remarks", id: "b2bWorkingTeamRemarks", type: "text" },
//   { fieldName: "actualWeight", label: "Actual Weight", id: "actualWeight", type: "number" },
//   { fieldName: "volumetricWeight", label: "Volumetric Weight", id: "volumetricWeight", type: "number" },
//   {
//     fieldName: "channelType",
//     label: "Channel Type",
//     id: "channelType",
//     type: "select",
//     options: ["Quick-commerce", "E-commerce", "Marketplace", "Retail"],
//   },
//   { fieldName: "firstTransporter", label: "1st Transporter (First Mile)", id: "firstTransporter", type: "text" },
//   {
//     fieldName: "firstDocketNo",
//     label: "1st Docket No/ Vehicle Number (First Mile)",
//     id: "firstDocketNo",
//     type: "text",
//   },
//   { fieldName: "secondTransporter", label: "2nd Transporter (Mid Mile)", id: "secondTransporter", type: "text" },
//   {
//     fieldName: "secondDocketNo",
//     label: "2nd Docket No/ Vehicle Number (Mid Mile)",
//     id: "secondDocketNo",
//     type: "text",
//   },
//   { fieldName: "thirdTransporter", label: "3rd Transporter (Last Mile)", id: "thirdTransporter", type: "text" },
//   { fieldName: "thirdDocketNo", label: "3rd Docket No/ Vehicle Number (Last Mile)", id: "thirdDocketNo", type: "text" },
//   { fieldName: "appointmentLetter", label: "Appointment Letter/STN", id: "appointmentLetter", type: "text" },
//   { fieldName: "labelsLink", label: "Labels - Amazon/Flipkart (Link)", id: "labelsLink", type: "text" },
//   { fieldName: "invoiceDate", label: "Invoice Date", id: "invoiceDate", type: "date" },
//   { fieldName: "invoiceLink", label: "Invoice Link", id: "invoiceLink", type: "text" },
//   { fieldName: "cnLink", label: "CN Link", id: "cnLink", type: "text" },
//   { fieldName: "ewayLink", label: "E-Way Link", id: "ewayLink", type: "text" },
//   { fieldName: "invoiceValue", label: "Invoice Value (Check with Invoice Link)", id: "invoiceValue", type: "number" },
//   { fieldName: "remarksAccountsTeam", label: "Remarks by Accounts Team", id: "remarksAccountsTeam", type: "text" },
//   { fieldName: "invoiceChallanNumber", label: "Invoice / Challan Number", id: "invoiceChallanNumber", type: "text" },
//   { fieldName: "invoiceCheckedBy", label: "Invoice Checked By", id: "invoiceCheckedBy", type: "text" },
//   { fieldName: "tallyCustomerName", label: "Tally Customer Name", id: "tallyCustomerName", type: "text" },
//   { fieldName: "customerCode", label: "Customer Code", id: "customerCode", type: "text" },
//   { fieldName: "poEntryCount", label: "PO Entry Count", id: "poEntryCount", type: "number" },
//   { fieldName: "deliveryDate", label: "Delivery Date", id: "deliveryDate", type: "date" },
//   { fieldName: "rescheduleLag", label: "Reschedule Lag (Remarks)", id: "rescheduleLag", type: "number" },
//   { fieldName: "finalRemarks", label: "Final Remarks", id: "finalRemarks", type: "text" },
//   { fieldName: "updatedGmv", label: "Updated GMV", id: "updatedGmv", type: "number" },
//   { fieldName: "physicalWeight", label: "Physical Weight", id: "physicalWeight", type: "number" },
// ]

// Role-based field permissions
const adminFields = [
  "uid",
  "entryDate",
  "poDate",
  "facility",
  "channel",
  "location",
  "poNumber",
  "totalUnits",
  "brandName",
  "remarksPlanning",
  "specialRemarksCOPT",
  "newShipmentReference",
  "statusActive",
  "statusPlanning",
  "channelInwardingRemarks",
  "dispatchDateTentative",
  "workingDatePlanner",
  "firstAppointmentDateCOPT",
  "orderNo1",
  "orderNo2",
  "orderNo3",
  "poNumberInwardCWH",
  "channelType",
  "appointmentLetter",
  "labelsLink",
  "invoiceDate",
  "invoiceLink",
  "cnLink",
  "ewayLink",
  "invoiceValue",
  "remarksAccountsTeam",
  "invoiceChallanNumber",
  "invoiceCheckedBy",
  "tallyCustomerName",
  "customerCode",
  "poEntryCount",
  "updatedGmv",
]

const warehouseFields = [
  "statusWarehouse",
  "dispatchRemarksWarehouse",
  "rtsDate",
  "dispatchDate",
  "noOfBoxes",
  "pickListNo",
  "workingTypeWarehouse",
  "inventoryRemarksWarehouse",
  "b2bWorkingTeamRemarks",
  "actualWeight",
  "volumetricWeight",
  "firstTransporter",
  "firstDocketNo",
  "secondTransporter",
  "secondDocketNo",
  "thirdTransporter",
  "thirdDocketNo",
]

const logisticsFields = [
  "statusLogistics",
  "dispatchRemarksLogistics",
  "currentAppointmentDate",
  "deliveryDate",
  "rescheduleLag",
  "finalRemarks",
  "physicalWeight",
]

export default function EditShipmentModal({ isOpen, onClose, shipmentData, onSave }) {
  const [formData, setFormData] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [activeTab, setActiveTab] = useState("admin")
  const { user } = useUserStore()

  useEffect(() => {
    if (shipmentData) {
      // Convert date strings to Date objects for date fields
      const processedData = { ...shipmentData }
      shipmentStatusDataType.forEach((field) => {
        if (field.type === "date" && processedData[field.fieldName]) {
          const dateValue = processedData[field.fieldName]
          if (dateValue && dateValue !== "1900/01/00" && dateValue !== "") {
            try {
              // Handle different date formats
              let parsedDate
              if (dateValue.includes("/")) {
                const [year, month, day] = dateValue.split("/")
                parsedDate = new Date(Number.parseInt(year), Number.parseInt(month) - 1, Number.parseInt(day))
              } else if (dateValue.includes("-")) {
                parsedDate = new Date(dateValue)
              } else {
                parsedDate = new Date(dateValue)
              }

              if (!isNaN(parsedDate.getTime())) {
                processedData[field.fieldName] = parsedDate
              } else {
                processedData[field.fieldName] = undefined
              }
            } catch {
              processedData[field.fieldName] = undefined
            }
          } else {
            processedData[field.fieldName] = undefined
          }
        }
      })
      setFormData(processedData)
    }
  }, [shipmentData])

  // Set default tab based on user role
  useEffect(() => {
    if (user?.role === "warehouse") {
      setActiveTab("warehouse")
    } else if (user?.role === "logistics") {
      setActiveTab("logistics")
    } else {
      setActiveTab("admin")
    }
  }, [user])

  const handleInputChange = (fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      // Convert Date objects back to strings for saving
      const dataToSave = { ...formData }
      shipmentStatusDataType.forEach((field) => {
        if (field.type === "date" && dataToSave[field.fieldName] instanceof Date) {
          dataToSave[field.fieldName] = format(dataToSave[field.fieldName], "yyyy-MM-dd")
        }
      })

      console.log("Data to save:", dataToSave)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      onSave(dataToSave)
      setSuccess("Shipment updated successfully!")

      setTimeout(() => {
        onClose()
      }, 1500)
    } catch (err) {
      setError("Failed to update shipment")
    }

    setIsLoading(false)
  }

  const renderField = (field) => {
    const value = formData[field.fieldName]

    switch (field.type) {
      case "date":
        return (
          <div className="space-y-2">
            <Label htmlFor={field.id} className="text-sm font-medium">
              {field.label}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("w-full h-10 justify-start text-left font-normal", !value && "text-muted-foreground")}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {value ? format(value, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={value}
                  onSelect={(date) => handleInputChange(field.fieldName, date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        )

      case "select":
        return (
          <div className="space-y-2">
            <Label htmlFor={field.id} className="text-sm font-medium">
              {field.label}
            </Label>
            <Select value={value || " "} onValueChange={(newValue) => handleInputChange(field.fieldName, newValue)}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {field?.options?.map((option) => (
                  <SelectItem key={option} value={option || " "}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )

      case "number":
        return (
          <div className="space-y-2">
            <Label htmlFor={field.id} className="text-sm font-medium">
              {field.label}
            </Label>
            <Input
              id={field.id}
              type="number"
              value={value || ""}
              onChange={(e) => handleInputChange(field.fieldName, e.target.value)}
              className="h-10"
              step={field.fieldName.includes("Weight") ? "0.01" : "1"}
            />
          </div>
        )

      default:
        return (
          <div className="space-y-2">
            <Label htmlFor={field.id} className="text-sm font-medium">
              {field.label}
            </Label>
            <Input
              id={field.id}
              type="text"
              value={value || ""}
              onChange={(e) => handleInputChange(field.fieldName, e.target.value)}
              className="h-10"
            />
          </div>
        )
    }
  }

  const getFieldsByRole = (role) => {
    let allowedFields = []

    switch (role) {
      case "admin":
        allowedFields = adminFields
        break
      case "warehouse":
        allowedFields = warehouseFields
        break
      case "logistics":
        allowedFields = logisticsFields
        break
      default:
        allowedFields = adminFields
    }

    return shipmentStatusDataType.filter((field) => allowedFields.includes(field.fieldName))
  }

  const getAvailableTabs = () => {
    const tabs = []

    if (user?.role === "superadmin" ) {
      tabs.push(
        { value: "admin", label: "Admin", icon: Shield, count: adminFields.length },
        { value: "warehouse", label: "Warehouse", icon: Warehouse, count: warehouseFields.length },
        { value: "logistics", label: "Logistics", icon: Truck, count: logisticsFields.length },
      )
    } else if (user?.role === "admin") {
      tabs.push({ value: "admin", label: "Admin", icon: Shield, count: adminFields.length })
    } else if (user?.role === "warehouse") {
      tabs.push({ value: "warehouse", label: "Warehouse", icon: Warehouse, count: warehouseFields.length })
    } else if (user?.role === "logistics") {
      tabs.push({ value: "logistics", label: "Logistics", icon: Truck, count: logisticsFields.length })
    }

    return tabs
  }

  const availableTabs = getAvailableTabs()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Save className="h-5 w-5" />
            <span>Edit Shipment</span>
          </DialogTitle>
          <DialogDescription>Update shipment information based on your role permissions</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-6">
              {availableTabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <TabsTrigger key={tab.value} value={tab.value} className="flex items-center space-x-2">
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                    <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">{tab.count}</span>
                  </TabsTrigger>
                )
              })}
            </TabsList>

            {availableTabs.map((tab) => (
              <TabsContent key={tab?.value} value={tab?.value}>
                <ScrollArea className="max-h-[60vh] pr-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh]">
                    {getFieldsByRole(tab?.value).map((field) => (
                      <div key={field?.fieldName}>{renderField(field)}</div>
                    ))}
                  </div>
                  <ScrollBar orientation="vertical" />
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        <div className="flex justify-end space-x-4 pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
