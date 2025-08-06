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
import { createBulkShipment } from "@/lib/order"


export default function BulkOrderPage({ onNavigate, isDarkMode, onToggleTheme }) {
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

    const expectedHeaders = [
      "Entry Date",
      "Brand",
      "Channel",
      "Location",
      "PO Date",
      "PO Number",
      "Sr/ No",
      "SKU Name",
      "SKU Code",
      "Channel SKU Code",
      "Qty",
      "GMV",
      "PO Value",
    ]

    // Check if all required headers are present
    const missingHeaders = expectedHeaders.filter((header) => !headers.includes(header))
    if (missingHeaders.length > 0) {
      throw new Error(`Missing required columns: ${missingHeaders.join(", ")}`)
    }

    const orders = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim().replace(/"/g, ""))
      const order = {
        entryDate: values[headers.indexOf("Entry Date")] || "",
        brand: values[headers.indexOf("Brand")] || "",
        channel: values[headers.indexOf("Channel")] || "",
        location: values[headers.indexOf("Location")] || "",
        poDate: values[headers.indexOf("PO Date")] || "",
        poNumber: values[headers.indexOf("PO Number")] || "",
        srNo: values[headers.indexOf("Sr/ No")] || "",
        skuName: values[headers.indexOf("SKU Name")] || "",
        skuCode: values[headers.indexOf("SKU Code")] || "",
        channelSkuCode: values[headers.indexOf("Channel SKU Code")] || "",
        qty: Number.parseInt(values[headers.indexOf("Qty")]) || 0,
        gmv: Number.parseFloat(values[headers.indexOf("GMV")]) || 0,
        poValue: Number.parseFloat(values[headers.indexOf("PO Value")]) || 0,
        status: "valid",
        errors: [],
      }

      // Validate order
      const errors = []
      if (!order.entryDate) errors.push("Entry Date is required")
      if (!order.brand) errors.push("Brand is required")
      if (!order.channel) errors.push("Channel is required")
      if (!order.location) errors.push("Location is required")
      if (!order.poDate) errors.push("PO Date is required")
      if (!order.poNumber) errors.push("PO Number is required")
      if (!order.srNo) errors.push("Sr/ No is required")
      if (!order.skuName) errors.push("SKU Name is required")
      if (!order.skuCode) errors.push("SKU Code is required")
      if (!order.channelSkuCode) errors.push("Channel SKU Code is required")
      if (order.qty <= 0) errors.push("Quantity must be greater than 0")
      if (order.gmv <= 0) errors.push("GMV must be greater than 0")
      if (order.poValue <= 0) errors.push("PO Value must be greater than 0")

      if (errors.length > 0) {
        order.status = "error"
        order.errors = errors
      }

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

      const res = await createBulkShipment(validOrders);

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

  const downloadTemplate = () => {
    const headers = [
      "Entry Date",
      "Brand",
      "Channel",
      "Location",
      "PO Date",
      "PO Number",
      "Sr/ No",
      "SKU Name",
      "SKU Code",
      "Channel SKU Code",
      "Qty",
      "GMV",
      "PO Value",
    ]

    const sampleData = [
      "2024-12-04,MCaffeine,Zepto,Hyderabad,2024-12-03,3100495853,1,mCaffeine Naked & Raw Coffee Espresso Body Wash,15MCaf177,8906129573451,24,11976,8024",
      "2024-12-04,MCaffeine,Zepto,Hyderabad,2024-12-03,3100495853,2,Green Tea Hydrogel Under Eye Patches,15MCaf225,8906129573468,22,10978,7355",
    ]

    const csvContent = [headers.join(","), ...sampleData].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "bulk_order_template.csv"
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
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Bulk Order Upload</h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mt-1">Upload multiple orders using a CSV file</p>
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
                  Download Template
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
                          <TableHead className="font-semibold">Entry Date</TableHead>
                          <TableHead className="font-semibold">Brand</TableHead>
                          <TableHead className="font-semibold">Channel</TableHead>
                          <TableHead className="font-semibold">Location</TableHead>
                          <TableHead className="font-semibold">PO Number</TableHead>
                          <TableHead className="font-semibold">Sr. No</TableHead>
                          <TableHead className="font-semibold">SKU Name</TableHead>
                          <TableHead className="font-semibold">SKU Code</TableHead>
                          <TableHead className="font-semibold">Qty</TableHead>
                          <TableHead className="font-semibold">GMV</TableHead>
                          <TableHead className="font-semibold">PO Value</TableHead>
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
                            <TableCell>{order.entryDate}</TableCell>
                            <TableCell>{order.brand}</TableCell>
                            <TableCell>{order.channel}</TableCell>
                            <TableCell>{order.location}</TableCell>
                            <TableCell className="font-mono text-sm">{order.poNumber}</TableCell>
                            <TableCell>{order.srNo}</TableCell>
                            <TableCell className="max-w-xs truncate" title={order.skuName}>
                              {order.skuName}
                            </TableCell>
                            <TableCell className="font-mono text-sm">{order.skuCode}</TableCell>
                            <TableCell className="text-right">{order.qty}</TableCell>
                            <TableCell className="text-right">₹{order.gmv.toLocaleString()}</TableCell>
                            <TableCell className="text-right">₹{order.poValue.toLocaleString()}</TableCell>
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
