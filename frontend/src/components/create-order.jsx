"use client"

import { useState, useMemo, useEffect } from "react"
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
  Check,
  ChevronsUpDown,
} from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { createShipmentOrder } from "@/lib/order"

import SearchableSelect from "./ui/searchable-select"

// import master sheet
import { master_sku_code_options } from "@/constants/sku_code_options"
import { master_channel_options } from "@/constants/master_sheet"
import { channelSkuMapping } from "@/constants/channel-sku-map"
import { getLocationsForChannel } from "@/lib/validation"
import { toast } from "sonner"

// Channel SKU mapping
// const channelSkuMapping = {
//   Amazon: {
//     MCaf121: "AMZ-mCaf121",
//     MCaf122: "AMZ-mCaf122",
//     MCaf123: "AMZ-mCaf123",
//     MCaf124: "AMZ-mCaf124",
//     MCaf125: "AMZ-mCaf125",
//   },
//   Flipkart: {
//     MCaf121: "FK-mCaf121",
//     MCaf122: "FK-mCaf122",
//     MCaf123: "FK-mCaf123",
//     MCaf124: "FK-mCaf124",
//     MCaf125: "FK-mCaf125",
//   },
//   Nykaa: {
//     MCaf121: "NYK-mCaf121",
//     MCaf122: "NYK-mCaf122",
//     MCaf123: "NYK-mCaf123",
//     MCaf124: "NYK-mCaf124",
//     MCaf125: "NYK-mCaf125",
//   },
//   Zepto: {
//     MCaf121: "ZPT-mCaf121",
//     MCaf122: "ZPT-mCaf122",
//     MCaf123: "ZPT-mCaf123",
//     MCaf124: "ZPT-mCaf124",
//     MCaf125: "ZPT-mCaf125",
//   },
//   BigBasket: {
//     MCaf121: "BB-mCaf121",
//     MCaf122: "BB-mCaf122",
//     MCaf123: "BB-mCaf123",
//     MCaf124: "BB-mCaf124",
//     MCaf125: "BB-mCaf125",
//   },
//   "Swiggy Instamart": {
//     MCaf121: "SWG-mCaf121",
//     MCaf122: "SWG-mCaf122",
//     MCaf123: "SWG-mCaf123",
//     MCaf124: "SWG-mCaf124",
//     MCaf125: "SWG-mCaf125",
//   },
//   Blinkit: {
//     MCaf121: "BLK-mCaf121",
//     MCaf122: "BLK-mCaf122",
//     MCaf123: "BLK-mCaf123",
//     MCaf124: "BLK-mCaf124",
//     MCaf125: "BLK-mCaf125",
//   },
// }

const brands = ["mCaffine", "MCaffeine", "Other Brand"]
const facilities = ["Delhi WH1", "Mumbai WH1", "Mumbai WH2", "Bangalore WH1", "Hyderabad WH1", "Chennai WH1"]
const channels = ["Amazon", "Flipkart", "Zepto", "Nykaa", "BigBasket", "Swiggy Instamart", "Blinkit"]
const locations = ["New Delhi", "Mumbai", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune"]


export default function CreateOrderPage({ onNavigate, isDarkMode, onToggleTheme }) {
  const [shipmentOrder, setShipmentOrder] = useState({
    entryDate: new Date(),
    brand: "",
    poDate: undefined,
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
      brandName: "",
      mrp: "",
    },
  ])

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [brandMismatchError, setBrandMismatchError] = useState("")

  // Prepare options for searchable selects
  const channelOptions = useMemo(() => master_channel_options.map((channel) => ({ value: channel, label: channel })), [])
  
  const getSkuOptionsForChannel = (channel) => {
    if(!channel) return [];
    const skuCodes = Object.keys(channelSkuMapping[channel] || {});

    const options =  skuCodes.map(skuCode => ({
      value: skuCode,
      label: skuCode,
    }));
    console.log(options);
    setSkuCodeOptions(options);
    return options;
  }

  const getLocations = (channel) => {
    const locations = getLocationsForChannel(channel);
    setLocationOptions(locations);
  }

  const [skuCodeOptions, setSkuCodeOptions] = useState([])
  const [locationOtions, setLocationOptions] = useState([])

  // Auto-fill brand based on selected SKUs
  useEffect(() => {
    const skusWithBrands = skuOrders.filter((sku) => sku.brandName)

    if (skusWithBrands.length === 0) {
      setShipmentOrder((prev) => ({ ...prev, brand: "" }))
      setBrandMismatchError("")
      return
    }

    // Get unique brands from selected SKUs
    // const uniqueBrands = [...new Set(skusWithBrands.map((sku) => sku.brandName))]

    // if (uniqueBrands.length === 1) {
    //   // All SKUs are from the same brand
    //   setShipmentOrder((prev) => ({ ...prev, brand: uniqueBrands[0] }))
    //   setBrandMismatchError("")
    // } else if (uniqueBrands.length > 1) {
    //   // Multiple brands detected
    //   setBrandMismatchError(
    //     `Multiple brands detected: ${uniqueBrands.join(", ")}. All SKUs must be from the same brand.`,
    //   )
    //   setShipmentOrder((prev) => ({ ...prev, brand: "" }))
    // }
  }, [skuOrders])

  const handleShipmentChange = (field, value) => {
    setShipmentOrder((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Update all SKU channel codes when channel changes
    if (field === "channel") {
      setSkuOrders((prev) =>
        prev.map((sku) => ({
          ...sku,
          channelSkuCode:
            sku.skuCode && channelSkuMapping[value]?.[sku.skuCode] ? channelSkuMapping[value][sku.skuCode] : "",
        })),
      )
    }
  }

  const handleSkuChange = (id, field, value) => {
    setSkuOrders((prev) =>
      prev.map((sku) => {
        if (sku.id !== id) return sku

        const updatedSku = { ...sku, [field]: value }

        // Auto-fill when SKU code changes
        if (field === "skuCode") {
          const masterSku = master_sku_code_options?.find((item) => item.sku_code === value)
          const prefix = `${value}`.substring(0,3);
          if(prefix === "HYP"){
              updatedSku.brandName = "Hyphen"
          } else if(prefix === "AMA"){
            updatedSku.brandName = "Aman"
          } else if(prefix === "VIV"){
            updatedSku.brandName = "Vivek"
          } else {
            updatedSku.brandName = masterSku?.brand_name || "MCaffeine"
          }
          if (masterSku) {
            updatedSku.skuName = masterSku?.sku_name
            // updatedSku.brandName = masterSku.brand_name
            updatedSku.mrp = masterSku?.mrp
            

            // Auto-fill channel SKU code if channel is selected
            if (shipmentOrder.channel && channelSkuMapping[shipmentOrder.channel]?.[value]) {
              updatedSku.channelSkuCode = channelSkuMapping[shipmentOrder.channel][value]
            }

            // Auto-calculate GMV if quantity exists
            if (updatedSku.qty) {
              updatedSku.gmv = (Number(updatedSku.qty) * masterSku.mrp).toString()
            }
          } else {
            // Clear auto-filled fields if SKU not found
            updatedSku.skuName = ""
            updatedSku.mrp = ""
            updatedSku.channelSkuCode = ""
          }
        }

        // Auto-calculate GMV when quantity changes
        if (field === "qty" && updatedSku.mrp) {
          updatedSku.gmv = (Number(value) * Number(updatedSku.mrp)).toString()
        }

        return updatedSku
      }),
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
      brandName: "",
      mrp: "",
    }
    setSkuOrders((prev) => [...prev, newSku])
  }

  const removeSkuOrder = (id) => {
    if (skuOrders.length > 1) {
      setSkuOrders((prev) => prev.filter((sku) => sku.id !== id))
    }
  }

  const validateForm = () => {
    // Check for brand consistency first
    if (brandMismatchError) {
      return brandMismatchError
    }

    // Validate shipment order
    const requiredShipmentFields = ["channel", "location", "poNumber"]
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
      // poValue should always be less than gmv
      if(sku.poValue > sku.gmv) {
        return `SKU ${i+1}: PO Value should be less than GMV`
      }
    }

    // Final brand consistency check
    const skusWithBrands = skuOrders.filter((sku) => sku.brandName)
    const uniqueBrands = [...new Set(skusWithBrands.map((sku) => sku.brandName))]

    // if (uniqueBrands.length > 1) {
    //   return `All SKUs must be from the same brand. Found: ${uniqueBrands.join(", ")}`
    // }

    if (uniqueBrands.length === 0) {
      return "At least one SKU with a valid brand is required"
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
      toast.error(validationError)
      setIsLoading(false)
      return
    }

    try {
      // Format data for API
      const apiData = {
        shipmentOrder: {
          entryDate: shipmentOrder.entryDate ? format(shipmentOrder.entryDate, "dd-MM-yyyy") : "",
          brandName: skuOrders[0].brandName,
          poDate: shipmentOrder.poDate ? format(shipmentOrder.poDate, "dd-MM-yyyy") : "",
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
          brandName: sku.brandName,
          // mrp: Number.parseFloat(sku.mrp || "0"),
        })),
      }

      const res = await createShipmentOrder(apiData)
      console.log("Order created:", apiData)
      console.log("res:", res.data)
      setSuccess("Shipment order created successfully!")
      toast.success(res.data.msg || "Order created successfully");
      // Reset form after success
      setTimeout(() => {
        resetForm()
      }, 1000)
    } catch (err) {
      toast.error(err.response.data.msg || err.message);
      console.log(err.response || err);
    }finally {
      setIsLoading(false)
    }

    
  }

  const resetForm = () => {
    setShipmentOrder({
      entryDate: new Date(),
      brand: "",
      poDate: undefined,
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
        brandName: "",
        mrp: "",
      },
    ])
    setError("")
    setSuccess("")
    setBrandMismatchError("")
  }

  // Calculate totals
  const totalQty = skuOrders.reduce((sum, sku) => sum + (Number.parseInt(sku.qty) || 0), 0)
  const totalGmv = skuOrders.reduce((sum, sku) => sum + (Number.parseFloat(sku.gmv) || 0), 0)
  const totalPoValue = skuOrders.reduce((sum, sku) => sum + (Number.parseFloat(sku.poValue) || 0), 0)

  return (
    <div className={`min-h-screen h-full `}>
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

              {brandMismatchError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{brandMismatchError}</AlertDescription>
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
                            disabled={true}
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
                            disabled={{ after: new Date() }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* <div className="space-y-2">
                      <Label className="text-sm font-medium">Brand * (Auto-filled from SKUs)</Label>
                      <Input
                        type="text"
                        placeholder="Will be auto-filled based on selected SKUs"
                        value={shipmentOrder.brand}
                        className={cn("h-10", brandMismatchError ? "border-red-300 bg-red-50" : "bg-gray-100")}
                        disabled
                      />
                      {shipmentOrder.brand && (
                        <p className="text-xs text-green-600">✓ Brand auto-filled from selected SKUs</p>
                      )}
                    </div> */}

                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Channel *</Label>
                      <SearchableSelect
                        value={shipmentOrder.channel}
                        onValueChange={(value) => {handleShipmentChange("channel", value); getSkuOptionsForChannel(value || ""); getLocations(value || "")}}
                        options={channelOptions}
                        placeholder="Select channel"
                        searchPlaceholder="Search channels..."
                      />
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
                          {locationOtions.map((location, idx) => (
                            <SelectItem key={idx} value={location.location}>
                              {`${location.location} - ${location.drop_location}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 md:col-span-1">
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

                        <div className="space-y-2">
                          <Label className="text-sm font-medium">SKU Code *</Label>
                          <SearchableSelect
                            value={sku.skuCode}
                            onValueChange={(value) => handleSkuChange(sku.id, "skuCode", value)}
                            options={skuCodeOptions}
                            placeholder="Select SKU code"
                            searchPlaceholder="Search SKU codes..."
                          />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                          <Label className="text-sm font-medium">SKU Name *</Label>
                          <Input
                            type="text"
                            placeholder="Auto-filled from SKU selection"
                            value={sku.skuName}
                            onChange={(e) => handleSkuChange(sku.id, "skuName", e.target.value)}
                            className="h-10"
                            disabled={!!sku.skuCode}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Brand Name</Label>
                          <Input
                            type="text"
                            placeholder="Auto-filled"
                            value={sku.brandName}
                            className="h-10"
                            disabled={!!sku.skuCode}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium">MRP (₹)</Label>
                          <Input type="number" placeholder="Auto-filled" value={sku.mrp} className="h-10" disabled />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Channel SKU Code *</Label>
                          <Input
                            type="text"
                            placeholder="Auto-filled from channel + SKU"
                            value={sku.channelSkuCode}
                            onChange={(e) => handleSkuChange(sku.id, "channelSkuCode", e.target.value)}
                            className="h-10"
                            disabled={!!(sku.skuCode)}
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
                            placeholder="Auto-calculated (Qty × MRP)"
                            value={sku.gmv}
                            onChange={(e) => handleSkuChange(sku.id, "gmv", e.target.value)}
                            className="h-10"
                            min="0"
                            step="0.01"
                            disabled={!!(sku.qty && sku.mrp)}
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

                  <Button
                    type="button"
                    onClick={addSkuOrder}
                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add SKU
                  </Button>

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
              disabled={isLoading || !!brandMismatchError}
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
