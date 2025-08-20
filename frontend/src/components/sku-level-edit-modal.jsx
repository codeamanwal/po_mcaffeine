"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, CheckCircle, X, Save, Package, Calculator, DollarSign, Loader2, RefreshCw } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useUserStore } from "@/store/user-store"
import { getSkuOrdersByShipment, updateSkusByShipment } from "@/lib/order"

import { toast } from "sonner"

// Mock API functions - replace with actual API calls
const fetchShipmentSkuData = async (shipmentId) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  // Mock data - replace with actual API call
  return {
    uid: shipmentId,
    poNumber: `PO${shipmentId}${Math.floor(Math.random() * 1000)}`,
    facility: "Mumbai Warehouse",
    channel: "Amazon",
    brandName: "MCaffeine",
    skuOrders: [
      {
        id: 1,
        srNo: "001",
        skuName: "MCaffeine Coffee Face Wash 100ml",
        skuCode: "MCF001",
        channelSkuCode: "AMZ-MCF001",
        qty: 50,
        gmv: 2500.00,
        poValue: 2000.00,
        accountsWorking: "Team Alpha",
        channelInwardingQuantity: 48,
        actualWeight: 12.5
      },
      {
        id: 2,
        srNo: "002", 
        skuName: "MCaffeine Vitamin C Face Serum 30ml",
        skuCode: "MCV002",
        channelSkuCode: "AMZ-MCV002",
        qty: 30,
        gmv: 4500.00,
        poValue: 3600.00,
        accountsWorking: "Team Beta",
        channelInwardingQuantity: 30,
        actualWeight: 8.2
      },
      {
        id: 3,
        srNo: "003",
        skuName: "MCaffeine Coffee Body Scrub 200g",
        skuCode: "MCB003", 
        channelSkuCode: "AMZ-MCB003",
        qty: 25,
        gmv: 1875.00,
        poValue: 1500.00,
        accountsWorking: "Team Alpha",
        channelInwardingQuantity: 24,
        actualWeight: 15.8
      },
      {
        id: 4,
        srNo: "004",
        skuName: "MCaffeine Under Eye Cream 15ml",
        skuCode: "MCE004",
        channelSkuCode: "AMZ-MCE004",
        qty: 40,
        gmv: 3200.00,
        poValue: 2800.00,
        accountsWorking: "Team Beta",
        channelInwardingQuantity: 38,
        actualWeight: 6.4
      },
      {
        id: 5,
        srNo: "005",
        skuName: "MCaffeine Hair Growth Oil 100ml",
        skuCode: "MCH005",
        channelSkuCode: "AMZ-MCH005",
        qty: 35,
        gmv: 2625.00,
        poValue: 2100.00,
        accountsWorking: "Team Alpha",
        channelInwardingQuantity: 35,
        actualWeight: 11.2
      }
    ]
  }
}

const updateShipmentSkuData = async (shipmentId, skuOrders) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // Mock API call - replace with actual API endpoint
  console.log(`Updating shipment ${shipmentId} with SKU data:`, skuOrders)
}

export default function SkuLevelEditModal({ isOpen, onClose, shipmentId, onSave }) {
  const [shipmentData, setShipmentData] = useState(null)
  const [editedSkus, setEditedSkus] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const { user } = useUserStore()

  // Fetch shipment data when modal opens
  useEffect(() => {
    if (isOpen && shipmentId) {
      fetchShipmentData()
    }
  }, [isOpen, shipmentId])

  const fetchShipmentData = async () => {
    if (!shipmentId) return

    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const data = await getSkuOrdersByShipment(shipmentId)
      console.log(data.data);
      setShipmentData({skuOrders:data?.data?.skus})
      setEditedSkus([...data?.data?.skus])
    } catch (err) {
      setError("Failed to fetch shipment data. Please try again.")
    }

    setIsLoading(false)
  }

  // Role-based field permissions
  const getEditableFields = () => {
    const fields = []
    
    if (user?.role === "superadmin") {
      fields.push(
        // { key: "poValue", label: "PO Value", type: "number", icon: DollarSign, color: "text-green-600" },
        { key: "qty", label: "Quantity", type: "number", icon: Package, color: "text-blue-600" },
        // { key: "gmv", label: "GMV", type: "number", icon: Calculator, color: "text-purple-600" }
      )
    } else if (user?.role === "warehouse") {
      fields.push(
        { key: "qty", label: "Quantity", type: "number", icon: Package, color: "text-blue-600" }
      )
    } else if (user?.role === "admin") {
      fields.push(
        // { key: "gmv", label: "GMV", type: "number", icon: Calculator, color: "text-purple-600" }
      )
    }
    
    return fields
  }

  const handleFieldChange = (skuIndex, field, value) => {
    setEditedSkus(prev => {
      const updated = [...prev]
      const numValue = parseFloat(value) || 0
      updated[skuIndex] = {
        ...updated[skuIndex],
        [field]: field === "qty" ? Math.floor(numValue) : numValue
      }
      return updated
    })
  }

  const handleSave = async () => {
    if (!shipmentData || !shipmentId) return

    setIsUpdating(true)
    setError("")
    setSuccess("")

    try {
      // Validate changes
      const hasChanges = editedSkus.some((sku, index) => {
        const original = shipmentData.skuOrders[index]
        return sku.poValue !== original.poValue || 
               sku.qty !== original.qty || 
               sku.gmv !== original.gmv
      })

      if (!hasChanges) {
        setError("No changes detected")
        setIsUpdating(false)
        return
      }

      // Update via API
      await updateSkusByShipment({shipmentId:shipmentId, skus:editedSkus})
      
      // Call parent callback if provided
      if (onSave) {
        onSave(shipmentId, editedSkus)
      }

      setSuccess("SKU orders updated successfully")
      toast.success("SKU orders updated successfully")
      setTimeout(() => {
        onClose()
        resetModal()
      }, 2000)
    } catch (err) {
      setError("Failed to update SKU orders. Please try again.")
      toast.error("Failed to update SKU orders", err?.message || err)
    }

    setIsUpdating(false)
  }

  const resetModal = () => {
    setShipmentData(null)
    setEditedSkus([])
    setError("")
    setSuccess("")
  }

  const handleClose = () => {
    onClose()
    resetModal()
  }

  const editableFields = getEditableFields()
  const hasChanges = shipmentData && editedSkus.some((sku, index) => {
    const original = shipmentData.skuOrders[index]
    if (!original) return false
    return sku.poValue !== original.poValue || 
           sku.qty !== original.qty || 
           sku.gmv !== original.gmv
  })

  const calculateTotals = () => {
    return editedSkus.reduce((totals, sku) => ({
      totalQty: totals.totalQty + sku.qty,
      totalGmv: totals.totalGmv + sku.gmv,
      // totalGmv: (sku.gmv/sku.qty)*(totals.totalQty + sku.qty) || 0,
      totalPoValue: totals.totalPoValue + sku.poValue,
      totalWeight: totals.totalWeight + sku.actualWeight
    }), { totalQty: 0, totalGmv: 0, totalPoValue: 0, totalWeight: 0 })
  }

  const totals = calculateTotals()

  return (
    <Dialog className={"w-[70vw] max-w-[80vw]"} open={isOpen} onOpenChange={handleClose}>
      <DialogContent className=" max-h-[95vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5" />
            <span>SKU Level Edit</span>
            {shipmentData && (
              <Badge variant="outline" className="ml-2">
                {shipmentData.poNumber}
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            {isLoading ? "Loading shipment data..." : 
             editableFields.length > 0 ? 
             `Edit ${editableFields.map(f => f.label).join(", ")} for individual SKU orders` :
             "No editable fields available for your role"}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[75vh] pr-4">
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

            {/* Loading State */}
            {isLoading && (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="flex flex-col items-center space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    <p className="text-sm text-gray-500">Loading shipment data...</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Shipment Info */}
            {/* {shipmentData && !isLoading && (
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="text-lg font-semibold">Shipment Details</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                          <span>UID: {shipmentData.uid}</span>
                          <span>•</span>
                          <span>PO: {shipmentData.poNumber}</span>
                          <span>•</span>
                          <span>Facility: {shipmentData.facility}</span>
                          <span>•</span>
                          <span>Channel: {shipmentData.channel}</span>
                          <span>•</span>
                          <span>Brand: {shipmentData.brandName}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {editedSkus.length} SKU Orders
                      </Badge>
                      {hasChanges && (
                        <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                          Changes Pending
                        </Badge>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={fetchShipmentData}
                        disabled={isLoading}
                      >
                        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            )} */}

            {/* Editable Fields Legend */}
            {/* {editableFields.length > 0 && shipmentData && !isLoading && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Editable Fields</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {editableFields.map(field => {
                      const IconComponent = field.icon
                      return (
                        <div key={field.key} className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-lg">
                          <IconComponent className={`h-4 w-4 ${field.color}`} />
                          <span className="text-sm font-medium">{field.label}</span>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )} */}

            {/* SKU Orders Table */}
            {shipmentData && !isLoading && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Package className="h-5 w-5" />
                      <span>SKU Orders</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Package className="h-4 w-4 text-blue-600" />
                        <span>Total Qty: <strong>{totals.totalQty}</strong></span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calculator className="h-4 w-4 text-purple-600" />
                        <span>Total GMV: <strong>₹{totals.totalGmv.toLocaleString()}</strong></span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span>Total PO Value: <strong>₹{totals.totalPoValue.toLocaleString()}</strong></span>
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="w-full">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-16">Sr No</TableHead>
                          <TableHead className="min-w-[250px]">SKU Details</TableHead>
                          {/* <TableHead className="w-24 text-center">Channel Qty</TableHead>
                          <TableHead className="w-24 text-center">Weight (kg)</TableHead>
                          <TableHead className="w-32">Accounts Working</TableHead> */}
                          {editableFields.map(field => (
                            <TableHead key={field.key} className="w-32 text-center">
                              <div className="flex items-center justify-center space-x-1">
                                <field.icon className={`h-4 w-4 ${field.color}`} />
                                <span>{field.label}</span>
                              </div>
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {editedSkus.map((sku, index) => {
                          const original = shipmentData.skuOrders[index]
                          return (
                            <TableRow key={sku.id} className="group">
                              <TableCell className="font-mono text-sm text-center">
                                {sku.srNo}
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  <div className="font-medium text-sm">{sku.skuName}</div>
                                  <div className="text-xs text-gray-500 space-y-0.5">
                                    <div>SKU Code: <span className="font-mono">{sku.skuCode}</span></div>
                                    <div>Channel Code: <span className="font-mono">{sku.channelSkuCode}</span></div>
                                  </div>
                                </div>
                              </TableCell>
                              {/* <TableCell className="text-center">
                                <Badge variant="outline" className="font-mono">
                                  {sku.channelInwardingQuantity}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-center">
                                <span className="font-mono text-sm">{sku.actualWeight}</span>
                              </TableCell>
                              <TableCell>
                                <span className="text-sm">{sku.accountsWorking || "-"}</span>
                              </TableCell> */}
                              {editableFields.map(field => {
                                const hasChanged = original && sku[field.key] !== original[field.key]
                                return (
                                  <TableCell key={field.key}>
                                    <div className="relative">
                                      <Input
                                        type="number"
                                        value={sku[field.key]}
                                        onChange={(e) => handleFieldChange(index, field.key, e.target.value)}
                                        className={`text-center font-mono ${
                                          hasChanged 
                                            ? "border-orange-300 bg-orange-50 dark:border-orange-600 dark:bg-orange-950" 
                                            : ""
                                        }`}
                                        step={field.key === "qty" ? "1" : "0.01"}
                                        min="0"
                                        disabled={isUpdating}
                                      />
                                      {hasChanged && (
                                        <div className="absolute -top-1 -right-1">
                                          <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
                                        </div>
                                      )}
                                    </div>
                                    {hasChanged && original && (
                                      <div className="text-xs text-gray-500 mt-1 text-center">
                                        Was: {original[field.key]}
                                      </div>
                                    )}
                                  </TableCell>
                                )
                              })}
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}

            {/* Changes Summary */}
            {hasChanges && !isLoading && (
              <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-5 w-5 text-orange-600" />
                      <span className="font-medium text-orange-900 dark:text-orange-100">
                        Changes detected in {editedSkus.filter((sku, index) => {
                          const original = shipmentData?.skuOrders[index]
                          return original && (
                            sku.poValue !== original.poValue || 
                            sku.qty !== original.qty || 
                            sku.gmv !== original.gmv
                          )
                        }).length} SKU orders
                      </span>
                    </div>
                    <div className="text-sm text-orange-700 dark:text-orange-300">
                      Review changes before saving
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Update Progress */}
            {isUpdating && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center space-x-4">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                    <span className="text-sm font-medium">Updating SKU orders...</span>
                  </div>
                  <Progress value={66} className="mt-4" />
                </CardContent>
              </Card>
            )}
          </div>
        <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-gray-500">
            {editableFields.length === 0 ? (
              "No editable fields available for your role"
            ) : (
              `You can edit: ${editableFields.map(f => f.label).join(", ")}`
            )}
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={handleClose} disabled={isUpdating}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!hasChanges || isUpdating || editableFields.length === 0 || isLoading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
