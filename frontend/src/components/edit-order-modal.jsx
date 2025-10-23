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
import { ScrollArea } from "@/components/ui/scroll-area"
import { CalendarIcon, AlertCircle, CheckCircle, Save, X } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { poFormatDataType } from "@/constants/data_type"

export default function EditOrderModal({ isOpen, onClose, orderData, onSave }) {
  const [formData, setFormData] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    if (orderData) {
      // Convert date strings to Date objects for date fields
      const processedData = { ...orderData }
      poFormatDataType.forEach((field) => {
        if (field.type === "date" && processedData[field.fieldName]) {
          const dateValue = processedData[field.fieldName]
          if (dateValue && dateValue !== "1900/01/00" && dateValue !== "") {
            try {
              // Handle different date formats
              let parsedDate
              if (dateValue.includes("-")) {
                const [day, month, year] = dateValue.split("-")
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
  }, [orderData])

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
      poFormatDataType.forEach((field) => {
        if (field.type === "date" && dataToSave[field.fieldName] instanceof Date) {
          dataToSave[field.fieldName] = format(dataToSave[field.fieldName], "yyyy-MM-dd")
        }
      })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      localStorage.setItem("orderData", JSON.stringify(dataToSave))
      onSave(dataToSave)
      setSuccess("Order updated successfully!")

      setTimeout(() => {
        onClose()
      }, 1500)
    } catch (err) {
      setError("Failed to update order")
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
            <Select value={value || ""} onValueChange={(newValue) => handleInputChange(field.fieldName, newValue)}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.filter(option => option && option !== "").map((option) => (
                  <SelectItem key={option} value={option}>
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Save className="h-5 w-5" />
            <span>Edit Order</span>
          </DialogTitle>
          <DialogDescription>Update the order information. All changes will be saved to the system.</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] px-2 w-full">
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

            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {poFormatDataType.slice(0, 13).map((field) => (
                  <div key={field.fieldName}>{renderField(field)}</div>
                ))}
              </div>
            </div>

            {/* Updated Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">Updated Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {poFormatDataType.slice(13, 18).map((field) => (
                  <div key={field.fieldName}>{renderField(field)}</div>
                ))}
              </div>
            </div>

            {/* Operational Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b px-2">
                Operational Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {poFormatDataType.slice(18, 28).map((field) => (
                  <div key={field.fieldName}>{renderField(field)}</div>
                ))}
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">
                Additional Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {poFormatDataType.slice(28).map((field) => (
                  <div key={field.fieldName}>{renderField(field)}</div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

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
