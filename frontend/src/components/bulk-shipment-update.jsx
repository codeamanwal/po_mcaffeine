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
  AlertTriangle,
  CheckSquare,
  Square,
} from "lucide-react"
import { useUserStore } from "@/store/user-store"
import { Label } from "./ui/label"
import { updateBulkShipment } from "@/lib/order"
import {
  validateShipmentData,
  master_facility_option,
  master_status_planning_options,
  master_status_warehouse_options,
  master_status_logistics_options,
  master_courier_partner_options,
  master_rejection_reasons,
} from "@/lib/validation"
import { master_rto_remark_options } from "@/constants/master_sheet"

import { toast } from "sonner"

// Field definitions with role permissions, CSV headers, and validation rules
const fieldDefinitions = {
  // Admin fields
  poDate: {
    label: "PO Date",
    csvHeader: "PO Date",
    roles: ["superadmin", "admin"],
    type: "date",
    category: "admin",
    validation: null,
  },
  facility: {
    label: "Facility",
    csvHeader: "Facility",
    roles: ["superadmin", "admin"],
    type: "text",
    category: "admin",
    validation: master_facility_option,
  },
  // channel: {
  //   label: "Channel",
  //   csvHeader: "Channel",
  //   roles: ["superadmin", "admin"],
  //   type: "text",
  //   category: "admin",
  //   validation: master_channel_options,
  // },
  // location: {
  //   label: "Location",
  //   csvHeader: "Location",
  //   roles: ["superadmin", "admin"],
  //   type: "text",
  //   category: "admin",
  //   validation: master_location_options,
  // },
  remarksPlanning: {
    label: "Remarks (Planning)",
    csvHeader: "Remarks (Planning)",
    roles: ["superadmin", "admin"],
    type: "text",
    category: "admin",
    validation: null,
  },
  specialRemarksCOPT: {
    label: "Special Remarks (COPT)",
    csvHeader: "Special Remarks (COPT)",
    roles: ["superadmin", "admin"],
    type: "text",
    category: "admin",
    validation: null,
  },
  statusPlanning: {
    label: "Status (Planning)",
    csvHeader: "Status (Planning)",
    roles: ["superadmin", "admin"],
    type: "text",
    category: "admin",
    validation: master_status_planning_options,
  },
  channelInwardingRemarks: {
    label: "Channel Inwarding Remarks",
    csvHeader: "Channel Inwarding Remarks",
    roles: ["superadmin", "admin"],
    type: "text",
    category: "admin",
    validation: null,
  },
  dispatchDateTentative: {
    label: "Dispatch Date Tentative",
    csvHeader: "Dispatch Date Tentative",
    roles: ["superadmin", "admin"],
    type: "date",
    category: "admin",
    validation: null,
  },
  workingDatePlanner: {
    label: "Working Date (Planner)",
    csvHeader: "Working Date (Planner)",
    roles: ["superadmin", "admin"],
    type: "date",
    category: "admin",
    validation: null,
  },
  firstAppointmentDateCOPT: {
    label: "First Appointment Date (COPT)",
    csvHeader: "First Appointment Date (COPT)",
    roles: ["superadmin", "admin"],
    type: "date",
    category: "admin",
    validation: null,
  },
  appointmentShootedDate: {
    label: "Appointment Shooted Date",
    csvHeader: "Appointment Shooted Date",
    roles: ["superadmin", "admin"],
    type: "date",
    category: "admin",
    validation: null,
  },
  appointmentRequestedDate: {
    label: "Appointment Requested Date",
    csvHeader: "Appointment Requested Date",
    roles: ["superadmin", "admin"],
    type: "date",
    category: "admin",
    validation: null,
  },
  orderNo1: {
    label: "Order No 1",
    csvHeader: "Order No 1",
    roles: ["superadmin", "admin"],
    type: "text",
    category: "admin",
    validation: null,
  },
  orderNo2: {
    label: "Order No 2",
    csvHeader: "Order No 2",
    roles: ["superadmin", "admin"],
    type: "text",
    category: "admin",
    validation: null,
  },
  orderNo3: {
    label: "Order No 3",
    csvHeader: "Order No 3",
    roles: ["superadmin", "admin"],
    type: "text",
    category: "admin",
    validation: null,
  },
  labelsLink: {
    label: "Labels",
    csvHeader: "Labels",
    roles: ["superadmin", "admin"],
    type: "text",
    category: "admin",
    validation: null,
  },
  invoiceValue: {
    label: "Invoice Value",
    csvHeader: "Invoice Value (Check with Invoice Link)",
    roles: ["superadmin", "admin"],
    type: "number",
    category: "admin",
    validation: null,
  },
  remarksAccountsTeam: {
    label: "Remarks by Accounts Team",
    csvHeader: "Remarks by Accounts Team",
    roles: ["superadmin", "admin"],
    type: "text",
    category: "admin",
    validation: null,
  },
  invoiceChallanNumber: {
    label: "Invoice / Challan Number",
    csvHeader: "Invoice / Challan Number",
    roles: ["superadmin", "admin"],
    type: "text",
    category: "admin",
    validation: null,
  },
  invoiceCheckedBy: {
    label: "Invoice Checked By",
    csvHeader: "Invoice Checked By",
    roles: ["superadmin", "admin"],
    type: "text",
    category: "admin",
    validation: null,
  },
  tallyCustomerName: {
    label: "Tally Customer Name",
    csvHeader: "Tally Customer Name",
    roles: ["superadmin", "admin"],
    type: "text",
    category: "admin",
    validation: null,
  },
  customerCode: {
    label: "Customer Code",
    csvHeader: "Customer Code",
    roles: ["superadmin", "admin"],
    type: "text",
    category: "admin",
    validation: null,
  },
  poEntryCount: {
    label: "PO Entry Count",
    csvHeader: "PO Entry Count",
    roles: ["superadmin", "admin"],
    type: "number",
    category: "admin",
    validation: null,
  },
  updatedGmv: {
    label: "Updated GMV",
    csvHeader: "Updated GMV",
    roles: ["superadmin", "admin"],
    type: "number",
    category: "admin",
    validation: null,
  },
  deliveryType: {
    label: "Delivery Type",
    csvHeader: "Delivery Type",
    roles: ["superadmin", "admin"],
    type: "text",
    category: "admin",
    validation: null,
  },
  poNumberInwardCWH: {
    label: "PO Number (Inward - CWH)",
    csvHeader: "PO Number (Inward - CWH)",
    roles: ["superadmin", "admin"],
    type: "string",
    category: "admin",
    validation: null,
  },
  

  // Warehouse fields
  statusWarehouse: {
    label: "Status (Warehouse)",
    csvHeader: "Status (Warehouse)",
    roles: ["superadmin", "admin", "warehouse"],
    type: "text",
    category: "warehouse",
    validation: master_status_warehouse_options,
  },
  remarksWarehouse: {
    label: "Remarks (Warehouse)",
    csvHeader: "Remarks (Warehouse)",
    roles: ["superadmin", "admin", "warehouse"],
    type: "text",
    category: "warehouse",
    validation: null,
  },
  dispatchRemarksWarehouse: {
    label: "Dispatch Remarks (Warehouse)",
    csvHeader: "Dispatch Remarks (Warehouse)",
    roles: ["superadmin", "admin", "warehouse"],
    type: "text",
    category: "warehouse",
    validation: null,
  },
  workingDatePlanner: {
    label: "Working Date",
    csvHeader: "Working Date",
    roles: ["superadmin", "admin", "warehouse"],
    type: "date",
    category: "warehouse",
    validation: null,
  },
  rtsDate: {
    label: "RTS Date",
    csvHeader: "RTS Date",
    roles: ["superadmin", "admin", "warehouse"],
    type: "date",
    category: "warehouse",
    validation: null,
  },
  dispatchDate: {
    label: "Dispatch Date",
    csvHeader: "Dispatch Date",
    roles: ["superadmin", "admin", "warehouse"],
    type: "date",
    category: "warehouse",
    validation: null,
  },
  noOfBoxes: {
    label: "No Of Boxes",
    csvHeader: "No Of Boxes",
    roles: ["superadmin", "admin", "warehouse"],
    type: "number",
    category: "warehouse",
    validation: null,
  },
  pickListNo: {
    label: "Pick List No",
    csvHeader: "Pick List No",
    roles: ["superadmin", "admin", "warehouse"],
    type: "text",
    category: "warehouse",
    validation: null,
  },
  inventoryRemarksWarehouse: {
    label: "Inventory Remarks Warehouse",
    csvHeader: "Inventory Remarks Warehouse",
    roles: ["superadmin", "admin", "warehouse"],
    type: "text",
    category: "warehouse",
    validation: null,
  },
  b2bWorkingTeamRemarks: {
    label: "B2B Working Team Remarks",
    csvHeader: "B2B Working Team Remarks",
    roles: ["superadmin", "admin", "warehouse"],
    type: "text",
    category: "warehouse",
    validation: null,
  },
  volumetricWeight: {
    label: "Volumetric Weight",
    csvHeader: "Volumetric Weight",
    roles: ["superadmin", "admin", "warehouse"],
    type: "number",
    category: "warehouse",
    validation: null,
  },
  firstTransporter: {
    label: "First Transporter",
    csvHeader: "First Transporter",
    roles: ["superadmin", "admin", "warehouse"],
    type: "text",
    category: "warehouse",
    validation: master_courier_partner_options,
  },
  firstDocketNo: {
    label: "First Docket No",
    csvHeader: "First Docket No",
    roles: ["superadmin", "admin", "warehouse"],
    type: "text",
    category: "warehouse",
    validation: null,
  },
  secondTransporter: {
    label: "Second Transporter",
    csvHeader: "Second Transporter",
    roles: ["superadmin", "admin", "warehouse"],
    type: "text",
    category: "warehouse",
    validation: master_courier_partner_options,
  },
  secondDocketNo: {
    label: "Second Docket No",
    csvHeader: "Second Docket No",
    roles: ["superadmin", "admin", "warehouse"],
    type: "text",
    category: "warehouse",
    validation: null,
  },
  thirdTransporter: {
    label: "Third Transporter",
    csvHeader: "Third Transporter",
    roles: ["superadmin", "admin", "warehouse"],
    type: "text",
    category: "warehouse",
    validation: master_courier_partner_options,
  },
  thirdDocketNo: {
    label: "Third Docket No",
    csvHeader: "Third Docket No",
    roles: ["superadmin", "admin", "warehouse"],
    type: "text",
    category: "warehouse",
    validation: null,
  },

  // Logistics fields
  statusLogistics: {
    label: "Status (Logistics)",
    csvHeader: "Status (Logistics)",
    roles: ["superadmin", "admin", "logistics"],
    type: "text",
    category: "logistics",
    validation: master_status_logistics_options,
  },
  dispatchRemarksLogistics: {
    label: "Dispatch Remarks (Logistics)",
    csvHeader: "Dispatch Remarks (Logistics)",
    roles: ["superadmin", "admin", "logistics"],
    type: "text",
    category: "logistics",
    validation: null,
  },
  rescheduleLag: {
    label: "Reschedule Lag (Remarks)",
    csvHeader: "Reschedule Lag (Remarks)",
    roles: ["superadmin", "admin", "logistics"],
    type: "text",
    category: "logistics",
    validation: master_rto_remark_options,
  },
  finalRemarks: {
    label: "Final Remarks",
    csvHeader: "Final Remarks",
    roles: ["superadmin", "admin", "logistics"],
    type: "text",
    category: "logistics",
    validation: null,
  },
  physicalWeight: {
    label: "Physical Weight",
    csvHeader: "Physical Weight",
    roles: ["superadmin", "admin", "logistics"],
    type: "number",
    category: "logistics",
    validation: null,
  },
  deliveryCharges: {
    label: "Delivery Charges",
    csvHeader: "Delivery Charges",
    roles: ["superadmin", "admin", "logistics"],
    type: "number",
    category: "logistics",
    validation: null,
  },
  halting: {
    label: "Halting",
    csvHeader: "Halting",
    roles: ["superadmin", "admin", "logistics"],
    type: "number",
    category: "logistics",
    validation: null,
  },
  unloadingCharges: {
    label: "Unloading Charges",
    csvHeader: "Unloading Charges",
    roles: ["superadmin", "admin", "logistics"],
    type: "number",
    category: "logistics",
    validation: null,
  },
  dedicatedVehicle: {
    label: "Dedicated Vehicle",
    csvHeader: "Dedicated Vehicle",
    roles: ["superadmin", "admin", "logistics"],
    type: "number",
    category: "logistics",
    validation: null,
  },
  otherCharges: {
    label: "Other Charges",
    csvHeader: "Other Charges",
    roles: ["superadmin", "admin", "logistics"],
    type: "number",
    category: "logistics",
    validation: null,
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
  const [validationSummary, setValidationSummary] = useState({ errors: 0, warnings: 0 })
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

  // Select All functionality
  const handleSelectAllFields = () => {
    const allAvailableFields = getAvailableFields().map(([fieldName]) => fieldName)
    if (selectedFields.length === allAvailableFields.length) {
      setSelectedFields([])
    } else {
      setSelectedFields(allAvailableFields)
    }
  }

  const handleSelectCategoryFields = (category) => {
    const categoryFields = getFieldsByCategory(category).map(([fieldName]) => fieldName)
    const allCategorySelected = categoryFields.every((field) => selectedFields.includes(field))

    if (allCategorySelected) {
      // Deselect all category fields
      setSelectedFields((prev) => prev.filter((field) => !categoryFields.includes(field)))
    } else {
      // Select all category fields
      setSelectedFields((prev) => [...new Set([...prev, ...categoryFields])])
    }
  }

  const downloadTemplate = () => {
    if (selectedFields.length === 0) {
      setError("Please select at least one field to update")
      return
    }

    // Sort selected fields based on their original order in fieldDefinitions
    const fieldDefinitionKeys = Object.keys(fieldDefinitions)
    const sortedSelectedFields = [...selectedFields].sort((a, b) => {
      return fieldDefinitionKeys.indexOf(a) - fieldDefinitionKeys.indexOf(b)
    })

    const headers = ["UID", "PO Number", ...sortedSelectedFields.map((field) => fieldDefinitions[field].csvHeader)]

    const csvContent = [headers.join(",")].join("\n")

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
      setValidationSummary({ errors: 0, warnings: 0 })
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
      setValidationSummary({ errors: 0, warnings: 0 })
    }
  }

  const validateFieldValue = (fieldName, value) => {
    const field = (fieldDefinitions )[fieldName]
    if (!field || !field.validation || !value || value.trim() === "") {
      return { isValid: true, errors: []  }
    }

    const allowedValues = field.validation
    if (!allowedValues.includes(value)) {
      return {
        isValid: false,
        errors: [
          `${field.label} "${value}" is not valid. Must be one of: ${allowedValues.slice(0, 3).join(", ")}${allowedValues.length > 3 ? "..." : ""}`,
        ],
      }
    }

    return { isValid: true, errors: []  }
  }

  // Updated: ignore empty cells, only accept role-allowed selected fields, skip rows with no updatable values
  const parseCSV = (csvText) => {
    const lines = csvText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((line) => line && !line.startsWith("#"))

    if (lines.length === 0) {
      setValidationSummary({ errors: 0, warnings: 0 })
      return []
    }

    const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))

    // Required identifiers
    if (!headers.includes("UID") || !headers.includes("PO Number")) {
      throw new Error("CSV must contain UID and PO Number columns")
    }

    // Only consider fields the user selected AND is allowed to update by role
    const allowedSelectedFields = selectedFields.filter((fname) => {
      const def = (fieldDefinitions)[fname]
      return def?.roles?.includes(user?.role || "")
    })

    // Validate selected field headers exist
    const expectedHeaders = allowedSelectedFields.map((field) => (fieldDefinitions)[field].csvHeader)
    const missingHeaders = expectedHeaders.filter((header) => !headers.includes(header))
    if (missingHeaders.length > 0) {
      throw new Error(`Missing required columns: ${missingHeaders.join(", ")}`)
    }

    // Fast header index lookup
    const headerIndex = new Map()
    headers.forEach((h, i) => headerIndex.set(h, i))

    const getCell = (rowValues, header) => {
      const idx = headerIndex.get(header)
      const raw = idx !== undefined ? (rowValues[idx] ?? "") : ""
      return String(raw).replace(/"/g, "").trim()
    }

    const updates = []
    let totalErrors = 0
    let totalWarnings = 0
    // console.log("Selected fields are: ", selectedFields);
    for (let i = 1; i < lines.length; i++) {
      const rawLine = lines[i]
      if (!rawLine || !rawLine.trim()) continue // ignore completely empty lines

      const values = rawLine.split(",").map((v) => v.trim())

      const uidCell = getCell(values, "UID")
      const poCell = getCell(values, "PO Number")

      const update = {
        status: "valid",
        errors: [] ,
        warnings: [] ,
        rowNumber: i + 1,
      }

      // Identifier validation
      const uidNum = Number.parseInt(uidCell, 10)
      if (!uidCell || Number.isNaN(uidNum) || uidNum <= 0) {
        update.errors.push("UID is required and must be a positive number")
      } else {
        update.uid = uidNum
      }

      if (!poCell) {
        update.errors.push("PO Number is required")
      } else {
        update.poNumber = poCell
      }

      // Parse only allowed selected fields; ignore all other CSV columns
      let hasAnyUpdatableValue = false

      for (const fieldName of allowedSelectedFields) {
        const def = (fieldDefinitions)[fieldName]
        const cell = getCell(values, def.csvHeader)

        // Ignore empty cells completely
        if (cell === "") continue

        hasAnyUpdatableValue = true

        // Type parsing
        if (def.type === "number") {
          const isWeight = fieldName.toLowerCase().includes("weight")
          const parsed = isWeight ? Number.parseFloat(cell) : Number.parseInt(cell, 10)
          if (Number.isNaN(parsed)) {
            update.errors.push(`${def.label} must be a valid ${isWeight ? "number" : "integer"}`)
          } else {
            update[fieldName] = parsed
          }
        } else {
          update[fieldName] = cell
        }

        // Date validation
        const yyyyMMddRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
        if (def.type === "date") {
          if(!yyyyMMddRegex.test(cell)){
            update.errors.push(`${def.label} must be a valid date in YYYY-MM-DD format`)
          } else {
            update[fieldName] = cell
          }
        }

        // Enum-like validation when provided
        if (def.validation) {
          const allowedValues = def.validation
          if (!allowedValues.includes(cell)) {
            update.errors.push(
              `${def.label} "${cell}" is not valid. Must be one of: ${allowedValues
                .slice(0, 3)
                .join(", ")}${allowedValues.length > 3 ? "..." : ""}`,
            )
          }
        }
      }

      // If no updatable values (only UID/PO present), skip this row entirely
      if (!hasAnyUpdatableValue) {
        continue
      }

      // Shipment-level validation
      try {
        const shipmentValidation = validateShipmentData(update)
        if (!shipmentValidation.isValid) {
          update.errors.push(...shipmentValidation.errors)
        }
        if (shipmentValidation.warnings && shipmentValidation.warnings.length > 0) {
          update.warnings.push(...shipmentValidation.warnings)
        }
      } catch (validationError) {
        update.errors.push(`Validation error: ${validationError.message}`)
      }

      // Status
      if (update.errors.length > 0) {
        update.status = "error"
        totalErrors++
      } else if (update.warnings.length > 0) {
        update.status = "warning"
        totalWarnings++
      }

      updates.push(update)
    }

    setValidationSummary({ errors: totalErrors, warnings: totalWarnings })
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

      const validCount = updates.filter((u) => u.status === "valid").length
      const errorCount = updates.filter((u) => u.status === "error").length
      const warningCount = updates.filter((u) => u.status === "warning").length

      setSuccess(
        `Successfully parsed ${updates.length} updates: ${validCount} valid, ${errorCount} errors, ${warningCount} warnings`,
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process CSV file")
    }

    setIsProcessing(false)
  }

  // Updated: Only send identifiers and non-empty selected fields allowed for the current role
  const handleUploadUpdates = async () => {
    try {
      const validUpdates = parsedUpdates.filter((update) => update.status === "valid" || update.status === "warning")
      if (validUpdates.length === 0) {
        setError("No valid updates to upload")
        toast.error("No valid updates to upload")
        return
      }

      // Only keep UID, PO Number, and allowed+selected fields with non-empty values
      const allowedSelectedFields = selectedFields.filter((fname) => {
        const def = (fieldDefinitions )[fname]
        return def?.roles?.includes(user?.role || "")
      })
      const allowedKeys = new Set(["uid", "poNumber", ...allowedSelectedFields])

      const data = []
      validUpdates.forEach((item) => {
        const { errors, warnings, status, rowNumber, ...extractedFields } = item

        // Remove empty-ish values
        const cleanedData = {}
        for (const [key, value] of Object.entries(extractedFields)) {
          const isEmptyNumber = typeof value === "number" && Number.isNaN(value)
          const isEmptyString = typeof value === "string" && value.trim() === ""
          if (value !== null && value !== undefined && !isEmptyNumber && !isEmptyString) {
            cleanedData[key] = value
          }
        }

        // Keep only UID, PO Number, and allowed selected fields
        for (const key of Object.keys(cleanedData)) {
          if (!allowedKeys.has(key)) {
            delete cleanedData[key]
          }
        }

        // Must have at least one updatable field besides identifiers
        const hasUpdates = Object.keys(cleanedData).some((k) => k !== "uid" && k !== "poNumber")
        if (hasUpdates) {
          data.push(cleanedData)
        }
      })

      if (data.length === 0) {
        setError("No rows with updatable values after filtering. Ensure cells are not empty.")
        toast.error("No rows with updatable values after filtering. Ensure cells are not empty.")
        return
      }

      setIsUploading(true)
      setUploadProgress(0)

      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i)
        await new Promise((resolve) => setTimeout(resolve, 80))
      }

      const res = await updateBulkShipment(data)
      // console.log(res.data)

      onSave?.(validUpdates)
      setSuccess(`Successfully updated ${data.length} shipments`)
      toast.success(res.data.msg || `Successfully updated ${data.length} shipments`)
      setIsUploading(false)
      setUploadProgress(0)

      // Reset after success
      setTimeout(() => {
        resetForm()
        onClose()
      }, 3000)
    } catch (error) {
      console.error("Error: ", error)
      setError(`Error: ${error?.response?.msg || error.message}`)
      toast.error(`Error: ${error?.response?.msg || error.message}`)
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const resetForm = () => {
    setSelectedFields([])
    setFile(null)
    setParsedUpdates([])
    setStep("select")
    setError("")
    setSuccess("")
    setValidationSummary({ errors: 0, warnings: 0 })
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const validUpdatesCount = parsedUpdates.filter((update) => update.status === "valid").length
  const warningUpdatesCount = parsedUpdates.filter((update) => update.status === "warning").length
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

  const getStatusBadge = (status, errors, warnings) => {
    if (status === "error") {
      return (
        <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
          <AlertCircle className="h-3 w-3 mr-1" />
          Error
        </Badge>
      )
    }
    if (status === "warning") {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Warning
        </Badge>
      )
    }
    return (
      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
        <CheckCircle className="h-3 w-3 mr-1" />
        Valid
      </Badge>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[95vh] min-w-[90vw] overflow-auto">
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
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Eye className="h-5 w-5" />
                      <span>Select Fields to Update</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSelectAllFields}
                        className="flex items-center space-x-2 bg-transparent"
                      >
                        {selectedFields.length === getAvailableFields().length ? (
                          <CheckSquare className="h-4 w-4" />
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                        <span>Select All Fields</span>
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Admin Fields */}
                  {(user?.role === "superadmin" || user?.role === "admin") && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Shield className="h-5 w-5 text-purple-600" />
                          <h3 className="text-lg font-semibold">Admin Fields</h3>
                          <Badge variant="secondary">{getFieldsByCategory("admin").length} fields</Badge>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSelectCategoryFields("admin")}
                          className="flex items-center space-x-1"
                        >
                          {getFieldsByCategory("admin").every(([fieldName]) => selectedFields.includes(fieldName)) ? (
                            <CheckSquare className="h-3 w-3" />
                          ) : (
                            <Square className="h-3 w-3" />
                          )}
                          <span className="text-xs">Select All</span>
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {getFieldsByCategory("admin").map(([fieldName, field]) => (
                          <div key={fieldName} className="flex items-center space-x-2">
                            <Checkbox
                              id={fieldName}
                              checked={selectedFields.includes(fieldName)}
                              onCheckedChange={() => handleFieldToggle(fieldName)}
                            />
                            <Label htmlFor={fieldName} className="text-sm cursor-pointer flex items-center">
                              {field.label}
                              {field.validation && (
                                <Badge variant="outline" className="ml-2 text-xs">
                                  Validated
                                </Badge>
                              )}
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
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Warehouse className="h-5 w-5 text-blue-600" />
                          <h3 className="text-lg font-semibold">Warehouse Fields</h3>
                          <Badge variant="secondary">{getFieldsByCategory("warehouse").length} fields</Badge>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSelectCategoryFields("warehouse")}
                          className="flex items-center space-x-1"
                        >
                          {getFieldsByCategory("warehouse").every(([fieldName]) =>
                            selectedFields.includes(fieldName),
                          ) ? (
                            <CheckSquare className="h-3 w-3" />
                          ) : (
                            <Square className="h-3 w-3" />
                          )}
                          <span className="text-xs">Select All</span>
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {getFieldsByCategory("warehouse").map(([fieldName, field]) => (
                          <div key={fieldName} className="flex items-center space-x-2">
                            <Checkbox
                              id={fieldName}
                              checked={selectedFields.includes(fieldName)}
                              onCheckedChange={() => handleFieldToggle(fieldName)}
                            />
                            <Label htmlFor={fieldName} className="text-sm cursor-pointer flex items-center">
                              {field.label}
                              {field.validation && (
                                <Badge variant="outline" className="ml-2 text-xs">
                                  Validated
                                </Badge>
                              )}
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
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Truck className="h-5 w-5 text-green-600" />
                          <h3 className="text-lg font-semibold">Logistics Fields</h3>
                          <Badge variant="secondary">{getFieldsByCategory("logistics").length} fields</Badge>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSelectCategoryFields("logistics")}
                          className="flex items-center space-x-1"
                        >
                          {getFieldsByCategory("logistics").every(([fieldName]) =>
                            selectedFields.includes(fieldName),
                          ) ? (
                            <CheckSquare className="h-3 w-3" />
                          ) : (
                            <Square className="h-3 w-3" />
                          )}
                          <span className="text-xs">Select All</span>
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {getFieldsByCategory("logistics").map(([fieldName, field]) => (
                          <div key={fieldName} className="flex items-center space-x-2">
                            <Checkbox
                              id={fieldName}
                              checked={selectedFields.includes(fieldName)}
                              onCheckedChange={() => handleFieldToggle(fieldName)}
                            />
                            <Label htmlFor={fieldName} className="text-sm cursor-pointer flex items-center">
                              {field.label}
                              {field.validation && (
                                <Badge variant="outline" className="ml-2 text-xs">
                                  Validated
                                </Badge>
                              )}
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
                            {(fieldDefinitions)[fieldName].label}
                            {(fieldDefinitions)[fieldName].validation && <span className="ml-1 text-xs">✓</span>}
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
              <Card className="my-10">
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
                        {warningUpdatesCount > 0 && (
                          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                            {warningUpdatesCount} Warnings
                          </Badge>
                        )}
                        {errorUpdatesCount > 0 && (
                          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                            {errorUpdatesCount} Errors
                          </Badge>
                        )}
                      </div>
                      <Button
                        onClick={handleUploadUpdates}
                        disabled={validUpdatesCount + warningUpdatesCount === 0 || isUploading}
                        className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                      >
                        {isUploading ? "Updating..." : `Update ${validUpdatesCount + warningUpdatesCount} Shipments`}
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

                  <ScrollArea className="max-w-full">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Status</TableHead>
                          <TableHead>Row</TableHead>
                          <TableHead>UID</TableHead>
                          <TableHead>PO Number</TableHead>
                          {selectedFields.map((fieldName) => (
                            <TableHead key={fieldName}>{(fieldDefinitions)[fieldName].label}</TableHead>
                          ))}
                          <TableHead>Issues</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {parsedUpdates.map((update, index) => (
                          <TableRow
                            key={index}
                            className={
                              update.status === "error"
                                ? "bg-red-50 dark:bg-red-950"
                                : update.status === "warning"
                                  ? "bg-yellow-50 dark:bg-yellow-950"
                                  : ""
                            }
                          >
                            <TableCell>{getStatusBadge(update.status, update.errors, update.warnings)}</TableCell>
                            <TableCell className="font-mono text-xs">{update.rowNumber}</TableCell>
                            <TableCell className="font-mono">{update.uid}</TableCell>
                            <TableCell className="font-mono">{update.poNumber}</TableCell>
                            {selectedFields.map((fieldName) => (
                              <TableCell key={fieldName}>
                                {update[fieldName] !== undefined && update[fieldName] !== "" ? update[fieldName] : "-"}
                              </TableCell>
                            ))}
                            <TableCell>
                              {(update.errors && update.errors.length > 0) ||
                              (update.warnings && update.warnings.length > 0) ? (
                                <div className="space-y-1">
                                  {update.errors && update.errors.length > 0 && (
                                    <div className="text-xs text-red-600 dark:text-red-400">
                                      <strong>Errors:</strong>
                                      <ul className="list-disc list-inside ml-2">
                                        {update.errors.map((error, i) => (
                                          <li key={i}>{error}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                  {update.warnings && update.warnings.length > 0 && (
                                    <div className="text-xs text-yellow-600 dark:text-yellow-400">
                                      <strong>Warnings:</strong>
                                      <ul className="list-disc list-inside ml-2">
                                        {update.warnings.map((warning, i) => (
                                          <li key={i}>{warning}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <span className="text-green-600 text-xs">✓ Valid</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </div>
          <ScrollBar orientation="vertical" />
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
