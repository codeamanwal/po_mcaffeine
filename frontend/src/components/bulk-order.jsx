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
import { validateBulkOrderData, autoFillSkuData, calculateGmv, generateChannelSkuCode } from "@/lib/validation"

const BulkOrderPage = ({ onNavigate, isDarkMode, onToggleTheme }) => {
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

    const expectedHeaders = ["Channel", "Location", "PO Date", "PO Number", "Sr/ No", "SKU Name", "SKU Code", "Channel SKU Code", "Qty", "GMV", "PO Value"]

    // Check if all required headers are present
    const missingHeaders = expectedHeaders.filter((header) => !headers.includes(header))
    if (missingHeaders.length > 0) {
      throw new Error(`Missing required columns: ${missingHeaders.join(", ")}`)
    }

    const orders = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim().replace(/"/g, ""))

      const skuCode = values[headers.indexOf("SKU Code")] || ""
      const qty = Number.parseInt(values[headers.indexOf("Qty")]) || 0
      const channel = values[headers.indexOf("Channel")] || ""

      // Auto-fill SKU data
      const skuData = autoFillSkuData(skuCode)
      let brand = "";
      const prefix = `${skuCode}`.substring(0,3).toLowerCase();
      if(prefix === "hyp"){
        brand = "Hyphen"
      } else if(prefix === "ama"){
        brand = "Aman"
      } else if(prefix === "viv"){
        brand = "Vivek"
      } else {
        brand = "MCaffeine"
      }
      
      let order = {
        entryDate: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}-${String(new Date().getDate()).padStart(2, "0")}`,
        brand: brand ,
        brandName: brand ,
        channel: channel,
        location: values[headers.indexOf("Location")] || "",
        poDate: values[headers.indexOf("PO Date")] || "",
        poNumber: values[headers.indexOf("PO Number")] || "",
        srNo: values[headers.indexOf("Sr/ No")] || "",
        skuName: values[headers.indexOf("SKU Name")] || "",
        skuCode: values[headers.indexOf("SKU Code")] || "",
        channelSkuCode:  values[headers.indexOf("Channel SKU Code")] || "",
        qty: qty,
        gmv: Number.parseFloat(values[headers.indexOf("GMV")]) ?? 0,
        poValue: Number.parseFloat(values[headers.indexOf("PO Value")]) ?? 0,
        // poValue: skuData ? Math.round(calculateGmv(qty, skuCode) * 0.8 * 100) / 100 : 0, // Assuming 80% of GMV
        status: "valid",
        errors: [],
        warnings: [],
      }

      const yyyyMMddRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
      
      // check for checking missing some crucial data
      if(!order.channel || !order.location || !order.poNumber || !order.skuCode || !order.skuName || !order.channelSkuCode || order.qty === 0 || order.gmv === 0 || order.poValue === 0){
        order = {...order, status:"error", errors: ["Missing mandetory fields"]}
        orders.push(order)
      } else if (order.poDate && !yyyyMMddRegex.test(order.poDate)) {
        // Validate poDate format only if poDate is provided
        order = { ...order, status: "error", errors: [`Row: ${i+1} PO Date must be in yyyy-MM-dd format`] }
        orders.push(order)
      } else{
        orders.push(order)
      }
    }

    // Validate all orders using the validation utility
    const validation = validateBulkOrderData(orders)

    // Mark orders with errors
    if (!validation.isValid || validation.warnings?.length > 0) {
      orders.forEach((order, index) => {
        const orderErrors = validation.errors.filter((error) => error.startsWith(`Order ${index + 1}:`))
        const orderWarnings = validation.warnings?.filter((warning) => warning.startsWith(`Order ${index + 1}:`)) || []

        if (orderErrors.length > 0) {
          order.status = "error"
          order.errors = orderErrors.map((error) => error.replace(`Order ${index + 1}: `, ""))
        }

        if (orderWarnings.length > 0) {
          order.warnings = orderWarnings.map((warning) => warning.replace(`Order ${index + 1}: `, ""))
        }
      })

      // Add PO-level errors
      const poErrors = validation.errors.filter((error) => error.startsWith("PO "))
      if (poErrors.length > 0) {
        // Mark all orders in problematic POs as errors
        poErrors.forEach((poError) => {
          const poMatch = poError.match(/PO ([^:]+):/)
          if (poMatch) {
            const poNumber = poMatch[1]
            orders.forEach((order) => {
              if (order.poNumber === poNumber) {
                order.status = "error"
                if (!order.errors) order.errors = []
                order.errors.push(poError.replace(`PO ${poNumber}: `, ""))
              }
            })
          }
        })
      }
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
      // console.log(parsedOrders)
      setShowPreview(true)

      const validCount = orders.filter((order) => order.status === "valid").length
      const errorCount = orders.filter((order) => order.status === "error").length
      const warningCount = orders.filter((order) => order.warnings?.length > 0).length

      let message = `Successfully parsed ${orders.length} orders from CSV file`
      if (errorCount > 0) {
        message += ` (${errorCount} errors)`
      }
      if (warningCount > 0) {
        message += ` (${warningCount} warnings)`
      }

      setSuccess(message)
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

    // console.log("validOrders: ",validOrders)

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i)
        await new Promise((resolve) => setTimeout(resolve, 200))
      }

      const res = await createBulkShipment(validOrders)
      console.log("Upload response:", res.data)

      setSuccess(`Successfully uploaded ${validOrders.length} orders to the system`)

      // Reset after success
      setTimeout(() => {
        setFile(null)
        setParsedOrders([])
        setShowPreview(false)
        setSuccess("")
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      }, 3000)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to upload orders")
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const downloadTemplate = () => {
    const headers = ["Channel", "Location", "PO Date", "PO Number", "Sr/ No", "SKU Name", "SKU Code", "Channel SKU Code", "Qty", "GMV", "PO Value"]

    const sampleData = [
      "Amazon,AMD2,27-09-2025,PO_SAMPLE,1,sku-name,MCaf100,channel-sku-code,24,2400,2000",
      // "Amazon,Mumbai,27-12-2024,3100495853,2,MCaf42,22",
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
  const errorOrdersCount = parsedOrders.filter((order) => order.status !== "valid").length
  const warningOrdersCount = parsedOrders.filter((order) => order.warnings?.length > 0).length
  const validOrders = parsedOrders.filter((order) => order.status === "valid")
  const errorOrders = parsedOrders.filter((order) => order.status === "error")

  return (
    <div className={`min-h-screen `}>
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
                <p className="text-lg text-gray-600 dark:text-gray-300 mt-1">
                  Upload multiple orders using a CSV file with auto-validation
                </p>
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
                    <CardDescription>
                      Select or drag and drop your CSV file. SKU names, brands, GMV, and channel codes will be
                      auto-filled.
                    </CardDescription>
                  </div>
                </div>
                <Button variant="outline" onClick={downloadTemplate} className="h-10 bg-transparent">
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
                      <CardDescription>Review the parsed orders with auto-filled data before uploading</CardDescription>
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
                      {warningOrdersCount > 0 && (
                        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                          {warningOrdersCount} Warnings
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
                  <div className="min-w-[1600px]">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
                          <TableHead className="font-semibold">Status</TableHead>
                          <TableHead className="font-semibold">Brand</TableHead>
                          <TableHead className="font-semibold">Channel</TableHead>
                          <TableHead className="font-semibold">PO Date</TableHead>
                          <TableHead className="font-semibold">Location</TableHead>
                          <TableHead className="font-semibold">PO Number</TableHead>
                          <TableHead className="font-semibold">SKU Name</TableHead>
                          <TableHead className="font-semibold">SKU Code</TableHead>
                          <TableHead className="font-semibold">Channel SKU</TableHead>
                          <TableHead className="font-semibold">Qty</TableHead>
                          <TableHead className="font-semibold">GMV</TableHead>
                          <TableHead className="font-semibold">PO Value</TableHead>
                          <TableHead className="font-semibold">Issues</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {errorOrders?.map((order, index) => (
                          <TableRow
                            key={index}
                            className={`hover:bg-gray-50 dark:hover:bg-gray-800 ${
                              order.status === "error"
                                ? "bg-red-50 dark:bg-red-950"
                                : order.warnings?.length > 0
                                  ? "bg-yellow-50 dark:bg-yellow-950"
                                  : ""
                            }`}
                          >
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                <Badge
                                  className={
                                    order.status === "valid"
                                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                  }
                                >
                                  {order.status === "valid" ? "Valid" : "Error"}
                                </Badge>
                                {order.warnings?.length > 0 && (
                                  <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-xs">
                                    Warning
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">{order.brand}</TableCell>
                            <TableCell>{order.channel}</TableCell>
                            <TableCell>{order?.poDate}</TableCell>
                            <TableCell>{order.location}</TableCell>
                            <TableCell className="font-mono text-sm">{order.poNumber}</TableCell>
                            <TableCell className="max-w-xs truncate" title={order.skuName}>
                              {order.skuName}
                            </TableCell>
                            <TableCell className="font-mono text-sm">{order.skuCode}</TableCell>
                            <TableCell className="font-mono text-xs">{order.channelSkuCode}</TableCell>
                            <TableCell className="text-right">{order.qty}</TableCell>
                            <TableCell className="text-right">₹{order.gmv.toLocaleString()}</TableCell>
                            <TableCell className="text-right">₹{order.poValue.toLocaleString()}</TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                {order.errors && order.errors.length > 0 && (
                                  <div className="text-xs text-red-600 dark:text-red-400">
                                    <strong>Errors:</strong> {order.errors.join(", ")}
                                  </div>
                                )}
                                {order.warnings && order.warnings.length > 0 && (
                                  <div className="text-xs text-yellow-600 dark:text-yellow-400">
                                    <strong>Warnings:</strong> {order.warnings.join(", ")}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                        {validOrders?.map((order, index) => (
                          <TableRow
                            key={index}
                            className={`hover:bg-gray-50 dark:hover:bg-gray-800 ${
                              order.status === "error"
                                ? "bg-red-50 dark:bg-red-950"
                                : order.warnings?.length > 0
                                  ? "bg-yellow-50 dark:bg-yellow-950"
                                  : ""
                            }`}
                          >
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                <Badge
                                  className={
                                    order.status === "valid"
                                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                  }
                                >
                                  {order.status === "valid" ? "Valid" : "Error"}
                                </Badge>
                                {order.warnings?.length > 0 && (
                                  <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-xs">
                                    Warning
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">{order.brand}</TableCell>
                            <TableCell>{order.channel}</TableCell>
                            <TableCell>{order?.poDate}</TableCell>
                            <TableCell>{order.location}</TableCell>
                            <TableCell className="font-mono text-sm">{order.poNumber}</TableCell>
                            <TableCell className="max-w-xs truncate" title={order.skuName}>
                              {order.skuName}
                            </TableCell>
                            <TableCell className="font-mono text-sm">{order.skuCode}</TableCell>
                            <TableCell className="font-mono text-xs">{order.channelSkuCode}</TableCell>
                            <TableCell className="text-right">{order.qty}</TableCell>
                            <TableCell className="text-right">₹{order.gmv.toLocaleString()}</TableCell>
                            <TableCell className="text-right">₹{order.poValue.toLocaleString()}</TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                {order.errors && order.errors.length > 0 && (
                                  <div className="text-xs text-red-600 dark:text-red-400">
                                    <strong>Errors:</strong> {order.errors.join(", ")}
                                  </div>
                                )}
                                {order.warnings && order.warnings.length > 0 && (
                                  <div className="text-xs text-yellow-600 dark:text-yellow-400">
                                    <strong>Warnings:</strong> {order.warnings.join(", ")}
                                  </div>
                                )}
                              </div>
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

export default BulkOrderPage
