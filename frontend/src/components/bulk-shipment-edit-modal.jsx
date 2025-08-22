"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Upload,
  Download,
  FileText,
  AlertCircle,
  CheckCircle,
  X,
  Eye,
  Shield,
  Warehouse,
  Truck,
  Database,
} from "lucide-react"
import { useUserStore } from "@/store/user-store"
import { Label } from "./ui/label"
import { updateBulkShipment } from "@/lib/order"

// Field definitions with role permissions and CSV headers
const fieldDefinitions = {
  // Admin fields
  // entryDate: {
  //   label: "Entry Date",
  //   csvHeader: "Entry Date",
  //   roles: ["superadmin", "admin"],
  //   type: "date",
  //   category: "admin"
  // },
  poDate: {
    label: "PO Date",
    csvHeader: "PO Date",
    roles: ["superadmin", "admin"],
    type: "date",
    category: "admin",
  },
  facility: {
    label: "Facility",
    csvHeader: "Facility",
    roles: ["superadmin", "admin"],
    type: "text",
    category: "admin",
  },
  channel: {
    label: "Channel",
    csvHeader: "Channel",
    roles: ["superadmin", "admin"],
    type: "text",
    category: "admin",
  },
  location: {
    label: "Location",
    csvHeader: "Location",
    roles: ["superadmin", "admin"],
    type: "text",
    category: "admin",
  },
  // brandName: {
  //   label: "Brand Name",
  //   csvHeader: "Brand Name",
  //   roles: ["superadmin", "admin"],
  //   type: "text",
  //   category: "admin",
  // },
  remarksPlanning: {
    label: "Remarks (Planning)",
    csvHeader: "Remarks (Planning)",
    roles: ["superadmin", "admin"],
    type: "text",
    category: "admin",
  },
  specialRemarksCOPT: {
    label: "Special Remarks (COPT)",
    csvHeader: "Special Remarks (COPT)",
    roles: ["superadmin", "admin"],
    type: "text",
    category: "admin",
  },
  // newShipmentReference: {
    // label: "New Shipment Reference",
    // csvHeader: "New Shipment Reference",
    // roles: ["superadmin", "admin"],
    // type: "text",
    // category: "admin",
  // },
  // statusActive: {
    // label: "Status (Active/Inactive)",
    // csvHeader: "Status (Active/Inactive)",
    // roles: ["superadmin", "admin"],
    // type: "text",
    // category: "admin",
  // },
  statusPlanning: {
    label: "Status (Planning)",
    csvHeader: "Status (Planning)",
    roles: ["superadmin", "admin"],
    type: "text",
    category: "admin",
  },
  channelInwardingRemarks: {
    label: "Channel Inwarding Remarks",
    csvHeader: "Channel Inwarding Remarks",
    roles: ["superadmin", "admin"],
    type: "text",
    category: "admin",
  },
  dispatchDateTentative: {
    label: "Dispatch Date Tentative",
    csvHeader: "Dispatch Date Tentative",
    roles: ["superadmin", "admin"],
    type: "date",
    category: "admin",
  },
  workingDatePlanner: {
    label: "Working Date (Planner)",
    csvHeader: "Working Date (Planner)",
    roles: ["superadmin", "admin"],
    type: "date",
    category: "admin",
  },
  firstAppointmentDateCOPT: {
    label: "First Appointment Date (COPT)",
    csvHeader: "First Appointment Date (COPT)",
    roles: ["superadmin", "admin"],
    type: "date",
    category: "admin",
  },
  orderNo1: {
    label: "Order No 1",
    csvHeader: "Order No 1",
    roles: ["superadmin", "admin"],
    type: "text",
    category: "admin",
  },
  orderNo2: {
    label: "Order No 2",
    csvHeader: "Order No 2",
    roles: ["superadmin", "admin"],
    type: "text",
    category: "admin",
  },
  orderNo3: {
    label: "Order No 3",
    csvHeader: "Order No 3",
    roles: ["superadmin", "admin"],
    type: "text",
    category: "admin",
  },
  // channelType: {
  //   label: "Channel Type",
  //   csvHeader: "Channel Type",
  //   roles: ["superadmin", "admin"],
  //   type: "text",
  //   category: "admin",
  // },
  // appointmentLetter: {
  //   label: "Appointment Letter/STN",
  //   csvHeader: "Appointment Letter/STN",
  //   roles: ["superadmin", "admin"],
  //   type: "text",
  //   category: "admin",
  // },
  labelsLink: {
    label: "Labels",
    csvHeader: "Labels",
    roles: ["superadmin", "admin"],
    type: "text",
    category: "admin",
  },
  // invoiceDate: {
  //   label: "Invoice Date",
  //   csvHeader: "Invoice Date",
  //   roles: ["superadmin", "admin"],
  //   type: "date",
  //   category: "admin",
  // },
  // invoiceLink: {
  //   label: "Invoice Link",
  //   csvHeader: "Invoice Link",
  //   roles: ["superadmin", "admin"],
  //   type: "text",
  //   category: "admin",
  // },
  // cnLink: {
  //   label: "CN Link",
  //   csvHeader: "CN Link",
  //   roles: ["superadmin", "admin"],
  //   type: "text",
  //   category: "admin",
  // },
  // ewayLink: {
  //   label: "E-Way Link",
  //   csvHeader: "E-Way Link",
  //   roles: ["superadmin", "admin"],
  //   type: "text",
  //   category: "admin",
  // },
  invoiceValue: {
    label: "Invoice Value",
    csvHeader: "Invoice Value (Check with Invoice Link)",
    roles: ["superadmin", "admin"],
    type: "number",
    category: "admin",
  },
  remarksAccountsTeam: {
    label: "Remarks by Accounts Team",
    csvHeader: "Remarks by Accounts Team",
    roles: ["superadmin", "admin"],
    type: "text",
    category: "admin",
  },
  invoiceChallanNumber: {
    label: "Invoice / Challan Number",
    csvHeader: "Invoice / Challan Number",
    roles: ["superadmin", "admin"],
    type: "text",
    category: "admin",
  },
  invoiceCheckedBy: {
    label: "Invoice Checked By",
    csvHeader: "Invoice Checked By",
    roles: ["superadmin", "admin"],
    type: "text",
    category: "admin",
  },
  tallyCustomerName: {
    label: "Tally Customer Name",
    csvHeader: "Tally Customer Name",
    roles: ["superadmin", "admin"],
    type: "text",
    category: "admin",
  },
  customerCode: {
    label: "Customer Code",
    csvHeader: "Customer Code",
    roles: ["superadmin", "admin"],
    type: "text",
    category: "admin",
  },
  poEntryCount: {
    label: "PO Entry Count",
    csvHeader: "PO Entry Count",
    roles: ["superadmin", "admin"],
    type: "number",
    category: "admin",
  },
  updatedGmv: {
    label: "Updated GMV",
    csvHeader: "Updated GMV",
    roles: ["superadmin", "admin"],
    type: "number",
    category: "admin",
  },

  // Warehouse fields
  statusWarehouse: {
    label: "Status (Warehouse)",
    csvHeader: "Status (Warehouse)",
    roles: ["superadmin", "admin", "warehouse"],
    type: "text",
    category: "warehouse",
  },
  dispatchRemarksWarehouse: {
    label: "Dispatch Remarks (Warehouse)",
    csvHeader: "Dispatch Remarks (Warehouse)",
    roles: ["superadmin", "admin", "warehouse"],
    type: "text",
    category: "warehouse",
  },
  rtsDate: {
    label: "RTS Date",
    csvHeader: "RTS Date",
    roles: ["superadmin", "admin", "warehouse"],
    type: "date",
    category: "warehouse",
  },
  dispatchDate: {
    label: "Dispatch Date",
    csvHeader: "Dispatch Date",
    roles: ["superadmin", "admin", "warehouse"],
    type: "date",
    category: "warehouse",
  },
  noOfBoxes: {
    label: "No Of Boxes",
    csvHeader: "No Of Boxes",
    roles: ["superadmin", "admin", "warehouse"],
    type: "number",
    category: "warehouse",
  },
  pickListNo: {
    label: "Pick List No",
    csvHeader: "Pick List No",
    roles: ["superadmin", "admin", "warehouse"],
    type: "text",
    category: "warehouse",
  },
  // workingTypeWarehouse: {
  //   label: "Working Type (Warehouse)",
  //   csvHeader: "Working Type (Warehouse)",
  //   roles: ["superadmin", "admin", "warehouse"],
  //   type: "text",
  //   category: "warehouse",
  // },
  inventoryRemarksWarehouse: {
    label: "Inventory Remarks Warehouse",
    csvHeader: "Inventory Remarks Warehouse",
    roles: ["superadmin", "admin", "warehouse"],
    type: "text",
    category: "warehouse",
  },
  b2bWorkingTeamRemarks: {
    label: "B2B Working Team Remarks",
    csvHeader: "B2B Working Team Remarks",
    roles: ["superadmin", "admin", "warehouse"],
    type: "text",
    category: "warehouse",
  },
  volumetricWeight: {
    label: "Volumetric Weight",
    csvHeader: "Volumetric Weight",
    roles: ["superadmin", "admin", "warehouse"],
    type: "number",
    category: "warehouse",
  },
  firstTransporter: {
    label: "First Transporter",
    csvHeader: "First Transporter",
    roles: ["superadmin", "admin", "warehouse"],
    type: "text",
    category: "warehouse",
  },
  firstDocketNo: {
    label: "First Docket No",
    csvHeader: "First Docket No",
    roles: ["superadmin", "admin", "warehouse"],
    type: "text",
    category: "warehouse",
  },
  secondTransporter: {
    label: "Second Transporter",
    csvHeader: "Second Transporter",
    roles: ["superadmin", "admin", "warehouse"],
    type: "text",
    category: "warehouse",
  },
  secondDocketNo: {
    label: "Second Docket No",
    csvHeader: "Second Docket No",
    roles: ["superadmin", "admin", "warehouse"],
    type: "text",
    category: "warehouse",
  },
  thirdTransporter: {
    label: "Third Transporter",
    csvHeader: "Third Transporter",
    roles: ["superadmin", "admin", "warehouse"],
    type: "text",
    category: "warehouse",
  },
  thirdDocketNo: {
    label: "Third Docket No",
    csvHeader: "Third Docket No",
    roles: ["superadmin", "admin", "warehouse"],
    type: "text",
    category: "warehouse",
  },

  // Logistics fields
  statusLogistics: {
    label: "Status (Logistics)",
    csvHeader: "Status (Logistics)",
    roles: ["superadmin", "admin", "logistics"],
    type: "text",
    category: "logistics",
  },
  dispatchRemarksLogistics: {
    label: "Dispatch Remarks (Logistics)",
    csvHeader: "Dispatch Remarks (Logistics)",
    roles: ["superadmin", "admin", "logistics"],
    type: "text",
    category: "logistics",
  },
  // currentAppointmentDate: {
  //   label: "Current Appointment Date",
  //   csvHeader: "Current Appointment Date",
  //   roles: ["superadmin", "admin", "logistics"],
  //   type: "date",
  //   category: "logistics",
  // },
  // deliveryDate: {
  //   label: "Delivery Date",
  //   csvHeader: "Delivery Date",
  //   roles: ["superadmin", "admin", "logistics"],
  //   type: "date",
  //   category: "logistics",
  // },
  rescheduleLag: {
    label: "Reschedule Lag (Remarks)",
    csvHeader: "Reschedule Lag (Remarks)",
    roles: ["superadmin", "admin", "logistics"],
    type: "number",
    category: "logistics",
  },
  finalRemarks: {
    label: "Final Remarks",
    csvHeader: "Final Remarks",
    roles: ["superadmin", "admin", "logistics"],
    type: "text",
    category: "logistics",
  },
  physicalWeight: {
    label: "Physical Weight",
    csvHeader: "Physical Weight",
    roles: ["superadmin", "admin", "logistics"],
    type: "number",
    category: "logistics",
  },
}

export default function BulkUpdateShipmentModal({ isOpen, onClose, onSave }) {
  const [selectedFields, setSelectedFields] = useState([])
  const [file, setFile] = useState(null)
  const [parsedUpdates, setParsedUpdates] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [step, setStep] = useState("select")
  const fileInputRef = useRef(null)
  const { user } = useUserStore()

  const getAvailableFields = () => {
    if (!user?.role) return []

    return Object.entries(fieldDefinitions).filter(([_, field]) => field.roles.includes(user.role))
  }

  const getFieldsByCategory = (category) => {
    return getAvailableFields().filter(([_, field]) => field.category === category)
  }

  const handleFieldToggle = (fieldName) => {
    setSelectedFields((prev) => (prev.includes(fieldName) ? prev.filter((f) => f !== fieldName) : [...prev, fieldName]))
  }

  const downloadTemplate = () => {
    if (selectedFields.length === 0) {
      setError("Please select at least one field to update")
      return
    }

    // Sort selected fields based on their original order in fieldDefinitions
    const fieldDefinitionKeys = Object.keys(fieldDefinitions)
    const sortedSelectedFields = selectedFields.sort((a, b) => {
      return fieldDefinitionKeys.indexOf(a) - fieldDefinitionKeys.indexOf(b)
    })

    const headers = ["UID", "PO Number", ...sortedSelectedFields.map((field) => fieldDefinitions[field].csvHeader)]

    // Sample data rows - also use sorted order for consistency
    const sampleData = [`135290,3100495853,${sortedSelectedFields.map(() => "").join(",")}`]

    const csvContent = [headers.join(","), ...sampleData].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "bulk_update_shipment_template.csv"
    a.click()
    window.URL.revokeObjectURL(url)

    setStep("upload")
  }

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith(".csv")) {
        setError("Please select a valid CSV file")
        return
      }
      setFile(selectedFile)
      setError("")
      setSuccess("")
      setParsedUpdates([])
    }
  }

  const handleDragOver = (event) => {
    event.preventDefault()
  }

  const handleDrop = (event) => {
    event.preventDefault()
    const droppedFile = event.dataTransfer.files[0]
    if (droppedFile) {
      if (droppedFile.type !== "text/csv" && !droppedFile.name.endsWith(".csv")) {
        setError("Please select a valid CSV file")
        return
      }
      setFile(droppedFile)
      setError("")
      setSuccess("")
      setParsedUpdates([])
    }
  }

  const parseCSV = (csvText) => {
    const lines = csvText.split("\n").filter((line) => line.trim())
    const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))

    // Validate required headers
    if (!headers.includes("UID") || !headers.includes("PO Number")) {
      throw new Error("CSV must contain UID and PO Number columns")
    }

    // Validate selected field headers
    const expectedHeaders = selectedFields.map((field) => fieldDefinitions[field].csvHeader)
    const missingHeaders = expectedHeaders.filter((header) => !headers.includes(header))
    if (missingHeaders.length > 0) {
      throw new Error(`Missing required columns: ${missingHeaders.join(", ")}`)
    }

    const updates = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim().replace(/"/g, ""))

      const update = {
        uid: Number.parseInt(values[headers.indexOf("UID")]) || null,
        poNumber: values[headers.indexOf("PO Number")] || "",
        status: "valid",
        errors: [],
      }

      // Parse selected fields
      selectedFields.forEach((fieldName) => {
        const fieldDef = fieldDefinitions[fieldName]
        const headerIndex = headers.indexOf(fieldDef.csvHeader)
        const value = values[headerIndex] || ""

        if (fieldDef.type === "number") {
          update[fieldName] = value
            ? fieldName.includes("Weight")
              ? Number.parseFloat(value)
              : Number.parseInt(value)
            : null
        } else {
          update[fieldName] = value
        }
      })

      // Validate update
      const errors = []
      if (!update.uid || update.uid <= 0) errors.push("UID is required and must be a positive number")
      if (!update.poNumber) errors.push("PO Number is required")

      if (errors.length > 0) {
        update.status = "error"
        update.errors = errors
      }

      updates.push(update)
    }

    return updates
  }

  const handleProcessFile = async () => {
    if (!file) return

    setIsProcessing(true)
    setError("")

    try {
      const text = await file.text()
      const updates = parseCSV(text)
      setParsedUpdates(updates)
      setStep("preview")
      setSuccess(`Successfully parsed ${updates.length} updates from CSV file`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process CSV file")
    }

    setIsProcessing(false)
  }

  const handleUploadUpdates = async () => {
    try {
      const validUpdates = parsedUpdates.filter((update) => update.status === "valid")
      if (validUpdates.length === 0) {
        setError("No valid updates to upload")
        return
      }

      // Prepare data to send in bulk to backend
      let data = []
      validUpdates.forEach((item) => {
        const { errors, status, ...extractedFields } = item
        // final only field with data inside them
        const cleanedData = {}
        for (const [key, value] of Object.entries(extractedFields)) {
          if (value !== null && value !== undefined && value !== "" && !(typeof value === "number" && isNaN(value))) {
            cleanedData[key] = value
          }
        }
        data = [...data, cleanedData]
      })

      setIsUploading(true)
      setUploadProgress(0)

      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i)
        const res = await updateBulkShipment(data)
        console.log(res.data)
      }

      onSave(validUpdates)
      setSuccess(`Successfully updated ${validUpdates.length} shipments`)
      setIsUploading(false)
      setUploadProgress(0)

      // Reset after success
      setTimeout(() => {
        resetForm()
        onClose()
      }, 3000)
    } catch (error) {
      console.error("Eroor: ", error)
      setError("Error: ", error.response.msg || error.message)
    }
  }

  const resetForm = () => {
    setSelectedFields([])
    setFile(null)
    setParsedUpdates([])
    setStep("select")
    setError("")
    setSuccess("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const validUpdatesCount = parsedUpdates.filter((update) => update.status === "valid").length
  const errorUpdatesCount = parsedUpdates.filter((update) => update.status === "error").length

  const getCategoryIcon = (category) => {
    switch (category) {
      case "admin":
        return Shield
      case "warehouse":
        return Warehouse
      case "logistics":
        return Truck
      default:
        return Database
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[95vh] max-w-7xl overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Bulk Update Shipments</span>
          </DialogTitle>
          <DialogDescription>
            {step === "select" && "Select fields to update and download template"}
            {step === "upload" && "Upload your completed CSV file"}
            {step === "preview" && "Review and confirm updates"}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-6">
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

            {/* Step 1: Field Selection */}
            {step === "select" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Eye className="h-5 w-5" />
                    <span>Select Fields to Update</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Admin Fields */}
                  {(user?.role === "superadmin" || user?.role === "admin") && (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Shield className="h-5 w-5 text-purple-600" />
                        <h3 className="text-lg font-semibold">Admin Fields</h3>
                        <Badge variant="secondary">{getFieldsByCategory("admin").length} fields</Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {getFieldsByCategory("admin").map(([fieldName, field]) => (
                          <div key={fieldName} className="flex items-center space-x-2">
                            <Checkbox
                              id={fieldName}
                              checked={selectedFields.includes(fieldName)}
                              onCheckedChange={() => handleFieldToggle(fieldName)}
                            />
                            <Label htmlFor={fieldName} className="text-sm cursor-pointer">
                              {field.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Warehouse Fields */}
                  {(user?.role === "superadmin" || user?.role === "warehouse") && (
                    <div className="space-y-4">
                      <Separator />
                      <div className="flex items-center space-x-2">
                        <Warehouse className="h-5 w-5 text-blue-600" />
                        <h3 className="text-lg font-semibold">Warehouse Fields</h3>
                        <Badge variant="secondary">{getFieldsByCategory("warehouse").length} fields</Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {getFieldsByCategory("warehouse").map(([fieldName, field]) => (
                          <div key={fieldName} className="flex items-center space-x-2">
                            <Checkbox
                              id={fieldName}
                              checked={selectedFields.includes(fieldName)}
                              onCheckedChange={() => handleFieldToggle(fieldName)}
                            />
                            <Label htmlFor={fieldName} className="text-sm cursor-pointer">
                              {field.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Logistics Fields */}
                  {(user?.role === "superadmin" || user?.role === "logistics") && (
                    <div className="space-y-4">
                      <Separator />
                      <div className="flex items-center space-x-2">
                        <Truck className="h-5 w-5 text-green-600" />
                        <h3 className="text-lg font-semibold">Logistics Fields</h3>
                        <Badge variant="secondary">{getFieldsByCategory("logistics").length} fields</Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {getFieldsByCategory("logistics").map(([fieldName, field]) => (
                          <div key={fieldName} className="flex items-center space-x-2">
                            <Checkbox
                              id={fieldName}
                              checked={selectedFields.includes(fieldName)}
                              onCheckedChange={() => handleFieldToggle(fieldName)}
                            />
                            <Label htmlFor={fieldName} className="text-sm cursor-pointer">
                              {field.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedFields.length > 0 && (
                    <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                        Selected Fields ({selectedFields.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedFields.map((fieldName) => (
                          <Badge key={fieldName} variant="secondary" className="bg-blue-100 text-blue-800">
                            {fieldDefinitions[fieldName].label}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Button
                      onClick={downloadTemplate}
                      disabled={selectedFields.length === 0}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download Template & Continue
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: File Upload */}
            {step === "upload" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Upload className="h-5 w-5" />
                    <span>Upload Completed CSV</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    <div className="flex flex-col items-center space-y-4">
                      <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                        <FileText className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-lg font-medium text-gray-900 dark:text-white">
                          {file ? file.name : "Drop your completed CSV file here, or click to browse"}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          CSV file with UID, PO Number, and selected fields
                        </p>
                      </div>
                      <div className="flex space-x-4">
                        <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                          <Upload className="h-4 w-4 mr-2" />
                          Select File
                        </Button>
                        {file && (
                          <Button
                            variant="outline"
                            onClick={() => {
                              setFile(null)
                              if (fileInputRef.current) {
                                fileInputRef.current.value = ""
                              }
                            }}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileSelect} className="hidden" />

                  {file && (
                    <div className="mt-6 flex justify-center">
                      <Button
                        onClick={handleProcessFile}
                        disabled={isProcessing}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        {isProcessing ? "Processing..." : "Process CSV File"}
                        <Eye className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Step 3: Preview Updates */}
            {step === "preview" && parsedUpdates.length > 0 && (
              <Card className="">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Database className="h-5 w-5" />
                      <CardTitle>Update Preview</CardTitle>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex space-x-2">
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          {validUpdatesCount} Valid
                        </Badge>
                        {errorUpdatesCount > 0 && (
                          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                            {errorUpdatesCount} Errors
                          </Badge>
                        )}
                      </div>
                      <Button
                        onClick={handleUploadUpdates}
                        disabled={validUpdatesCount === 0 || isUploading}
                        className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                      >
                        {isUploading ? "Updating..." : `Update ${validUpdatesCount} Shipments`}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {isUploading && (
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Updating shipments...</span>
                        <span className="text-sm text-gray-500">{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="h-2" />
                    </div>
                  )}

                  <ScrollArea className="max-w-7xl">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Status</TableHead>
                          <TableHead>UID</TableHead>
                          <TableHead>PO Number</TableHead>
                          {selectedFields.map((fieldName) => (
                            <TableHead key={fieldName}>{fieldDefinitions[fieldName].label}</TableHead>
                          ))}
                          <TableHead>Errors</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {parsedUpdates.map((update, index) => (
                          <TableRow
                            key={index}
                            className={update.status === "error" ? "bg-red-50 dark:bg-red-950" : ""}
                          >
                            <TableCell>
                              <Badge
                                className={
                                  update.status === "valid"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                }
                              >
                                {update.status === "valid" ? "Valid" : "Error"}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-mono">{update.uid}</TableCell>
                            <TableCell className="font-mono">{update.poNumber}</TableCell>
                            {selectedFields.map((fieldName) => (
                              <TableCell key={fieldName}>{update[fieldName] || "-"}</TableCell>
                            ))}
                            <TableCell>
                              {update.errors && update.errors.length > 0 && (
                                <div className="text-xs text-red-600 dark:text-red-400">{update.errors.join(", ")}</div>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <div className="flex justify-end space-x-4 pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={isUploading}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          {step !== "select" && (
            <Button
              variant="outline"
              onClick={() => {
                if (step === "upload") setStep("select")
                if (step === "preview") setStep("upload")
              }}
              disabled={isUploading}
            >
              Back
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
