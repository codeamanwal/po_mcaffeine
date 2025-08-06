"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, AlertCircle, CheckCircle, Download, ArrowLeft, X, Eye, Database } from "lucide-react"
import { createBulkShipment, getShipmentStatusList, updateBulkShipment } from "@/lib/order"


const expectedHeaders = [
        "UID",
        "Entry Date",
        "PO Date", 
        "Facility",
        "Channel",
        "Location",
        "PO Number",
        "Brand Name",
        "Remarks (Planning)",
        "Special Remarks (COPT)",
        "New Shipment Reference",
        "Status (Active/Inactive)",
        "Status (Planning)",
        "Status (Warehouse)",
        "Status (Logistics)",
        "Channel Inwarding Remarks",
        "Dispatch Remarks (Logistics)",
        "Dispatch Remarks (Warehouse)",
        "Dispatch Date Tentative",
        "Working Date (Planner)",
        "RTS Date",
        "Dispatch Date",
        "Current Appointment Date",
        "First Appointment Date (COPT)",
        "No Of Boxes",
        "Order No 1",
        "Order No 2",
        "Order No 3",
        "Pick List No",
        "Working Type (Warehouse)",
        "Inventory Remarks (Warehouse)",
        "B2B Working Team Remarks",
        "Volumetric Weight",
        "Channel Type",
        "First Transporter",
        "First Docket No",
        "Second Transporter",
        "Second Docket No",
        "Third Transporter",
        "Third Docket No",
        "Appointment Letter/STN",
        "Labels Link",
        "Invoice Date",
        "Invoice Link",
        "CN Link",
        "E-Way Link",
        "Invoice Value",
        "Remarks (Accounts Team)",
        "Invoice Challan Number",
        "Invoice Checked By",
        "Tally Customer Name",
        "Customer Code",
        "PO Entry Count",
        "Temp",
        "Delivery Date",
        "Reschedule Lag",
        "Final Remarks",
        "Updated GMV",
        "Physical Weight"
]

const headersMapping = [
    "uid",
    "entryDate",
    "poDate", 
    "facility",
    "channel",
    "location",
    "poNumber",
    "brandName",
    "remarksPlanning",
    "specialRemarksCopt",
    "newShipmentReference",
    "statusActiveInactive",
    "statusPlanning",
    "statusWarehouse",
    "statusLogistics",
    "channelInwardingRemarks",
    "dispatchRemarksLogistics",
    "dispatchRemarksWarehouse",
    "dispatchDateTentative",
    "workingDatePlanner",
    "rtsDate",
    "dispatchDate",
    "currentAppointmentDate",
    "firstAppointmentDateCopt",
    "noOfBoxes",
    "orderNo1",
    "orderNo2",
    "orderNo3",
    "pickListNo",
    "workingTypeWarehouse",
    "inventoryRemarksWarehouse",
    "b2bWorkingTeamRemarks",
    "volumetricWeight",
    "channelType",
    "firstTransporter",
    "firstDocketNo",
    "secondTransporter",
    "secondDocketNo",
    "thirdTransporter",
    "thirdDocketNo",
    "appointmentLetterStn",
    "labelsLink",
    "invoiceDate",
    "invoiceLink",
    "cnLink",
    "eWayLink",
    "invoiceValue",
    "remarksAccountsTeam",
    "invoiceChallanNumber",
    "invoiceCheckedBy",
    "tallyCustomerName",
    "customerCode",
    "poEntryCount",
    "temp",
    "deliveryDate",
    "rescheduleLag",
    "finalRemarks",
    "updatedGmv",
    "physicalWeight"
]

export default function BulkShipmentUpdate({ onNavigate, isDarkMode, onToggleTheme }) {
  const [file, setFile] = useState(null)
  const [parsedOrders, setParsedOrders] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showPreview, setShowPreview] = useState(false)
  const fileInputRef = useRef(null)

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
      setParsedOrders([])
      setShowPreview(false)
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
      setParsedOrders([])
      setShowPreview(false)
    }
  }

  const parseCSV = (csvText) => {
    const lines = csvText.split("\n").filter((line) => line.trim())
    const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))

    

    // Check if all required headers are present
    const missingHeaders = expectedHeaders.filter((header) => !headers.includes(header))
    if (missingHeaders.length > 0) {
      throw new Error(`Missing required columns: ${missingHeaders.join(", ")}`)
    }

    const orders = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim().replace(/"/g, ""))
      const order = {
        uid: Number.parseInt(values[headers.indexOf("UID")]) || null,
        entryDate: values[headers.indexOf("Entry Date")] || "",
        poDate: values[headers.indexOf("PO Date")] || "",
        facility: values[headers.indexOf("Facility")] || "",
        channel: values[headers.indexOf("Channel")] || "",
        location: values[headers.indexOf("Location")] || "",
        poNumber: values[headers.indexOf("PO Number")] || "",
        brandName: values[headers.indexOf("Brand")] || values[headers.indexOf("Brand Name")] || "",
        remarksPlanning: values[headers.indexOf("Remarks (Planning)")] || "",
        specialRemarksCOPT: values[headers.indexOf("Special Remarks (COPT)")] || "",
        newShipmentReference: values[headers.indexOf("New Shipment Reference")] || "",
        statusActive: values[headers.indexOf("Status (Active/Inactive)")] || "",
        statusPlanning: values[headers.indexOf("Status (Planning)")] || "",
        statusWarehouse: values[headers.indexOf("Status (Warehouse)")] || "",
        statusLogistics: values[headers.indexOf("Status (Logistics)")] || "",
        channelInwardingRemarks: values[headers.indexOf("Channel Inwarding Remarks")] || "",
        dispatchRemarksLogistics: values[headers.indexOf("Dispatch Remarks (Logistics)")] || "",
        dispatchRemarksWarehouse: values[headers.indexOf("Dispatch Remarks (Warehouse)")] || "",
        dispatchDateTentative: values[headers.indexOf("Dispatch Date Tentative")] || "",
        workingDatePlanner: values[headers.indexOf("Working Date (Planner)")] || "",
        rtsDate: values[headers.indexOf("RTS Date")] || "",
        dispatchDate: values[headers.indexOf("Dispatch Date")] || "",
        currentAppointmentDate: values[headers.indexOf("Current Appointment Date")] || "",
        firstAppointmentDateCOPT: values[headers.indexOf("First Appointment Date (COPT)")] || "",
        noOfBoxes: Number.parseInt(values[headers.indexOf("No Of Boxes")]) || null,
        orderNo1: values[headers.indexOf("Order No 1")] || "",
        orderNo2: values[headers.indexOf("Order No 2")] || "",
        orderNo3: values[headers.indexOf("Order No 3")] || "",
        pickListNo: values[headers.indexOf("Pick List No")] || "",
        workingTypeWarehouse: values[headers.indexOf("Working Type (Warehouse)")] || "",
        inventoryRemarksWarehouse: values[headers.indexOf("Inventory Remarks Warehouse")] || "",
        b2bWorkingTeamRemarks: values[headers.indexOf("B2B Working Team Remarks")] || "",
        volumetricWeight: Number.parseFloat(values[headers.indexOf("Volumetric Weight")]) || null,
        channelType: values[headers.indexOf("Channel Type")] || "",
        firstTransporter: values[headers.indexOf("First Transporter")] || "",
        firstDocketNo: values[headers.indexOf("First Docket No")] || "",
        secondTransporter: values[headers.indexOf("Second Transporter")] || "",
        secondDocketNo: values[headers.indexOf("Second Docket No")] || "",
        thirdTransporter: values[headers.indexOf("Third Transporter")] || "",
        thirdDocketNo: values[headers.indexOf("Third Docket No")] || "",
        appointmentLetter: values[headers.indexOf("Appointment Letter/STN")] || "",
        labelsLink: values[headers.indexOf("Labels")] || "",
        invoiceDate: values[headers.indexOf("Invoice Date")] || "",
        invoiceLink: values[headers.indexOf("Invoice Link")] || "",
        cnLink: values[headers.indexOf("CN Link")] || "",
        ewayLink: values[headers.indexOf("E-Way Link")] || "",
        invoiceValue: Number.parseFloat(values[headers.indexOf("Invoice Value (Check with Invoice Link)")]) || null,
        remarksAccountsTeam: values[headers.indexOf("Remarks by Accounts Team")] || "",
        invoiceChallanNumber: values[headers.indexOf("Invoice / Challan Number")] || "",
        invoiceCheckedBy: values[headers.indexOf("Invoice Checked By")] || "",
        tallyCustomerName: values[headers.indexOf("Tally Customer Name")] || "",
        customerCode: values[headers.indexOf("Customer Code")] || "",
        poEntryCount: Number.parseInt(values[headers.indexOf("PO Entry Count")]) || null,
        temp: Boolean(values[headers.indexOf("Temp")]) || null,
        deliveryDate: values[headers.indexOf("Delivery Date")] || "",
        // some fields are missing => appointment dates
        /***** Have to fix this */
        rescheduleLag: Number.parseInt(values[headers.indexOf("Reschedule Lag (Remarks)")] || null),
        /******************* */
        finalRemarks: values[headers.indexOf("Final Remarks")] || "",
        updatedGmv: Number.parseFloat(values[headers.indexOf("Updated GMV")]) || null,
        physicalWeight: Number.parseFloat(values[headers.indexOf("Physical Weight")]) || null,
        // more fields =>  Rivigo TAT IP, Critical Dispatch Date, COPT Final Remark, Check
        // qty: Number.parseInt(values[headers.indexOf("Qty")]) || 0,
        // poValue: Number.parseFloat(values[headers.indexOf("PO Value")]) || 0,
        status: "valid",
        errors: [],
      }

      // Validate order
      const errors = []
      if (!order.uid) errors.push("UID is required")
      if (!order.entryDate) errors.push("Entry Date is required")
      if (!order.brand) errors.push("Brand is required")
      if (!order.channel) errors.push("Channel is required")
    //   if (!order.location) errors.push("Location is required")
      if (!order.poDate) errors.push("PO Date is required")
      if (!order.poNumber) errors.push("PO Number is required")
    //   if (!order.srNo) errors.push("Sr/ No is required")
    //   if (!order.skuName) errors.push("SKU Name is required")
    //   if (!order.skuCode) errors.push("SKU Code is required")
    //   if (!order.channelSkuCode) errors.push("Channel SKU Code is required")
    //   if (order.qty <= 0) errors.push("Quantity must be greater than 0")
    //   if (order.gmv <= 0) errors.push("GMV must be greater than 0")
    //   if (order.poValue <= 0) errors.push("PO Value must be greater than 0")

    //   if (errors.length > 0) {
    //     order.status = "error"
    //     order.errors = errors
    //   }

      orders.push(order)
    }

    return orders
  }

  const handleProcessFile = async () => {
    if (!file) return

    setIsProcessing(true)
    setError("")

    try {
      const text = await file.text()
      const orders = parseCSV(text)
      setParsedOrders(orders)
      setShowPreview(true)
      setSuccess(`Successfully parsed ${orders.length} orders from CSV file`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process CSV file")
    }

    setIsProcessing(false)
  }

  const handleUploadOrders = async () => {
    const validOrders = parsedOrders.filter((order) => order.status === "valid")
    if (validOrders.length === 0) {
      setError("No valid orders to upload")
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      console.log("Uploading orders:", validOrders)  
      const res = await updateBulkShipment(validOrders);
      // const res = await api.post(createBulkOrderUrl, {orders: validOrders})
      console.log(res.data);
      
      // // Reset after success
      // setTimeout(() => {
      //   setFile(null)
      //   setParsedOrders([])
      //   setShowPreview(false)
      //   setSuccess("")
      //   if (fileInputRef.current) {
      //     fileInputRef.current.value = ""
      //   }
      // }, 1000)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to upload orders")
    }finally {
      setIsUploading(false)
      setUploadProgress(0)
    }

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i)
      await new Promise((resolve) => setTimeout(resolve, 200))
    }
    console.log(validOrders);

    setSuccess(`Successfully uploaded ${validOrders.length} orders to the system`)
    setIsUploading(false)
    setUploadProgress(0)

    // Reset after success
    
  }

  const downloadTemplate = async () => {

    const headers = expectedHeaders;
    const data = await getShipmentStatusList();
    console.log(data.data);

    const sampleData = [
      "2024-12-04,MCaffeine,Zepto,Hyderabad,2024-12-03,3100495853,1,mCaffeine Naked & Raw Coffee Espresso Body Wash,15MCaf177,8906129573451,24,11976,8024",
      "2024-12-04,MCaffeine,Zepto,Hyderabad,2024-12-03,3100495853,2,Green Tea Hydrogel Under Eye Patches,15MCaf225,8906129573468,22,10978,7355",
    ]

    // parse data in csv formate only needed headers similar to above strings
    const csvData = data?.data?.shipments?.map((item) => {
        return headersMapping.map(header => item[header] ?? "").join(",");
    });
    console.log("csvData: ", csvData);

    

    const csvContent = [headers.join(","), ...csvData].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "bulk_shipment_update.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const validOrdersCount = parsedOrders.filter((order) => order.status === "valid").length
  const errorOrdersCount = parsedOrders.filter((order) => order.status === "error").length

  return (
        <div className={`min-h-screen ${isDarkMode ? "dark bg-gray-900" : "bg-gray-50"}`}>

        <main className="container mx-auto p-6">
            <div className="max-w-6xl mx-auto">
            <div className="mb-8">
                <div className="flex items-center space-x-4 mb-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onNavigate("dashboard")}
                    className="p-2 h-auto hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Bulk Shipment Update</h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mt-1">Update multiple shipments using a CSV file</p>
                </div>
                </div>
            </div>

            {/* Upload Section */}
            <Card className="shadow-lg mb-8">
                <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                        <Upload className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <CardTitle className="text-xl">Upload CSV File</CardTitle>
                        <CardDescription>Select or drag and drop your CSV file containing order data</CardDescription>
                    </div>
                    </div>
                    <Button variant="outline" onClick={downloadTemplate} className="h-10">
                    <Download className="h-4 w-4 mr-2" />
                        Download Existing Data
                    </Button>
                </div>
                </CardHeader>
                <CardContent>
                {error && (
                    <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {success && (
                    <Alert className="mb-6 border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>{success}</AlertDescription>
                    </Alert>
                )}

                {/* File Upload Area */}
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
                        {file ? file.name : "Drop your CSV file here, or click to browse"}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Supports CSV files up to 10MB</p>
                    </div>
                    <div className="flex space-x-4">
                        <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="h-10">
                        <Upload className="h-4 w-4 mr-2" />
                        Select File
                        </Button>
                        {file && (
                        <Button
                            variant="outline"
                            onClick={() => {
                            setFile(null)
                            setParsedOrders([])
                            setShowPreview(false)
                            if (fileInputRef.current) {
                                fileInputRef.current.value = ""
                            }
                            }}
                            className="h-10"
                        >
                            <X className="h-4 w-4 mr-2" />
                            Remove
                        </Button>
                        )}
                    </div>
                    </div>
                </div>

                <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileSelect} className="hidden" />

                {/* Process Button */}
                {file && !showPreview && (
                    <div className="mt-6 flex justify-center">
                    <Button
                        onClick={handleProcessFile}
                        disabled={isProcessing}
                        className="h-11 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                        {isProcessing ? "Processing..." : "Process CSV File"}
                        <Eye className="h-4 w-4 ml-2" />
                    </Button>
                    </div>
                )}

                {/* Upload Progress */}
                {isUploading && (
                    <div className="mt-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Uploading orders...</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                    </div>
                )}
                </CardContent>
            </Card>

            {/* Preview Section */}
            {showPreview && parsedOrders.length > 0 && (
                <Card className="shadow-lg">
                <CardHeader className="pb-6">
                    <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
                        <Database className="h-5 w-5 text-white" />
                        </div>
                        <div>
                        <CardTitle className="text-xl">Order Preview</CardTitle>
                        <CardDescription>Review the parsed orders before uploading</CardDescription>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex space-x-2">
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            {validOrdersCount} Valid
                        </Badge>
                        {errorOrdersCount > 0 && (
                            <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                            {errorOrdersCount} Errors
                            </Badge>
                        )}
                        </div>
                        <Button
                        onClick={handleUploadOrders}
                        disabled={validOrdersCount === 0 || isUploading}
                        className="h-10 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                        >
                        {isUploading ? "Uploading..." : `Upload ${validOrdersCount} Orders`}
                        </Button>
                    </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="w-full">
                    <div className="min-w-[1400px]">
                        <Table>
                        <TableHeader>
                            <TableRow className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
                            <TableHead className="font-semibold">Status</TableHead>
                            {expectedHeaders.map((header) => (
                                <TableHead key={header} className="font-semibold">
                                {header.replace(/_/g, " ")} 
                                </TableHead>
                            ))}
                            <TableHead className="font-semibold">Errors</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {parsedOrders.map((order, index) => (
                            <TableRow
                                key={index}
                                className={`hover:bg-gray-50 dark:hover:bg-gray-800 ${
                                order.status === "error" ? "bg-red-50 dark:bg-red-950" : ""
                                }`}
                            >
                                <TableCell>
                                <Badge
                                    className={
                                    order.status === "valid"
                                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                        : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                    }
                                >
                                    {order.status === "valid" ? "Valid" : "Error"}
                                </Badge>
                                </TableCell>
                                {
                                    headersMapping.map(header => (
                                        <TableCell key={header}>
                                            {order[header] || ""}
                                        </TableCell>
                                    ))
                                }
                                <TableCell>
                                {order.errors && order.errors.length > 0 && (
                                    <div className="text-xs text-red-600 dark:text-red-400">{order.errors.join(", ")}</div>
                                )}
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
            )}
            </div>
        </main>
        </div>
  )
}
