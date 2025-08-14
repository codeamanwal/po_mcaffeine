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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, AlertCircle, CheckCircle, Save, X, Shield, Warehouse, Truck, Lock, Server } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useUserStore } from "@/store/user-store"
import { shipmentStatusDataType } from "@/constants/data_type"
import { updateShipment } from "@/lib/order"

// Extended shipment data type with new appointment fields
const extendedShipmentStatusDataType = [
  ...shipmentStatusDataType,
  { fieldName: "firstAppointmentDate", label: "First Appointment Date", id: "firstAppointmentDate", type: "date" },
  { fieldName: "secondAppointmentDate", label: "Second Appointment Date", id: "secondAppointmentDate", type: "date" },
  { fieldName: "thirdAppointmentDate", label: "Third Appointment Date", id: "thirdAppointmentDate", type: "date" },
  { fieldName: "remarkAp1", label: "First Appointment Remark", id: "remarkAp1", type: "text" },
  { fieldName: "remarkAp2", label: "Second Appointment Remark", id: "remarkAp2", type: "text" },
  { fieldName: "remarkAp3", label: "Third Appointment Remark", id: "remarkAp3", type: "text" },
]

// Role-based field permissions
const adminFields = [
  // "uid",
  "entryDate",
  "poDate",
  "facility",
  "channel",
  "location",
  "poNumber",
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
  "currentAppointmentDate", // Read-only field
  "firstAppointmentDate",
  "secondAppointmentDate",
  "thirdAppointmentDate",
  "remarkAp1",
  "remarkAp2",
  "remarkAp3",
  "deliveryDate",
  "rescheduleLag",
  "finalRemarks",
  "physicalWeight",
]

export default function EditShipmentModal({ isOpen, onClose, shipmentData, onSave }) {
  const [formData, setFormData] = useState({})
  const [originalData, setOriginalData] = useState({}) // Store original data to check if appointment dates were already filled
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [activeTab, setActiveTab] = useState("admin")
  const { user } = useUserStore()

  useEffect(() => {
    if (shipmentData) {
      // Convert date strings to Date objects for date fields
      const processedData = { ...shipmentData }
      extendedShipmentStatusDataType.forEach((field) => {
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
      setOriginalData(processedData) // Store original data
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
      extendedShipmentStatusDataType.forEach((field) => {
        if (field.type === "date" && dataToSave[field.fieldName] instanceof Date) {
          dataToSave[field.fieldName] = format(dataToSave[field.fieldName], "yyyy-MM-dd")
        }
      })

      console.log("New Shipment Data:", dataToSave)

      const res = await updateShipment(dataToSave)
      setSuccess("Shipment updated successfully!")
      console.log("Shipment updated successfully:", res.data)
      onSave()
      setSuccess("Shipment updated successfully!")
    } catch (err) {
      console.error("Error: ", err)
      setError("Failed to update shipment", err.message || err)
    }

    setIsLoading(false)
  }

  // Check if field is backend-controlled (like currentAppointmentDate)
  const isBackendControlledField = (fieldName) => {
    return fieldName === "currentAppointmentDate"
  }

  // Check if field is a sequential appointment date field
  const isSequentialAppointmentField = (fieldName) => {
    return ["firstAppointmentDate", "secondAppointmentDate", "thirdAppointmentDate"].includes(fieldName)
  }

  // Get the next available appointment date field that can be edited
  const getNextAvailableAppointmentField = () => {
    const hasFirstAppointment = formData.firstAppointmentDate && formData.firstAppointmentDate !== ""
    const hasSecondAppointment = formData.secondAppointmentDate && formData.secondAppointmentDate !== ""
    const hasThirdAppointment = formData.thirdAppointmentDate && formData.thirdAppointmentDate !== ""

    if (!hasFirstAppointment) {
      return "firstAppointmentDate"
    } else if (!hasSecondAppointment) {
      return "secondAppointmentDate"
    } else if (!hasThirdAppointment) {
      return "thirdAppointmentDate"
    }
    return null // All appointments are filled
  }

  // Check if appointment date field should be editable
  const isAppointmentDateEditable = (fieldName) => {
    if (!isSequentialAppointmentField(fieldName)) return true // Not an appointment field, so editable
    const nextAvailable = getNextAvailableAppointmentField()
    return nextAvailable === fieldName
  }

  // Check if appointment date is filled and locked
  const isAppointmentDateFilled = (fieldName) => {
    if (!isSequentialAppointmentField(fieldName)) return false // Not an appointment field
    return formData[fieldName] && formData[fieldName] !== ""
  }

  // Check if remark field should be enabled (only when corresponding appointment date has data)
  const isRemarkFieldEnabled = (remarkField) => {
    const appointmentFieldMap = {
      remarkAp1: "firstAppointmentDate",
      remarkAp2: "secondAppointmentDate",
      remarkAp3: "thirdAppointmentDate",
    }

    const correspondingAppointmentField = appointmentFieldMap[remarkField]
    return formData[correspondingAppointmentField] && formData[correspondingAppointmentField] !== ""
  }

  const renderField = (field) => {
    const value = formData[field.fieldName]
    const isSequentialAppointment = isSequentialAppointmentField(field.fieldName)
    const isRemarkField = ["remarkAp1", "remarkAp2", "remarkAp3"].includes(field.fieldName)
    const isBackendControlled = isBackendControlledField(field.fieldName)
    const isRemarkDisabled = isRemarkField && !isRemarkFieldEnabled(field.fieldName)

    // For sequential appointment dates: check if it's editable based on sequence
    const isAppointmentEditable = isSequentialAppointment ? isAppointmentDateEditable(field.fieldName) : true
    const isAppointmentFilled = isSequentialAppointment ? isAppointmentDateFilled(field.fieldName) : false
    const isAppointmentDisabled = isSequentialAppointment && !isAppointmentEditable && !isAppointmentFilled

    switch (field.type) {
      case "date":
        // For regular date fields (not sequential appointments), they should be fully editable
        const isRegularDateField = !isSequentialAppointment && !isBackendControlled
        const shouldDisableDate =
          isBackendControlled || (isSequentialAppointment && (isAppointmentFilled || isAppointmentDisabled))

        return (
          <div className="space-y-2">
            <Label htmlFor={field.id} className="text-sm font-medium flex items-center gap-2">
              {field.label}
              {isAppointmentFilled && <Lock className="h-3 w-3 text-gray-500" />}
              {isBackendControlled && <Server className="h-3 w-3 text-blue-500" />}
              {/* {isAppointmentDisabled && (
                <span className="text-xs text-gray-500">(Waiting for previous appointment)</span>
              )} */}
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  disabled={shouldDisableDate}
                  className={cn(
                    "w-full h-10 justify-start text-left font-normal",
                    !value && "text-muted-foreground",
                    shouldDisableDate && "opacity-60 cursor-not-allowed bg-gray-50",
                    isBackendControlled && "border-blue-200 bg-blue-50",
                    isAppointmentDisabled && "border-gray-200 bg-gray-50",
                    isSequentialAppointment &&
                      isAppointmentEditable &&
                      !isAppointmentFilled &&
                      "border-green-200 bg-green-50",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {value ? format(value, "PPP") : "Pick a date"}
                  {isAppointmentFilled && <Lock className="ml-auto h-3 w-3" />}
                  {isBackendControlled && <Server className="ml-auto h-3 w-3 text-blue-500" />}
                </Button>
              </PopoverTrigger>
              {!shouldDisableDate && (
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={value}
                    onSelect={(date) => handleInputChange(field.fieldName, date)}
                    initialFocus
                  />
                </PopoverContent>
              )}
            </Popover>
            {/* {isAppointmentFilled && (
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <Lock className="h-3 w-3" />
                This appointment date is locked and cannot be changed
              </p>
            )} */}
            {/* {isBackendControlled && (
              <p className="text-xs text-blue-600 flex items-center gap-1">
                <Server className="h-3 w-3" />
                This field is automatically updated by the system
              </p>
            )} */}
            {/* {isAppointmentDisabled && (
              <p className="text-xs text-gray-500">Complete the previous appointment date first to enable this field</p>
            )} */}
            {isSequentialAppointment && isAppointmentEditable && !isAppointmentFilled && (
              <p className="text-xs text-green-600">This is the next available appointment date to fill</p>
            )}
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
            <Label htmlFor={field.id} className="text-sm font-medium flex items-center gap-2">
              {field.label}
              {/* {isRemarkDisabled && <span className="text-xs text-gray-500">(Requires appointment date)</span>} */}
            </Label>
            <Input
              id={field.id}
              type="text"
              value={value || ""}
              disabled={isRemarkDisabled}
              onChange={(e) => handleInputChange(field.fieldName, e.target.value)}
              className={cn("h-10", isRemarkDisabled && "opacity-60 cursor-not-allowed bg-gray-50")}
              placeholder={isRemarkDisabled ? "Fill appointment date first" : ""}
            />
            {/* {isRemarkDisabled && (
              <p className="text-xs text-gray-500">
                corresponding appointment date is not filled
              </p>
            )} */}
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

    return extendedShipmentStatusDataType.filter((field) => allowedFields.includes(field.fieldName))
  }

  const getAvailableTabs = () => {
    const tabs = []

    if (user?.role === "superadmin") {
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
