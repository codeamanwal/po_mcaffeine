"use client"

import { useState, useEffect, useMemo } from "react"
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
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getLocationsForChannel, validateShipmentData } from "@/lib/validation"
import {
  CalendarIcon,
  AlertCircle,
  CheckCircle,
  Save,
  X,
  Shield,
  Warehouse,
  Truck,
  Server,
  Plus,
  Lock,
  Clock,
  AlertTriangle,
  User, History, Loader2, Pen
} from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useUserStore } from "@/store/user-store"
import { shipmentStatusDataType } from "@/constants/data_type"
import { updateShipment } from "@/lib/order"
import { getLogsOfShipment } from '@/lib/order'
import { toast } from "sonner"
import SearchableSelect from "./ui/searchable-select"

import {master_appointment_change_options} from "@/constants/master_sheet"
import SkuLevelEditModal from "./sku-level-edit-modal"
import LogisticsCost from "./logistics-cost"
import { getTAT } from "@/constants/courier-partners"

// Master reasons for editing PO Number
const PO_EDIT_REASONS = [
  "Correction from brand/supplier",
  "System error correction",
  "Channel requirement change",
  "Duplicate PO number conflict",
  "Format standardization",
  "Customer request modification",
  "Data migration correction",
  "Other (specify in comments)",
]

// Extended shipment data type with dynamic appointment fields
const extendedShipmentStatusDataType = [
  ...shipmentStatusDataType,
  {
    fieldName: "allAppointmentDate",
    label: "Previous Appointments",
    id: "allAppointmentDate",
    type: "appointment_display",
  },
  {
    fieldName: "newAppointmentDate",
    label: "Add New Appointment Date",
    id: "newAppointmentDate",
    type: "new_appointment_date",
  },
  {
    fieldName: "newAppointmentRemark",
    label: "New Appointment Remark",
    id: "newAppointmentRemark",
    type: "new_appointment_remark",
  },
]

// Role-based field permissions
const adminFields = [
  "facility",
  "channel",
  "location",
  "poNumber",
  "remarksPlanning",
  "specialRemarksCOPT",
  "statusActive",
  "statusPlanning",
  "channelInwardingRemarks",
  "dispatchDateTentative",
  "workingDatePlanner",
  // "productWeight",
  "firstAppointmentDateCOPT",
  "orderNo1",
  "orderNo2",
  "orderNo3",
  "poNumberInwardCWH",
  "channelType",
  "labelsLink",
  "invoiceValue",
  "document",
]

const warehouseFields = [
  "statusWarehouse",
  "dispatchRemarksWarehouse",
  "rtsDate",
  "dispatchDate",
  "noOfBoxes",
  "pickListNo",
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
  "proofOfDispatch",
]

const logisticsFields = [
  "statusLogistics",
  "dispatchRemarksLogistics",
  "currentAppointmentDate",
  "allAppointmentDate",
  "newAppointmentDate",
  "newAppointmentRemark",
  "deliveryDate",
  "rescheduleLag",
  "finalRemarks",
  "physicalWeight",
  "tentativeDeliveryDate",
  "deliveryCharges",
  "halting",
  "unloadingCharges",
  "dedicatedVehicle",
  "otherCharges",
  "proofOfDelivery",
  "tat",
  "criticalDispatchDate",
  "rpk",
]

const getFieldLabel = (key) => {
    if(!key) return "";
    const labelMap = {
      uid: 'UID',
      entryDate: 'Entry Date',
      poDate: 'PO Date',
      facility: 'Facility',
      channel: 'Channel',
      location: 'Location',
      poNumber: 'PO Number',
      brandName: 'Brand Name',
      remarksPlanning: 'Planning Remarks',
      specialRemarksCOPT: 'Special Remarks (COPT)',
      newShipmentReference: 'Shipment Reference',
      statusActive: 'Active Status',
      statusPlanning: 'Planning Status',
      statusWarehouse: 'Warehouse Status',
      statusLogistics: 'Logistics Status',
      channelInwardingRemarks: 'Channel Inwarding Remarks',
      dispatchRemarksLogistics: 'Dispatch Remarks (Logistics)',
      dispatchRemarksWarehouse: 'Dispatch Remarks (Warehouse)',
      dispatchDateTentative: 'Tentative Dispatch Date',
      workingDatePlanner: 'Working Date (Planner)',
      rtsDate: 'RTS Date',
      dispatchDate: 'Dispatch Date',
      currentAppointmentDate: 'Current Appointment Date',
      // firstAppointmentDateCOPT: 'First Appointment Date (COPT)',
      noOfBoxes: 'Number of Boxes',
      orderNo1: 'Order No 1',
      orderNo2: 'Order No 2',
      orderNo3: 'Order No 3',
      pickListNo: 'Pick List No',
      workingTypeWarehouse: 'Working Type (Warehouse)',
      inventoryRemarksWarehouse: 'Inventory Remarks (Warehouse)',
      b2bWorkingTeamRemarks: 'B2B Working Team Remarks',
      volumetricWeight: 'Volumetric Weight',
      channelType: 'Channel Type',
      firstTransporter: 'First Transporter',
      firstDocketNo: 'First Docket No',
      secondTransporter: 'Second Transporter',
      secondDocketNo: 'Second Docket No',
      thirdTransporter: 'Third Transporter',
      thirdDocketNo: 'Third Docket No',
      appointmentLetter: 'Appointment Letter/STN',
      labelsLink: 'Labels Link',
      invoiceDate: 'Invoice Date',
      invoiceLink: 'Invoice Link',
      cnLink: 'CN Link',
      ewayLink: 'E-Way Link',
      invoiceValue: 'Invoice Value',
      remarksAccountsTeam: 'Accounts Team Remarks',
      invoiceChallanNumber: 'Invoice/Challan Number',
      invoiceCheckedBy: 'Invoice Checked By',
      tallyCustomerName: 'Tally Customer Name',
      customerCode: 'Customer Code',
      poEntryCount: 'PO Entry Count',
      temp: 'Temporary',
      deliveryDate: 'Delivery Date',
      rescheduleLag: 'Reschedule Lag',
      finalRemarks: 'Final Remarks',
      updatedGmv: 'Updated GMV',
      physicalWeight: 'Physical Weight'
    }
    return labelMap[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
}

const fetchShipmentLogs = async (shipmentId) => {
  // await new Promise(resolve => setTimeout(resolve, 800))
  const logs = await getLogsOfShipment(shipmentId)
  // console.log(logs?.data?.logs.messages);
  const logContent = logs?.data?.logs.messages;
  return logContent;
}

export default function EditShipmentModal({ isOpen, onClose, shipmentData, onSave }) {

  const [logs, setLogs] = useState([])
  const [logsLoading, setLogsLoading] = useState(false)
  
  const fetchLogData = async () => {
    if(!shipmentData.uid){
      return ;
    }
    try {
      setLogsLoading(true)
    //   setShipmentData(shipment)
      const logsData = await fetchShipmentLogs(shipmentData.uid);
      console.log(logsData);
      setLogs(logsData)
    } catch (err) {
      setError('Failed to fetch shipment data')
      console.error('Error fetching shipment data:', err)
    } finally {
      setLogsLoading(false)
    }
  }
  useEffect(() => {
    fetchLogData();
    console.log("shipmentData: ",shipmentData)
  },[shipmentData])

  const [skuTabActive, setSkuTab] = useState(false)

  const [formData, setFormData] = useState({})
  const [originalData, setOriginalData] = useState({})
  const [appointments, setAppointments] = useState([])
  const [newAppointmentDate, setNewAppointmentDate] = useState(null)
  const [newAppointmentRemark, setNewAppointmentRemark] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [activeTab, setActiveTab] = useState("admin")
  const [validationErrors, setValidationErrors] = useState([])

  // PO Number change tracking
  const [poNumberChanged, setPoNumberChanged] = useState(false)
  const [poEditReason, setPoEditReason] = useState("")
  const [poEditComments, setPoEditComments] = useState("")

  const [locationOtions, setLocationOptions] = useState([])
  const getLocations = (channel) => {
    if(!channel) return [];
      const locations = getLocationsForChannel(channel);
      setLocationOptions(locations);
  }

  const { user } = useUserStore()

   const appointmentRemarkOptions = useMemo(() => master_appointment_change_options.map((remark) => (
  { 
    value: remark.remark,
    label: `${remark.remark}`,
  })), [])

  useEffect(() => {
    if (shipmentData) {
      setSuccess("")
      setError("")
      setValidationErrors([])
      // Reset PO edit tracking
      setPoNumberChanged(false)
      setPoEditReason("")
      setPoEditComments("")

      // Convert date strings to Date objects for date fields
      const processedData = { ...shipmentData }
      console.log(processedData);

      getLocations(shipmentData.channel)

      // Process regular date fields
      extendedShipmentStatusDataType.forEach((field) => {
        if (field.type === "date" && field.fieldName in processedData) {
          const dateValue = processedData[field.fieldName]
          if (dateValue && typeof dateValue === "string" && dateValue !== "1900/01/00" && dateValue.trim() !== "") {
            try {
              let parsedDate
              if (dateValue.includes("/")) {
                const [year, month, day] = dateValue.split("/")
                parsedDate = new Date(Number.parseInt(year), Number.parseInt(month) - 1, Number.parseInt(day))
              } else if (dateValue.includes("-")) {
                const [day, month, year] = dateValue.split("-")
                parsedDate = new Date(Number.parseInt(year), Number.parseInt(month) - 1, Number.parseInt(day))
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

      // Process appointment arrays from the database structure
      const appointmentDates = processedData.allAppointmentDate || []
      const appointmentRemarks = processedData.appointmentRemarks || []

      // Convert appointment dates to Date objects and pair with remarks
      const processedAppointments = appointmentDates
        .map((dateStr, index) => {
          let parsedDate = null
          if (dateStr && typeof dateStr === "string" && dateStr !== "1900/01/00" && dateStr.trim() !== "") {
            try {
              if (dateStr.includes("-")) {
                const [day, month, year] = dateStr.split("-")
                parsedDate = new Date(Number.parseInt(year), Number.parseInt(month) - 1, Number.parseInt(day))
              } else if (dateStr.includes("/")) {
                const [year, month, day] = dateStr.split("/")
                parsedDate = new Date(Number.parseInt(year), Number.parseInt(month) - 1, Number.parseInt(day))
              } else {
                parsedDate = new Date(dateStr)
              }

              if (isNaN(parsedDate.getTime())) {
                parsedDate = null
              }
            } catch {
              parsedDate = null
            }
          }

          return {
            id: index,
            date: parsedDate,
            remark: appointmentRemarks[index] || `Appointment ${index + 1}`,
            isFirst: index === 0,
          }
        })
        .filter((apt) => apt.date !== null)

      setAppointments(processedAppointments)
      setFormData(processedData)
      setOriginalData(processedData)
    }
  }, [shipmentData])

  useEffect(() => {
    getLocations(formData.channel)
  }, [formData])

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

  // Validate form data when it changes
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      const validation = validateShipmentData(formData)
      setValidationErrors(validation.errors)
    }
  }, [formData])

  const handleInputChange = (fieldName, value) => {
    // Check if PO Number is being changed by admin/superadmin
    if (fieldName === "poNumber" && (user?.role === "admin" || user?.role === "superadmin")) {
      const originalPoNumber = originalData.poNumber || ""
      const newPoNumber = value || ""
      const oldPoNumbers = originalData.poNumbers || [];

      if (originalPoNumber !== newPoNumber) {
        setPoNumberChanged(true)
        setFormData((prev) => ({
          ...prev,
          poNumbers: [...oldPoNumbers, originalData.poNumber],
          [fieldName]: value,
        }))
      } else {
        setPoNumberChanged(false)
        setPoEditReason("")
        setPoEditComments("")
      }
    }
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }))
  }

  const getCurrentAppointmentDate = () => {
    const validAppointments = appointments.filter((apt) => apt.date !== null)
    if (validAppointments.length === 0) return null

    return validAppointments.reduce((latest, current) => {
      if (!latest.date) return current
      return current.date > latest.date ? current : latest
    })
  }

  const validatePoNumberEdit = () => {
    if (poNumberChanged && !poEditReason) {
      return "Please select a reason for changing the PO Number"
    }
    return null
  }

  const handleSave = async () => {
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      // Validate PO Number edit reason
      const poValidationError = validatePoNumberEdit()
      if (poValidationError) {
        setError(poValidationError)
        setIsLoading(false)
        return
      }

      // Validate new appointment if partially filled
      if(formData.firstAppointmentDateCOPT !== originalData.firstAppointmentDateCOPT){
        // let newAppDate = format(formData.firstAppointmentDateCOPT, "dd-MM-yyyy");
        formData.currentAppointmentDate = formData.firstAppointmentDateCOPT
      }

      if (newAppointmentDate && !newAppointmentRemark.trim()) {
        setError("Remark is required when adding a new appointment date")
        setIsLoading(false)
        return
      }

      if (!newAppointmentDate && newAppointmentRemark.trim()) {
        setError("Appointment date is required when adding a remark")
        setIsLoading(false)
        return
      }

      // Validate shipment data using validation utility
      const validation = validateShipmentData(formData)
      if (!validation.isValid) {
        setError(`Validation errors: ${validation.errors.join(", ")}`)
        setIsLoading(false)
        return
      }

      // Convert Date objects back to strings for saving
      const dataToSave = { ...formData }

      // Add PO edit audit information if PO was changed
      if (poNumberChanged && poEditReason) {
        dataToSave.poEditAudit = {
          originalPoNumber: originalData.poNumber,
          newPoNumber: formData.poNumber,
          reason: poEditReason,
          comments: poEditComments,
          editedBy: user?.email,
          editedAt: new Date().toISOString(),
        }
      }

      // Process regular date fields
      extendedShipmentStatusDataType.forEach((field) => {
        if (field.type === "date" && dataToSave[field.fieldName] instanceof Date) {
          dataToSave[field.fieldName] = format(dataToSave[field.fieldName], "dd-MM-yyyy")
        }
      })

      // Handle appointments
      let finalAppointmentDates = []
      let finalAppointmentRemarks = []

      if (appointments.length > 0) {
        finalAppointmentDates = appointments.map((apt) => format(apt.date, "dd-MM-yyyy"))
        finalAppointmentRemarks = appointments.map((apt) => apt.remark)
      }

      if (newAppointmentDate && newAppointmentRemark.trim()) {
        finalAppointmentDates.push(format(newAppointmentDate, "dd-MM-yyyy"))
        finalAppointmentRemarks.push(newAppointmentRemark.trim())
        dataToSave.currentAppointmentDate = format(newAppointmentDate, "dd-MM-yyyy")
      } else if (appointments.length > 0) {
        const currentAppointment = getCurrentAppointmentDate()
        if (currentAppointment) {
          dataToSave.currentAppointmentDate = format(currentAppointment.date, "dd-MM-yyyy")
        }
      }

      dataToSave.allAppointmentDate = finalAppointmentDates
      dataToSave.appointmentRemarks = finalAppointmentRemarks

      const res = await updateShipment(dataToSave)
      setSuccess("Shipment updated successfully!")
      onSave()
      toast.success("Shipment updated successfully!")

      // Reset fields after successful save
      setNewAppointmentDate(null)
      setNewAppointmentRemark("")
      setPoNumberChanged(false)
      setPoEditReason("")
      setPoEditComments("")
    } catch (err) {
      console.error("Error: ", err)
      setError("Failed to update shipment: " + (err.message || err))
      toast.error("Failed to update shipment: " + (err.message || err))
    } finally{
      setSuccess("")
      setError("")
      setIsLoading(false)
    }

    
  }

  // Check if field is backend-controlled
  const isBackendControlledField = (fieldName) => {
    if (fieldName === "currentAppointmentDate") return true
    if (fieldName === "deliveryDate" && originalData["statusLogistics"] !== "Delivered") return true
    return false
  }

  const renderField = (field) => {
    let value = formData[field.fieldName]
    let isBackendControlled = isBackendControlledField(field.fieldName)
    const isPoNumberField = field.fieldName === "poNumber"
    const needsPoReason = isPoNumberField && poNumberChanged && (user?.role === "admin" || user?.role === "superadmin")
    const hasValidationError = validationErrors.some((error) => error.toLowerCase().includes(field.label.toLowerCase()))

    // Handle appointment display
    // if(field.fieldName === "firstAppointmentDateCOPT") {
    //   if(originalData["firstAppointmentDateCOPT"]){
    //     isBackendControlled = true;
    //     return;
    //   }
    // }
    if (field.type === "appointment_display") {
      return (
        <div className="space-y-2 md:col-span-4">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {field.label} ({appointments.length} total)
          </Label>
          <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-900 max-h-40 overflow-y-auto">
            {appointments.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No appointments scheduled yet</p>
            ) : (
              <div className="space-y-3">
                {appointments.map((appointment, index) => (
                  <div
                    key={appointment.id}
                    className="flex items-start justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border"
                  >
                    <div className="flex items-center gap-3">
                      <Lock className="h-4 w-4 text-gray-400 mt-0.5" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{format(appointment.date, "dd MMM yyyy")}</span>
                          <Badge variant={appointment.isFirst ? "default" : "secondary"} className="text-xs">
                            {appointment.isFirst ? "First" : `#${index + 1}`}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{format(appointment.date, "EEEE, dd MMMM yyyy")}</p>
                      </div>
                    </div>
                    <div className="text-right max-w-xs">
                      <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">{appointment.remark}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Added {appointment.isFirst ? "initially" : `as appointment ${index + 1}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )
    }

    // Handle new appointment date
    if (field.type === "new_appointment_date") {
      return (
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Plus className="h-4 w-4 text-green-600" />
            {field.label}
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full h-10 justify-start text-left font-normal",
                  !newAppointmentDate && "text-muted-foreground",
                  "border-green-200 hover:border-green-300",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {newAppointmentDate ? format(newAppointmentDate, "dd MMM yyyy") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={newAppointmentDate} onSelect={setNewAppointmentDate} initialFocus />
            </PopoverContent>
          </Popover>
          <p className="text-xs text-green-600">Add one new appointment at a time</p>
        </div>
      )
    }

    // Handle new appointment remark
    if (field.type === "new_appointment_remark") {
      return (
        <div className="space-y-2">
          <Label className="text-sm font-medium flex items-center gap-2">
            {field.label}
            <span className="text-red-500">*</span>
          </Label>
          <SearchableSelect
              value={newAppointmentRemark}
              onValueChange={(value) => setNewAppointmentRemark(value)}
              options={appointmentRemarkOptions}
              placeholder="Select remark"
              searchPlaceholder="Search remarks..."
          />
          <p className="text-xs text-gray-500">Remark is mandatory for new appointments</p>
        </div>
      )
    }

    // handle dynamic availble locations
    // if(field.fieldName === "location"){
      
    //   return (
    //       <div className="space-y-2">
    //         <Label htmlFor={field.id} className="text-sm font-medium flex items-center gap-2">
    //           {field.label}
    //           {hasValidationError && <AlertTriangle className="h-3 w-3 text-red-500" />}
    //         </Label>
    //         <Select disabled={true} value={value || " "} onValueChange={(newValue) => handleInputChange(field.fieldName, newValue)}>
    //           <SelectTrigger className={cn("h-10", hasValidationError && "border-red-300 bg-red-50")}>
    //             <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
    //           </SelectTrigger>
    //           <SelectContent>
    //             {locationOtions?.map((location, idx) => (
    //               <SelectItem key={idx} value={location.location}>
    //                 {`${location.location} - ${location.drop_location}`}
    //               </SelectItem>
    //             ))}
    //           </SelectContent>
    //         </Select>
    //       </div>
    //     )
    // }

    if(field.fieldName === "physicalWeight"){
      let val = value;
      if(!value){
        val = formData["actualWeight"];
      }
        return (
          <div className="space-y-2">
            <Label htmlFor={field.id} className="text-sm font-medium flex items-center gap-2">
              {field.label}
              {hasValidationError && <AlertTriangle className="h-3 w-3 text-red-500" />}
            </Label>
            <Input
              id={field.id}
              type="number"
              value={value ?? formData["actualWeight"] ?? 0}
              onChange={(e) => handleInputChange(field.fieldName, e.target.value)}
              className={cn(
                "h-10",
                needsPoReason && !poEditReason && "border-red-300 bg-red-50",
                hasValidationError && "border-red-300 bg-red-50",
              )}
              step={field.fieldName.includes("Weight") ? "0.01" : "1"}
            />
            {needsPoReason && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Reason required for PO Number change
              </p>
            )}
          </div>
        )
    }

    if (field.fieldName === 'criticalDispatchDate') {
      const tat = getTAT(formData.firstTransporter) ?? 0; // TAT in days
      const cad = formData?.currentAppointmentDate;

      if (cad instanceof Date && !isNaN(cad)) {
        value = new Date(cad?.getTime() - tat * 24 * 60 * 60 * 1000);

        // console.log("cad:", cad?.toISOString());
        // console.log("cdd:", value?.toISOString()); 
      } else {
        // console.log("Invalid currentAppointmentDate:", cad);
      }
    }


    switch (field.type) {
      case "date":
        let shouldDisableDate = isBackendControlled ||  field.fieldName === "criticalDispatchDate" ? true : false;
        if(field.fieldName === "firstAppointmentDateCOPT" && originalData["firstAppointmentDateCOPT"]){
          shouldDisableDate = true;
        }

        return (
          <div className="space-y-2">
            <Label htmlFor={field.id} className="text-sm font-medium flex items-center gap-2">
              {field.label}
              {hasValidationError && <AlertTriangle className="h-3 w-3 text-red-500" />}
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
                    hasValidationError && "border-red-300 bg-red-50",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {value ? format(value, "PPP"): "Pick a date"}
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
          </div>
        )

      case "select":
        return (
          <div className="space-y-2">
            <Label htmlFor={field.id} className="text-sm font-medium flex items-center gap-2">
              {field.label}
              {hasValidationError && <AlertTriangle className="h-3 w-3 text-red-500" />}
            </Label>
            <Select disabled={["location" ,"channel"].includes(field.fieldName)} value={value} onValueChange={(newValue) => handleInputChange(field.fieldName, newValue)}>
              <SelectTrigger className={cn("h-10", hasValidationError && "border-red-300 bg-red-50")}>
                <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {field?.options?.map((option,idx) => (
                  <SelectItem key={idx} value={option || " "}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )

      case "number":
        let val = value;
        if(field.fieldName === "tat")
          val = getTAT(shipmentData.firstTransporter)
        return (
          <div className="space-y-2">
            <Label htmlFor={field.id} className="text-sm font-medium flex items-center gap-2">
              {field.label}
              {hasValidationError && <AlertTriangle className="h-3 w-3 text-red-500" />}
            </Label>
            <Input
              id={field.id}
              disabled={field.fieldName === "tat" ? true : false}
              type="number"
              value={val || ""}
              onChange={(e) => handleInputChange(field.fieldName, e.target.value)}
              className={cn(
                "h-10",
                needsPoReason && !poEditReason && "border-red-300 bg-red-50",
                hasValidationError && "border-red-300 bg-red-50",
              )}
              step={field.fieldName.includes("Weight") ? "0.01" : "1"}
            />
            {needsPoReason && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Reason required for PO Number change
              </p>
            )}
          </div>
        )

      case "file":
        return (
           <div className="space-y-2">
          <Label htmlFor={field.id} className="text-sm font-medium flex items-center gap-2">
              {field.label}
          </Label>
          <Input
            id={field.id}
            type="file"
            value={value || ""}
            onChange={(e) => handleInputChange(field.fieldName, e.target.value)}
            className={cn(
              "h-10",
              needsPoReason && !poEditReason && "border-red-300 bg-red-50",
              hasValidationError && "border-red-300 bg-red-50",
            )}
          />
          </div>
        )

      default:
        return (
          <div className="space-y-2">
            <Label htmlFor={field.id} className="text-sm font-medium flex items-center gap-2">
              {field.label}
              {hasValidationError && <AlertTriangle className="h-3 w-3 text-red-500" />}
            </Label>
            <Input
              id={field.id}
              type="text"
              disabled={["location" ,"channel"].includes(field.fieldName)}
              value={value || ""}
              onChange={(e) => handleInputChange(field.fieldName, e.target.value)}
              className={cn(
                "h-10",
                needsPoReason && !poEditReason && "border-red-300 bg-red-50",
                hasValidationError && "border-red-300 bg-red-50",
              )}
            />
            {needsPoReason && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Reason required for PO Number change
              </p>
            )}
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

    if (user?.role === "superadmin" || user?.role === "admin") {
      tabs.push(
        { value: "admin", label: "Admin", icon: Shield, count: adminFields.length },
        { value: "warehouse", label: "Warehouse", icon: Warehouse, count: warehouseFields.length },
        { value: "logistics", label: "Logistics", icon: Truck, count: logisticsFields.length },
        // { value: "logistics-cost", label: "Logistics Costs", icon: User, count:0},
      )
    // } else if (user?.role === "admin") {
      // tabs.push({ value: "admin", label: "Admin", icon: Shield, count: adminFields.length })
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
      <DialogContent className="max-w-[85vw] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Save className="h-5 w-5" />
            <span>Edit Shipment</span>
          </DialogTitle>
          <DialogDescription>
            Update shipment information with validation based on your role permissions
          </DialogDescription>
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

          {validationErrors.length > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="font-medium mb-1">Validation Issues:</div>
                <ul className="text-sm list-disc list-inside space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full flex md:flex-row justify-around items-center mb-6">
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
              <TabsTrigger value={"sku"} className="flex items-center space-x-2">
                {/* <Icon className="h-4 w-4" /> */}
                <span>Sku Update</span>
                {/* <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded"></span> */}
              </TabsTrigger> 
              {
                user?.role === "superadmin" || user?.role === "logistics" ? 
                (<TabsTrigger value={"logistics-cost"} className="flex items-center space-x-2">
                  {/* <Icon className="h-4 w-4" /> */}
                  <span>Logistics Costs</span>
                  {/* <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded"></span> */}
                </TabsTrigger>) : (<></>)
              } 
              <TabsTrigger value={"logs"} className="flex items-center space-x-2">
                  {/* <Icon className="h-4 w-4" /> */}
                  <span>Change Logs</span>
                  {/* <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded"></span> */}
              </TabsTrigger>
            </TabsList>

            {availableTabs.map((tab) => (
              <TabsContent key={tab?.value} value={tab?.value}>
                <ScrollArea className="max-h-[60vh] pr-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-h-[60vh]">
                    {getFieldsByRole(tab?.value).map((field) => (
                      <div
                        key={field?.fieldName}
                        className={field.type === "appointment_display" ? "col-span-1 md:col-span-2 lg:col-span-4" : ""}
                      >
                        {renderField(field)}
                      </div>
                    ))}
                  </div>
                  <ScrollBar orientation="vertical" />
                </ScrollArea>
              </TabsContent>
            ))}

            <TabsContent value={"sku"}>
              <SkuLevelEditModal
                shipmentId={shipmentData.uid}
                shipment={shipmentData}
              />
            </TabsContent>

            <TabsContent value={"logistics-cost"}>
              <LogisticsCost shipmentData={shipmentData} />
            </TabsContent>

            <TabsContent value="logs" className="flex-1 overflow-hidden mt-4">
              {logsLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <p className="text-sm text-muted-foreground">Loading change logs...</p>
                  </div>
                </div>
              ) : (
                <ScrollArea className="h-[60vh]">
                  <div className="space-y-4">
                    {logs?.length === 0 ? (
                      <div className="text-center py-8">
                        <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No change logs available</p>
                      </div>
                    ) : (
                      logs?.map((log, idx) => (
                        <Card key={idx}>
                          <CardContent className="pt-4">
                            <div className="flex items-start justify-between">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline">{log.action || "Updated"}</Badge>
                                  <span className="text-sm font-medium">{getFieldLabel(log?.fieldName) || ""}</span>
                                </div>
                                <div className="text-sm">
                                  <span>{log?.change}</span>
                                </div>
                                <span className="flex items-center gap-1 text-xs text-black/90">
                                    <Pen className="h-3 w-3 text-blue-500" />
                                    <span className='text-blue-500'>Remark: </span>{log?.remark}
                                  </span>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    {log?.createdBy?.email}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    {new Date(log?.timestamp)?.toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </ScrollArea>
              )}
            </TabsContent>

          </Tabs>

          {/* PO Number Edit Reason Section */}
          {poNumberChanged && (user?.role === "admin" || user?.role === "superadmin") && (
            <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
              <CardHeader>
                <CardTitle className="text-lg text-red-900 dark:text-red-100 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Reason Required for PO Number Change
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-red-900 dark:text-red-100">Original PO Number</Label>
                    <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded border font-mono text-sm">
                      {originalData.poNumber || "Not set"}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-red-900 dark:text-red-100">New PO Number</Label>
                    <div className="p-2 bg-red-100 dark:bg-red-900 rounded border font-mono text-sm">
                      {formData.poNumber || "Not set"}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-red-900 dark:text-red-100">Reason for Change *</Label>
                  <Select value={poEditReason} onValueChange={setPoEditReason}>
                    <SelectTrigger className="border-red-300">
                      <SelectValue placeholder="Select a reason for changing PO Number..." />
                    </SelectTrigger>
                    <SelectContent>
                      {PO_EDIT_REASONS.map((reason) => (
                        <SelectItem key={reason} value={reason}>
                          {reason}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {!poEditReason && <p className="text-xs text-red-600">This field is mandatory</p>}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-red-900 dark:text-red-100">Additional Comments</Label>
                  <Textarea
                    placeholder="Any additional details about this change..."
                    value={poEditComments}
                    onChange={(e) => setPoEditComments(e.target.value)}
                    rows={3}
                    className="border-red-300"
                  />
                </div>

                <div className="flex items-center gap-2 text-sm text-red-700 dark:text-red-300">
                  <AlertTriangle className="h-4 w-4" />
                  <span>This change will be logged for audit purposes</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex justify-end space-x-4 pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading || (poNumberChanged && !poEditReason) || validationErrors.length > 0}
            className={`${activeTab == "sku" ? "hidden" : "flex flex-row"} bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700`}
          >
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
