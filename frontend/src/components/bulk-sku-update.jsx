"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle, Loader2, Upload, Save, X, Download } from "lucide-react"
import { useUserStore } from "@/store/user-store"
import { validateBulkSkuData } from "@/lib/validation"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"
import { updateBulkSkus } from "@/lib/order"

function stripQuotes(value) {
  let v = value?.trim() ?? ""
  if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1)
  return v.trim()
}

function isAllEmpty(values) {
  return values.every((v) => stripQuotes(v) === "")
}

export default function BulkSkuUpdateModal({
  isOpen,
  onClose,
  poFormatData = [],
  onSave,
}) {
  const { user } = useUserStore()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [csvFile, setCsvFile] = useState(null)
  const [csvData, setCsvData] = useState([])
  const [parsedData, setParsedData] = useState([])
  const [reason, setReason] = useState("")
  const [validationResults, setValidationResults] = useState({ isValid: false, errors: [], warnings: [] })

  const isWarehouse = user?.role === "warehouse"
  const isSuperAdmin = user?.role === "superadmin"
  const hasAccess = isWarehouse || isSuperAdmin

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setCsvFile(null)
      setCsvData([])
      setParsedData([])
      setReason("")
      setError("")
      setSuccess("")
      setValidationResults({ isValid: false, errors: [], warnings: [] })
    }
  }, [isOpen])

  // Parse CSV content
  const parseCsvContent = (content) => {
    const rawLines = content.split(/\r?\n/)
    // find header line (ignore leading blank lines)
    const headerIndex = rawLines.findIndex((l) => l && l.trim() !== "")
    if (headerIndex === -1) {
      throw new Error("CSV file must contain a header row")
    }

    const headerRaw = rawLines[headerIndex].replace(/^\uFEFF/, "") // remove BOM
    const headers = headerRaw.split(",").map((h) => stripQuotes(h).toLowerCase())

    const expectedHeaders = ["uid", "ponumber", "skucode", "updatedqty"]
    const missingHeaders = expectedHeaders.filter((h) => !headers.includes(h))
    if (missingHeaders.length > 0) {
      throw new Error(`Missing required headers: ${missingHeaders.join(", ")}. Expected: ${expectedHeaders.join(", ")}`)
    }

    const data = []
    // iterate through the rest of the lines
    for (let i = headerIndex + 1; i < rawLines.length; i++) {
      const line = rawLines[i]
      const rowNumber = i + 1 // 1-based for user-friendly reporting
      if (!line || line.trim() === "") {
        // ignore empty row
        continue
      }

      let values = line.split(",")
      // ignore rows where all cells are empty
      if (isAllEmpty(values)) continue

      // normalize length: pad or slice so mapping doesn't throw
      if (values.length < headers.length) {
        values = values.concat(Array(headers.length - values.length).fill(""))
      } else if (values.length > headers.length) {
        values = values.slice(0, headers.length)
      }

      // build row object with normalized, de-quoted cells
      const row = {}
      headers.forEach((header, index) => {
        row[header] = stripQuotes(values[index] ?? "")
      })

      const uid = row["uid"]
      const poNumber = row["ponumber"]
      const skuCode = row["skucode"]
      const updatedQtyRaw = row["updatedqty"]

      // if required cells are empty, IGNORE the row (do not error)
      if (!poNumber || !skuCode || !updatedQtyRaw) {
        continue
      }

      // updatedQty must be a non-negative integer; if not, IGNORE the row
      const updatedQty = Number.parseFloat(updatedQtyRaw)
      if (Number.isNaN(updatedQty) || updatedQty < 0 || !Number.isInteger(updatedQty)) {
        continue
      }

      data.push({
        uid,
        poNumber,
        skuCode,
        updatedQty,
        rowNumber,
      })
    }

    // if headers existed but no valid rows after ignoring blanks, allow flow to continue
    return data
  }

  // Calculate updated values based on original data
  const calculateUpdatedValues = (originalSku, newQty) => {
    const baseQty = Number(originalSku.qty ?? 0)
    const baseGMV = Number(originalSku.gmv ?? 0)
    const basePOV = Number(originalSku.poValue ?? 0)

    if (baseQty === 0) return { updatedGmv: 0, updatedPoValue: 0 }

    const unitGmv = baseGMV / baseQty
    const unitPo = basePOV / baseQty
    const updatedGmv = Math.round(unitGmv * newQty * 100) / 100
    const updatedPoValue = Math.round(unitPo * newQty * 100) / 100

    return { updatedGmv, updatedPoValue }
  }

  // Process CSV data and match with existing PO data
  const processAndValidateData = (csvRows) => {
    const processedData = csvRows.map((csvRow) => {
      // Find matching PO record
      const matchingRecord = poFormatData.find(
        (po) =>
          po.uid?.toString() === (csvRow?.uid ?? "").toString() &&
          po.poNumber?.toString() === csvRow.poNumber.toString() &&
          po.skuCode?.toString() === csvRow.skuCode.toString(),
      )

      if (!matchingRecord) {
        return {
          ...csvRow,
          error: `No matching record found for PO: ${csvRow.poNumber}, SKU: ${csvRow.skuCode}`,
        }
      }

      const originalQty = Number(matchingRecord.qty ?? 0)
      const originalGmv = Number(matchingRecord.gmv ?? 0)
      const originalPoValue = Number(matchingRecord.poValue ?? 0)

      // Validate quantity constraints
      if (csvRow.updatedQty > originalQty) {
        return {
          ...csvRow,
          originalQty,
          originalGmv,
          originalPoValue,
          error: `Updated quantity (${csvRow.updatedQty}) cannot exceed original quantity (${originalQty})`,
        }
      }

      // Calculate new values
      const { updatedGmv, updatedPoValue } = calculateUpdatedValues(matchingRecord, csvRow.updatedQty)

      return {
        ...csvRow,
        originalQty,
        originalGmv,
        originalPoValue,
        calculatedGmv: updatedGmv,
        calculatedPoValue: updatedPoValue,
        matchingRecord,
      }
    })

    return processedData
  }

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith(".csv")) {
      setError("Please upload a CSV file")
      return
    }

    setCsvFile(file)
    setError("")
    setSuccess("")

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = String(e.target?.result ?? "")
        const parsed = parseCsvContent(content)
        setCsvData(parsed)

        // Process and validate against existing data
        const processed = processAndValidateData(parsed)
        setParsedData(processed)

        // Validate the processed data
        const validation = validateBulkSkuData(processed)
        setValidationResults(validation)

        if (validation.isValid) {
          setSuccess(`Successfully parsed ${parsed.length} records from CSV`)
        } else {
          setError(
            `Validation failed: ${validation.errors.slice(0, 3).join(", ")}${
              validation.errors.length > 3 ? "..." : ""
            }`,
          )
        }
      } catch (err) {
        setError(`CSV parsing error: ${err?.message ?? "Unknown error"}`)
        setCsvData([])
        setParsedData([])
      }
    }
    reader.readAsText(file)
  }

  // Download CSV template
  const downloadTemplate = () => {
    const template = `uid,poNumber,skuCode,updatedQty
1,PO_SAMPLE,MCaf100,1`

    const blob = new Blob([template], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", "bulk_sku_update_template.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Handle save
  const handleSave = async () => {
    if (!parsedData.length) {
      setError("Please upload and validate a CSV file first")
      return
    }

    if (!validationResults.isValid) {
      setError("Please fix validation errors before saving")
      return
    }

    // if (isWarehouse && !reason.trim()) {
    //   setError("Reason is required for quantity updates")
    //   return
    // }

    const validRecords = parsedData.filter((record) => !record.error)
    if (validRecords.length === 0) {
      setError("No valid records to update")
      return
    }

    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      // Prepare bulk update data
      const bulkUpdateData = validRecords.map((record) => ({
        ...record.matchingRecord,
        updatedQty: record.updatedQty,
        updatedGmv: record.calculatedGmv,
        updatedPoValue: record.calculatedPoValue,
        updateReason: reason.trim(),
        updatedBy: user?.username || user?.email,
      }))

      const res = await updateBulkSkus(bulkUpdateData)
      console.log("Bulk SKU Update Data:", bulkUpdateData)
      console.log(res.data)

      setSuccess(res.data?.msg ?? `Successfully updated ${validRecords.length} SKU(s) from CSV`)
      toast.success(`Successfully updated ${validRecords.length} SKU(s) from CSV`)

      onSave?.(bulkUpdateData)

      setTimeout(() => {
        onClose()
      }, 1500)
    } catch (err) {
      console.error("Bulk CSV update error:", err)
      const errorMessage = err?.message || "Failed to update SKUs from CSV. Please try again."
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    onClose()
    setError("")
    setSuccess("")
  }

  if (!hasAccess) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Access Denied
            </DialogTitle>
            <DialogDescription>
              Only warehouse users and super administrators can perform bulk SKU updates.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Button variant="outline" onClick={handleClose}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const validRecords = parsedData.filter((record) => !record.error)
  const errorRecords = parsedData.filter((record) => record.error)

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[95vw] md:max-w-5xl max-h-[95vh] overflow-x-hidden overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            <span>Bulk SKU Update from CSV</span>
            {parsedData.length > 0 && (
              <Badge variant="outline" className="ml-2">
                {validRecords.length} Valid / {parsedData.length} Total
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            Upload a CSV file to bulk update SKU quantities. Only updatedQty will be modified, with automatic GMV and PO
            Value calculations.
            {isWarehouse && " As a warehouse user, you must provide a reason for quantity updates."}
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
        </div>

        {/* CSV Upload Section */}
        <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
          <CardHeader>
            <CardTitle className="text-sm flex items-center justify-between">
              <span>CSV File Upload</span>
              <Button variant="outline" size="sm" onClick={downloadTemplate}>
                <Download className="h-4 w-4 mr-2" />
                Download Template
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="csv-file">Select CSV File</Label>
              <Input id="csv-file" type="file" accept=".csv" onChange={handleFileUpload} className="cursor-pointer" />
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              <p>
                <strong>Required columns:</strong> shipmentUid, poNumber, skuCode, updatedQty
              </p>
              <p>
                <strong>Format:</strong> CSV with comma-separated values
              </p>
              <p>
                <strong>Note:</strong> updatedQty must be ≤ original quantity and be a whole number
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-gray-500">
            {parsedData.length > 0
              ? `${validRecords.length} valid records ready for update`
              : "Upload a CSV file to begin"}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose} disabled={isLoading}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={validRecords.length === 0 || !validationResults.isValid || isLoading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Update {validRecords.length} SKU(s)
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Validation Results */}
        {parsedData.length > 0 && (
          <>
            <Separator />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Validation Results</h3>
                <div className="flex gap-2">
                  {validRecords.length > 0 && (
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      {validRecords.length} Valid
                    </Badge>
                  )}
                  {errorRecords.length > 0 && <Badge variant="destructive">{errorRecords.length} Errors</Badge>}
                </div>
              </div>

              <ScrollArea className="max-h-[40vh] pr-3">
                <div className="space-y-3">
                  {/* Valid Records */}
                  {validRecords.length > 0 && (
                    <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-green-800 dark:text-green-200">
                          Valid Records ({validRecords.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {validRecords.map((record, index) => (
                            <div key={index} className="text-xs bg-white dark:bg-gray-900 p-2 rounded border">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                <div>
                                  <strong>UID:</strong> {String(record.uid ?? "")}
                                </div>
                                <div>
                                  <strong>PO:</strong> {record.poNumber}
                                </div>
                                <div>
                                  <strong>SKU:</strong> {record.skuCode}
                                </div>
                                <div>
                                  <strong>Qty:</strong> {record.originalQty} → {record.updatedQty}
                                </div>
                                <div>
                                  <strong>GMV:</strong> {record.originalGmv} → {record.calculatedGmv}
                                </div>
                                <div>
                                  <strong>PO Value:</strong> {record.originalPoValue} → {record.calculatedPoValue}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Error Records */}
                  {errorRecords.length > 0 && (
                    <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-red-800 dark:text-red-200">
                          Records with Errors ({errorRecords.length})
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {errorRecords.map((record, index) => (
                            <div key={index} className="text-xs bg-white dark:bg-gray-900 p-2 rounded border">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <div>
                                  <strong>Row {record.rowNumber}:</strong> UID: {String(record.uid ?? "")}, PO:{" "}
                                  {record.poNumber}, SKU: {record.skuCode}
                                </div>
                                <div className="text-red-600 dark:text-red-400">
                                  <strong>Error:</strong> {record.error}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
                <ScrollBar orientation="vertical" />
              </ScrollArea>
            </div>
          </>
        )}

        {/* Reason field for warehouse users */}
        {isWarehouse && validRecords.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="reason" className="text-sm font-medium">
                Reason for Quantity Updates <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="reason"
                placeholder="Please provide a reason for updating the quantities..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full"
                rows={3}
              />
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
