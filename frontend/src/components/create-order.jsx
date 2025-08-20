"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  CalendarIcon,
  AlertCircle,
  CheckCircle,
  Plus,
  Trash2,
  Package,
  ShoppingCart,
  ArrowLeft,
  Save,
} from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import NavigationHeader from "@/components/header"
import { createShipmentOrder } from "@/lib/order"




const brands = ["mCaffine", "MCaffeine", "Other Brand"]
const facilities = ["Delhi WH1", "Mumbai WH1", "Mumbai WH2", "Bangalore WH1", "Hyderabad WH1", "Chennai WH1"]
const channels = ["Amazon", "Flipkart", "Zepto", "Nykaa", "BigBasket", "Swiggy Instamart", "Blinkit"]
const locations = ["New Delhi", "Mumbai", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune"]

export default function CreateOrderPage({ onNavigate, isDarkMode, onToggleTheme }) {
  const [shipmentOrder, setShipmentOrder] = useState({
    entryDate: new Date(),
    brand: "",
    poDate: undefined,
    facility: "",
    channel: "",
    location: "",
    poNumber: "",
  })

  const [skuOrders, setSkuOrders] = useState([
    {
      id: "1",
      srNo: "1",
      skuName: "",
      skuCode: "",
      channelSkuCode: "",
      qty: "",
      gmv: "",
      poValue: "",
    },
  ])

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleShipmentChange = (field, value) => {
    setShipmentOrder((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSkuChange = (id, field, value) => {
    setSkuOrders((prev) =>
      prev.map((sku) =>
        sku.id === id
          ? {
              ...sku,
              [field]: value,
            }
          : sku,
      ),
    )
  }

  const addSkuOrder = () => {
    const newId = (skuOrders.length + 1).toString()
    const newSku = {
      id: newId,
      srNo: newId,
      skuName: "",
      skuCode: "",
      channelSkuCode: "",
      qty: "",
      gmv: "",
      poValue: "",
    }
    setSkuOrders((prev) => [...prev, newSku])
  }

  const removeSkuOrder = (id) => {
    if (skuOrders.length > 1) {
      setSkuOrders((prev) => prev.filter((sku) => sku.id !== id))
    }
  }

  const validateForm = () => {
    // Validate shipment order
    const requiredShipmentFields = ["brand", "facility", "channel", "location", "poNumber"]
    for (const field of requiredShipmentFields) {
      if (!shipmentOrder[field]) {
        return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
      }
    }

    if (!shipmentOrder.entryDate || !shipmentOrder.poDate) {
      return "Entry Date and PO Date are required"
    }

    // Validate SKU orders
    for (let i = 0; i < skuOrders.length; i++) {
      const sku = skuOrders[i]
      const requiredSkuFields = ["srNo", "skuName", "skuCode", "channelSkuCode", "qty", "gmv", "poValue"]

      for (const field of requiredSkuFields) {
        if (!sku[field]) {
          return `SKU ${i + 1}: ${field.charAt(0).toUpperCase() + field.slice(1)} is required`
        }
      }

      // Validate numeric fields
      if (Number.isNaN(Number(sku.qty)) || Number(sku.qty) <= 0) {
        return `SKU ${i + 1}: Quantity must be a positive number`
      }
      if (Number.isNaN(Number(sku.gmv)) || Number(sku.gmv) <= 0) {
        return `SKU ${i + 1}: GMV must be a positive number`
      }
      if (Number.isNaN(Number(sku.poValue)) || Number(sku.poValue) <= 0) {
        return `SKU ${i + 1}: PO Value must be a positive number`
      }
    }

    return null
  }

  const handleSave = async () => {
    setIsLoading(true)
    setError("")
    setSuccess("")

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      setIsLoading(false)
      return
    }

    try {
      // Format data for API
      const apiData = {
        shipmentOrder: {
          entryDate: shipmentOrder.entryDate ? format(shipmentOrder.entryDate, "dd-MM-yyyy") : "",
          brandName: shipmentOrder.brand,
          poDate: shipmentOrder.poDate ? format(shipmentOrder.poDate, "dd-MM-yyyy") : "",
          facility: shipmentOrder.facility,
          channel: shipmentOrder.channel,
          location: shipmentOrder.location,
          poNumber: shipmentOrder.poNumber,
        },
        skuOrders: skuOrders.map((sku) => ({
          srNo: sku.srNo,
          skuName: sku.skuName,
          skuCode: sku.skuCode,
          channelSkuCode: sku.channelSkuCode,
          qty: Number.parseInt(sku.qty),
          gmv: Number.parseFloat(sku.gmv),
          poValue: Number.parseFloat(sku.poValue),
        })),
      }

      // Simulate API call
      // await new Promise((resolve) => setTimeout(resolve, 1500))
      const res = await createShipmentOrder(apiData)
      console.log("Order created:", apiData)
      console.log("res:", res.data)
      setSuccess("Shipment order created successfully!")

      // Reset form after success
      setTimeout(() => {
        resetForm()
      }, 2000)
    } catch (err) {
      setError("Failed to create shipment order")
    }

    setIsLoading(false)
  }

  const resetForm = () => {
    setShipmentOrder({
      entryDate: new Date(),
      brand: "",
      poDate: undefined,
      facility: "",
      channel: "",
      location: "",
      poNumber: "",
    })
    setSkuOrders([
      {
        id: "1",
        srNo: "1",
        skuName: "",
        skuCode: "",
        channelSkuCode: "",
        qty: "",
        gmv: "",
        poValue: "",
      },
    ])
    setError("")
    setSuccess("")
  }

  // Calculate totals
  const totalQty = skuOrders.reduce((sum, sku) => sum + (Number.parseInt(sku.qty) || 0), 0)
  const totalGmv = skuOrders.reduce((sum, sku) => sum + (Number.parseFloat(sku.gmv) || 0), 0)
  const totalPoValue = skuOrders.reduce((sum, sku) => sum + (Number.parseFloat(sku.poValue) || 0), 0)

  return (
    <div className={`min-h-screen h-full ${isDarkMode ? "dark bg-gray-900" : "bg-gray-50"}`}>
      {/* <NavigationHeader
        currentPage="create-order"
        onNavigate={onNavigate}
        isDarkMode={isDarkMode}
        onToggleTheme={onToggleTheme}
      /> */}

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
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Create Shipment Order</h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mt-1">
                  Create a new shipment order with multiple SKU items
                </p>
              </div>
            </div>
          </div>

          <ScrollArea className=" pr-4">
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

              {/* Shipment Order Information */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <ShoppingCart className="h-5 w-5" />
                    <span>Shipment Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Date Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Entry Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full h-10 justify-start text-left font-normal",
                              !shipmentOrder.entryDate && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {shipmentOrder.entryDate ? format(shipmentOrder.entryDate, "PPP") : "Pick entry date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={shipmentOrder.entryDate}
                            onSelect={(date) => handleShipmentChange("entryDate", date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">PO Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full h-10 justify-start text-left font-normal",
                              !shipmentOrder.poDate && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {shipmentOrder.poDate ? format(shipmentOrder.poDate, "PPP") : "Pick PO date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={shipmentOrder.poDate}
                            onSelect={(date) => handleShipmentChange("poDate", date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Brand *</Label>
                      <Select
                        value={shipmentOrder.brand}
                        onValueChange={(value) => handleShipmentChange("brand", value)}
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Select brand" />
                        </SelectTrigger>
                        <SelectContent>
                          {brands.map((brand) => (
                            <SelectItem key={brand} value={brand}>
                              {brand}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Facility *</Label>
                      <Select
                        value={shipmentOrder.facility}
                        onValueChange={(value) => handleShipmentChange("facility", value)}
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Select facility" />
                        </SelectTrigger>
                        <SelectContent>
                          {facilities.map((facility) => (
                            <SelectItem key={facility} value={facility}>
                              {facility}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Channel *</Label>
                      <Select
                        value={shipmentOrder.channel}
                        onValueChange={(value) => handleShipmentChange("channel", value)}
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Select channel" />
                        </SelectTrigger>
                        <SelectContent>
                          {channels.map((channel) => (
                            <SelectItem key={channel} value={channel}>
                              {channel}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Location *</Label>
                      <Select
                        value={shipmentOrder.location}
                        onValueChange={(value) => handleShipmentChange("location", value)}
                      >
                        <SelectTrigger className="h-10">
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          {locations.map((location) => (
                            <SelectItem key={location} value={location}>
                              {location}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="poNumber" className="text-sm font-medium">
                        PO Number *
                      </Label>
                      <Input
                        id="poNumber"
                        type="text"
                        placeholder="Enter PO number"
                        value={shipmentOrder.poNumber}
                        onChange={(e) => handleShipmentChange("poNumber", e.target.value)}
                        className="h-10"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* SKU Orders */}
              <Card className="shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Package className="h-5 w-5" />
                      <span>SKU Orders ({skuOrders.length})</span>
                    </CardTitle>
                    <Button
                      type="button"
                      onClick={addSkuOrder}
                      className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add SKU
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {skuOrders.map((sku, index) => (
                    <div key={sku.id} className="border rounded-lg p-4 space-y-4 bg-gray-50 dark:bg-gray-800">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900 dark:text-white">SKU Order #{sku.srNo}</h4>
                        {skuOrders.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeSkuOrder(sku.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Sr. No *</Label>
                          <Input
                            type="text"
                            placeholder="Serial number"
                            value={sku.srNo}
                            onChange={(e) => handleSkuChange(sku.id, "srNo", e.target.value)}
                            className="h-10"
                          />
                        </div>

                        <div className="space-y-2 md:col-span-3">
                          <Label className="text-sm font-medium">SKU Name *</Label>
                          <Input
                            type="text"
                            placeholder="Enter SKU name"
                            value={sku.skuName}
                            onChange={(e) => handleSkuChange(sku.id, "skuName", e.target.value)}
                            className="h-10"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium">SKU Code *</Label>
                          <Input
                            type="text"
                            placeholder="SKU code"
                            value={sku.skuCode}
                            onChange={(e) => handleSkuChange(sku.id, "skuCode", e.target.value)}
                            className="h-10"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Channel SKU Code *</Label>
                          <Input
                            type="text"
                            placeholder="Channel SKU code"
                            value={sku.channelSkuCode}
                            onChange={(e) => handleSkuChange(sku.id, "channelSkuCode", e.target.value)}
                            className="h-10"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Quantity *</Label>
                          <Input
                            type="number"
                            placeholder="0"
                            value={sku.qty}
                            onChange={(e) => handleSkuChange(sku.id, "qty", e.target.value)}
                            className="h-10"
                            min="1"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium">GMV (₹) *</Label>
                          <Input
                            type="number"
                            placeholder="0.00"
                            value={sku.gmv}
                            onChange={(e) => handleSkuChange(sku.id, "gmv", e.target.value)}
                            className="h-10"
                            min="0"
                            step="0.01"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium">PO Value (₹) *</Label>
                          <Input
                            type="number"
                            placeholder="0.00"
                            value={sku.poValue}
                            onChange={(e) => handleSkuChange(sku.id, "poValue", e.target.value)}
                            className="h-10"
                            min="0"
                            step="0.01"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Totals Summary */}
                  <Separator />
                  <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">Order Summary</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-blue-800 dark:text-blue-200">Total Quantity:</span>
                        <span className="font-medium text-blue-900 dark:text-blue-100">
                          {totalQty.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-800 dark:text-blue-200">Total GMV:</span>
                        <span className="font-medium text-blue-900 dark:text-blue-100">
                          ₹{totalGmv.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-800 dark:text-blue-200">Total PO Value:</span>
                        <span className="font-medium text-blue-900 dark:text-blue-100">
                          ₹{totalPoValue.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>

          <div className="flex justify-end space-x-4 pt-6 border-t mt-6 bg-white dark:bg-gray-900 sticky bottom-0">
            <Button
              variant="outline"
              onClick={() => onNavigate("dashboard")}
              disabled={isLoading}
              className="h-11 px-6"
            >
              Cancel
            </Button>
            <Button variant="outline" onClick={resetForm} disabled={isLoading} className="h-11 px-6 bg-transparent">
              Reset Form
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="h-11 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Creating..." : "Create Shipment Order"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
