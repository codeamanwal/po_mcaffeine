"use client"


import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2, Upload, X, Download } from "lucide-react"
import { parseExcelFile, validateRowsForEmptyCells } from "@/lib/excel-parser"
import { getMasterSheetData, uploadMasterSheetData } from "@/lib/master-sheets-api"
import { generateExcelTemplate } from "@/lib/excel-template-generator"
import { MASTER_SHEETS_CONFIG } from "@/lib/master-sheets-config"
import { generateExcelWithData } from "@/lib/excel-template-generator"


export function MasterSheetUpload({ sheetType }) {
  const [isLoading, setIsLoading] = useState(false)
  const [uploadStats, setUploadStats] = useState(null)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [validPreview, setValidPreview] = useState([])
  const [invalidPreview, setInvalidPreview] = useState([])
  const [isDownloading, setIsDownloading] = useState(false)

  const config = MASTER_SHEETS_CONFIG[sheetType]
  const requiredColumns = config.expectedColumns;
  const requiredColumnsLabel = config.expectedColumns.map((col) => col.label)
  const requiredColumnsKey = config.expectedColumns.map((col) => col.key)

  const handleDownloadTemplate = async () => {
    setIsDownloading(true)
    try {
      await generateExcelTemplate(sheetType, config.name, requiredColumnsLabel)
    } catch (err) {
      console.error("Template download error:", err)
      setError("Failed to download template")
    } finally {
      setIsDownloading(false)
    }
  }

  const handleDownloadSheetData = async () => {
    setIsDownloading(true);
    try {
      const res = await getMasterSheetData(sheetType);
      console.log(res);
      await generateExcelWithData(config.name, requiredColumns, res.data.data)
    } catch (error) {
      console.error("Master Sheet download error:", error)
      setError("Failed to download master sheet")
    } finally {
      setIsDownloading(false);
    }
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    setSuccess(false)
    setIsLoading(true)
    
    try {
      // console.log("labels: ", requiredColumnsLabel)
      // console.log("keys: ", requiredColumnsKey)
      // Parse Excel file
      const { rows, emptyRowsCount } = await parseExcelFile(file, requiredColumns)
      // console.log("rows: ", rows)

      // Validate rows for empty cells in required columns
      const { validRows, invalidRows, invalidRowsCount } = validateRowsForEmptyCells(rows, requiredColumnsKey)
      // console.log("invalidRows: ", invalidRows)
      // console.log("validRows: ", validRows)
      const totalRows = rows.length
      const stats = {
        totalRows,
        validRows: validRows.length,
        emptyRows: emptyRowsCount,
        invalidRows: invalidRowsCount,
        skippedRows: emptyRowsCount + invalidRowsCount,
      }

      setUploadStats(stats)
      // setPreview([...invalidRows, ...validRows]) // Show first 5 rows as preview
      setValidPreview([...validRows])
      setInvalidPreview([...invalidRows])


      if (validRows.length === 0) {
        setError("No valid data found in the file. Please check your sheet.")
        setIsLoading(false)
        return
      }

      // Upload to backend
      // console.log(sheetType, validRows);
      const response = await uploadMasterSheetData(sheetType, validRows)
      // const response = {status: 200};

      if (response.status === 200 || response.status === 201) {
        setSuccess(true)
        setError(null)
        // Reset file input
        if (e.target) e.target.value = ""
      } else {
        setError(response.data?.msg || "Upload failed")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)
      console.error("Upload error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{config.name}</CardTitle>
        <CardDescription>Upload an Excel file with the required columns: <span className="text-foreground font-semibold">{requiredColumnsLabel.join(", ")}</span></CardDescription>
        <div className="my-2 w-full">
          {/* template download */}
          <Button
            onClick={handleDownloadTemplate}
            disabled={isDownloading}
            variant="outline"
            size="sm"
            className="rounded-sm mx-3 gap-2 bg-green-300 dark:bg-green-300 dark:text-black dark:hover:text-white"
          >
            <Download className="w-4 h-4" />
            {isDownloading ? "Downloading..." : "Download Template"}
          </Button>
          {/* master sheet data download  */}
          <Button
            onClick={handleDownloadSheetData}
            disabled={isDownloading}
            variant="outline"
            size="sm"
            className="rounded-sm mx-3 gap-2 bg-green-300 dark:bg-green-300 dark:text-black dark:hover:text-white"
          >
            <Download className="w-4 h-4" />
            {isDownloading ? "Downloading..." : "Download Master Sheet"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Upload */}
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor={`file-upload-${sheetType}`}
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-2 text-gray-500" />
              <p className="text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500 mt-1">Excel (.xlsx) files only</p>
            </div>
            <input
              id={`file-upload-${sheetType}`}
              type="file"
              accept=".xlsx"
              onChange={handleFileUpload}
              disabled={isLoading}
              className="hidden"
            />
          </label>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Success Alert */}
        {success && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Successfully uploaded {uploadStats?.validRows} records to {config.name}
            </AlertDescription>
          </Alert>
        )}

        {/* Upload Statistics */}
        {uploadStats && (
          <div className="bg-background p-4 rounded-lg space-y-2">
            <h4 className="font-semibold text-sm">Upload Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Total Rows:</span>
                <p className="font-semibold">{uploadStats.totalRows}</p>
              </div>
              <div>
                <span className="text-gray-600">Valid Rows:</span>
                <p className="font-semibold text-green-600">{uploadStats.validRows}</p>
              </div>
              <div>
                <span className="text-gray-600">Empty Rows:</span>
                <p className="font-semibold text-yellow-600">{uploadStats.emptyRows}</p>
              </div>
              <div>
                <span className="text-gray-600">Invalid Rows:</span>
                <p className="font-semibold text-red-600">{uploadStats.invalidRows}</p>
              </div>
            </div>
          </div>
        )}

        {/* Invalid Preview */}
        {invalidPreview.length > 0 && (
          <div className="overflow-x-auto">
            <h4 className="font-semibold text-sm mb-2">Invalid Row Preview</h4>
            <table className="w-full text-xs border border-gray-200 rounded-lg">
              <thead className="bg-red-400">
                <tr>
                  {requiredColumnsLabel.map((col) => (
                    <th key={col} className="px-3 py-2 text-left border border-gray-200">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {invalidPreview.map((row, idx) => (
                  <tr key={idx} className="hover:bg-red-400">
                    {requiredColumnsLabel.map((col) => (
                      <td key={`${idx}-${col}`} className="px-3 py-2 border border-gray-200">
                        {row[col] !== null ? String(row[col]) : "-"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Valid Preview */}
        {validPreview.length > 0 && (
          <div className="overflow-x-auto">
            <h4 className="font-semibold text-sm mb-2">Valid Row Preview</h4>
            <table className="w-full text-xs border border-gray-200 rounded-lg">
              <thead className="bg-green-300">
                <tr>
                  {requiredColumnsLabel.map((col) => (
                    <th key={col} className="px-3 py-2 text-left border border-gray-200">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {validPreview.map((row, idx) => (
                  <tr key={idx} className="dark:hover:text-black hover:bg-green-200">
                    {requiredColumnsKey.map((col) => (
                      <td key={`${idx}-${col}`} className="px-3 py-2 border border-gray-200">
                        {row[col] !== null ? String(row[col]) : "-"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Action Buttons */}
        {uploadStats && (
          <div className="flex gap-2">
            <Button
              onClick={() => {
                setUploadStats(null)
                setPreview([])
                setSuccess(false)
              }}
              variant="outline"
              className="w-full"
            >
              <X className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
