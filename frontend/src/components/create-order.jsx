"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, AlertCircle, CheckCircle, Package, ArrowLeft } from 'lucide-react'
import { format } from "date-fns"
import NavigationHeader from "@/components/header"
import { cn } from "@/lib/utils"

export default function CreateOrderPage({ onNavigate, isDarkMode, onToggleTheme }) {
  const [orderData, setOrderData] = useState({
    entryDate: new Date(),
    brand: "",
    channel: "",
    location: "",
    poDate: undefined,
    poNumber: "",
    srNo: "",
    skuName: "",
    skuCode: "",
    channelSkuCode: "",
    qty: "",
    gmv: "",
    poValue: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const brands = ["MCaffeine", "Other Brand"]
  const channels = ["Zepto", "Amazon", "Flipkart", "Nykaa", "BigBasket", "Swiggy Instamart", "Blinkit"]
  const locations = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune"]

  const handleInputChange = (field, value) => {
    setOrderData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    // Validation
    const requiredFields = [
      "brand",
      "channel",
      "location",
      "poNumber",
      "srNo",
      "skuName",
      "skuCode",
      "channelSkuCode",
      "qty",
      "gmv",
      "poValue",
    ]

    for (const field of requiredFields) {
      if (!orderData[field] || orderData[field] === "") {
        setError(`${field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())} is required`)
        setIsLoading(false)
        return
      }
    }

    if (!orderData.entryDate || !orderData.poDate) {
      setError("Entry Date and PO Date are required")
      setIsLoading(false)
      return
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock success
    setSuccess("Order created successfully!")
    
    // Reset form after success
    setTimeout(() => {
      setOrderData({
        entryDate: new Date(),
        brand: "",
        channel: "",
        location: "",
        poDate: undefined,
        poNumber: "",
        srNo: "",
        skuName: "",
        skuCode: "",
        channelSkuCode: "",
        qty: "",
        gmv: "",
        poValue: "",
      })
      setSuccess("")
    }, 2000)

    setIsLoading(false)
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark bg-gray-900" : "bg-gray-50"}`}>
      

      <main className="container mx-auto p-6">
        <div className="max-w-4xl mx-auto">
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
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Order</h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mt-1">
                  Add a single order to the system
                </p>
              </div>
            </div>
          </div>

          <Card className="shadow-lg">
            <CardHeader className="pb-6">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                  <Package className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">Order Information</CardTitle>
                  <CardDescription>Enter the details for the new order</CardDescription>
                </div>
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

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Date Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Entry Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full h-11 justify-start text-left font-normal",
                            !orderData.entryDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {orderData.entryDate ? format(orderData.entryDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={orderData.entryDate}
                          onSelect={(date) => handleInputChange("entryDate", date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">PO Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full h-11 justify-start text-left font-normal",
                            !orderData.poDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {orderData.poDate ? format(orderData.poDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={orderData.poDate}
                          onSelect={(date) => handleInputChange("poDate", date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="brand" className="text-sm font-medium">
                      Brand
                    </Label>
                    <Select value={orderData.brand} onValueChange={(value) => handleInputChange("brand", value)}>
                      <SelectTrigger className="h-11">
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
                    <Label htmlFor="channel" className="text-sm font-medium">
                      Channel
                    </Label>
                    <Select value={orderData.channel} onValueChange={(value) => handleInputChange("channel", value)}>
                      <SelectTrigger className="h-11">
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
                    <Label htmlFor="location" className="text-sm font-medium">
                      Location
                    </Label>
                    <Select value={orderData.location} onValueChange={(value) => handleInputChange("location", value)}>
                      <SelectTrigger className="h-11">
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
                </div>

                {/* Order Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="poNumber" className="text-sm font-medium">
                      PO Number
                    </Label>
                    <Input
                      id="poNumber"
                      type="text"
                      placeholder="Enter PO number"
                      value={orderData.poNumber}
                      onChange={(e) => handleInputChange("poNumber", e.target.value)}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="srNo" className="text-sm font-medium">
                      Sr. No
                    </Label>
                    <Input
                      id="srNo"
                      type="text"
                      placeholder="Enter serial number"
                      value={orderData.srNo}
                      onChange={(e) => handleInputChange("srNo", e.target.value)}
                      className="h-11"
                    />
                  </div>
                </div>

                {/* SKU Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">SKU Information</h3>
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="skuName" className="text-sm font-medium">
                        SKU Name
                      </Label>
                      <Input
                        id="skuName"
                        type="text"
                        placeholder="Enter SKU name"
                        value={orderData.skuName}
                        onChange={(e) => handleInputChange("skuName", e.target.value)}
                        className="h-11"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="skuCode" className="text-sm font-medium">
                          SKU Code
                        </Label>
                        <Input
                          id="skuCode"
                          type="text"
                          placeholder="Enter SKU code"
                          value={orderData.skuCode}
                          onChange={(e) => handleInputChange("skuCode", e.target.value)}
                          className="h-11"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="channelSkuCode" className="text-sm font-medium">
                          Channel SKU Code
                        </Label>
                        <Input
                          id="channelSkuCode"
                          type="text"
                          placeholder="Enter channel SKU code"
                          value={orderData.channelSkuCode}
                          onChange={(e) => handleInputChange("channelSkuCode", e.target.value)}
                          className="h-11"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Financial Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Financial Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="qty" className="text-sm font-medium">
                        Quantity
                      </Label>
                      <Input
                        id="qty"
                        type="number"
                        placeholder="Enter quantity"
                        value={orderData.qty}
                        onChange={(e) => handleInputChange("qty", e.target.value)}
                        className="h-11"
                        min="1"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gmv" className="text-sm font-medium">
                        GMV (₹)
                      </Label>
                      <Input
                        id="gmv"
                        type="number"
                        placeholder="Enter GMV"
                        value={orderData.gmv}
                        onChange={(e) => handleInputChange("gmv", e.target.value)}
                        className="h-11"
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="poValue" className="text-sm font-medium">
                        PO Value (₹)
                      </Label>
                      <Input
                        id="poValue"
                        type="number"
                        placeholder="Enter PO value"
                        value={orderData.poValue}
                        onChange={(e) => handleInputChange("poValue", e.target.value)}
                        className="h-11"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex space-x-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onNavigate("dashboard")}
                    className="flex-1 h-11"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Order..." : "Create Order"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
