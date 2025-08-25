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
import {
  AlertCircle,
  CheckCircle,
  X,
  Save,
  Package,
  Calculator,
  DollarSign,
  Loader2,
  Edit,
  AlertTriangle,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useUserStore } from "@/store/user-store"
import { getSkuOrdersByShipment, updateSkusByShipment } from "@/lib/order"
import { toast } from "sonner"

// Master reasons for editing PO level details
const EDIT_REASONS = [
  "Price correction from brand",
  "Quantity adjustment due to stock availability",
  "Channel requirement change",
  "Promotional pricing update",
  "System error correction",
  "Customer request modification",
  "Inventory reconciliation",
  "Other (specify in comments)",
]

// Mock API functions - replace with actual API calls
const fetchShipmentSkuData = async (shipmentId) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Mock data - replace with actual API call
  return {
    uid: shipmentId,
    poNumber: `PO${shipmentId}${Math.floor(Math.random() * 1000)}`,
    facility: "Mumbai Warehouse",
    channel: "Amazon",
    location: "Mumbai",
    poDate: "15-12-2024",
    brandName: "MCaffeine",
    skuOrders: [
      {
        id: 1,
        srNo: "001",
        skuName: "MCaffeine Coffee Face Wash 100ml",
        skuCode: "MCF001",
        channelSkuCode: "AMZ-MCF001",
        qty: 50,
        gmv: 2500.0,
        poValue: 2000.0,
        updatedQty: 48,
        updatedGmv: 2400.0,
        updatedPoValue: 1920.0,
        accountsWorking: "Team Alpha",
        channelInwardingQuantity: 48,
        actualWeight: 12.5,
      },
      {
        id: 2,
        srNo: "002",
        skuName: "MCaffeine Vitamin C Face Serum 30ml",
        skuCode: "MCV002",
        channelSkuCode: "AMZ-MCV002",
        qty: 30,
        gmv: 4500.0,
        poValue: 3600.0,
        updatedQty: 30,
        updatedGmv: 4500.0,
        updatedPoValue: 3600.0,
        accountsWorking: "Team Beta",
        channelInwardingQuantity: 30,
        actualWeight: 8.2,
      },
      {
        id: 3,
        srNo: "003",
        skuName: "MCaffeine Coffee Body Scrub 200g",
        skuCode: "MCB003",
        channelSkuCode: "AMZ-MCB003",
        qty: 25,
        gmv: 1875.0,
        poValue: 1500.0,
        updatedQty: 24,
        updatedGmv: 1800.0,
        updatedPoValue: 1440.0,
        accountsWorking: "Team Alpha",
        channelInwardingQuantity: 24,
        actualWeight: 15.8,
      },
      {
        id: 4,
        srNo: "004",
        skuName: "MCaffeine Under Eye Cream 15ml",
        skuCode: "MCE004",
        channelSkuCode: "AMZ-MCE004",
        qty: 40,
        gmv: 3200.0,
        poValue: 2800.0,
        updatedQty: 38,
        updatedGmv: 3040.0,
        updatedPoValue: 2660.0,
        accountsWorking: "Team Beta",
        channelInwardingQuantity: 38,
        actualWeight: 6.4,
      },
      {
        id: 5,
        srNo: "005",
        skuName: "MCaffeine Hair Growth Oil 100ml",
        skuCode: "MCH005",
        channelSkuCode: "AMZ-MCH005",
        qty: 35,
        gmv: 2625.0,
        poValue: 2100.0,
        updatedQty: 35,
        updatedGmv: 2625.0,
        updatedPoValue: 2100.0,
        accountsWorking: "Team Alpha",
        channelInwardingQuantity: 35,
        actualWeight: 11.2,
      },
    ],
  }
}

const updateShipmentSkuData = async (shipmentId, skuOrders) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Mock API call - replace with actual API endpoint
  console.log(`Updating shipment ${shipmentId} with SKU data:`, skuOrders)
}

// Confirmation Dialog Component
function EditConfirmationDialog({ isOpen, onClose, onConfirm, field, isLoading }) {
  const [selectedReason, setSelectedReason] = useState("")
  const [comments, setComments] = useState("")

  const handleConfirm = () => {
    if (!selectedReason) {
      toast.error("Please select a reason for editing")
      return
    }
    onConfirm(selectedReason, comments)
    setSelectedReason("")
    setComments("")
  }

  const handleClose = () => {
    onClose()
    setSelectedReason("")
    setComments("")
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <span>Confirm Edit</span>
          </DialogTitle>
          <DialogDescription>
            You are about to edit PO level {field}. Please provide a reason for this change.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="reason">Reason for Edit *</Label>
            <Select value={selectedReason} onValueChange={setSelectedReason}>
              <SelectTrigger>
                <SelectValue placeholder="Select a reason..." />
              </SelectTrigger>
              <SelectContent>
                {EDIT_REASONS.map((reason) => (
                  <SelectItem key={reason} value={reason}>
                    {reason}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="comments">Additional Comments</Label>
            <Textarea
              id="comments"
              placeholder="Any additional details..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedReason || isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Confirming...
              </>
            ) : (
              "Confirm Edit"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function SkuLevelEditModal({ isOpen, onClose, shipmentId, onSave, shipment }) {
  const [initialskus, setInitialSkus] = useState([])
  const [shipmentData, setShipmentData] = useState(null)
  const [editedSkus, setEditedSkus] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [pendingEdit, setPendingEdit] = useState(null)
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
      console.log(data.data)
      setShipmentData({
        ...data?.data,
        skuOrders: data?.data?.skus,
      })
      setEditedSkus([...data?.data?.skus])
      setInitialSkus([...data?.data?.skus])
    } catch (err) {
      setError("Failed to fetch shipment data. Please try again.")
      // Fallback to mock data for demo
      const mockData = await fetchShipmentSkuData(shipmentId)
      setShipmentData(mockData)
      setEditedSkus([...mockData.skuOrders])
      setInitialSkus([...mockData.skuOrders])
    }

    setIsLoading(false)
  }

  // Role-based field permissions
  const getEditableFields = () => {
    const fields = []

    if (user?.role === "admin" || user?.role === "superadmin") {
      fields.push(
        {
          key: "qty",
          label: "Quantity",
          type: "number",
          icon: Package,
          color: "text-blue-600",
          requiresConfirmation: false, // No confirmation for qty
        },
        {
          key: "gmv",
          label: "GMV",
          type: "number",
          icon: Calculator,
          color: "text-purple-600",
          requiresConfirmation: true, // Confirmation for direct GMV edit
        },
        {
          key: "poValue",
          label: "PO Value",
          type: "number",
          icon: DollarSign,
          color: "text-green-600",
          requiresConfirmation: true, // Confirmation for direct PO Value edit
        },
      )
    } else if (user?.role === "warehouse") {
      fields.push({ key: "qty", label: "Quantity", type: "number", icon: Package, color: "text-blue-600" })
    }

    return fields
  }

  const handleFieldChange = (skuIndex, field, value) => {
    const editableFields = getEditableFields()
    const fieldConfig = editableFields.find((f) => f.key === field)

    // If field requires confirmation and user is admin, show confirmation dialog
    if (fieldConfig?.requiresConfirmation && user?.role === "admin") {
      setPendingEdit({
        skuIndex,
        field,
        value,
        fieldLabel: fieldConfig.label,
      })
      setShowConfirmDialog(true)
      return
    }

    // Apply the change directly for warehouse users or non-confirmation fields
    applyFieldChange(skuIndex, field, value)
  }

  const applyFieldChange = (skuIndex, field, value) => {
    setEditedSkus((prev) => {
      const original = initialskus[skuIndex]
      const updated = [...prev]
      const numValue = Number.parseFloat(value) || 0
      updated[skuIndex] = {
        ...updated[skuIndex],
        [field]: field.includes("Qty") ? Math.floor(numValue) : numValue,
      }

      // For warehouse users - auto-calculate GMV and PO Value when qty changes
      if (user?.role === "warehouse" && field === "qty") {
        if (original && original.qty > 0) {
          const gmvPerUnit = original.gmv / original.qty
          const poValuePerUnit = original.poValue / original.qty
          updated[skuIndex] = {
            ...updated[skuIndex],
            gmv: gmvPerUnit * updated[skuIndex].qty,
            poValue: poValuePerUnit * updated[skuIndex].qty,
          }
        }
      }

      // For admin users - only auto-calculate if qty changes (not GMV or PO Value direct edits)
      if ((user?.role === "admin" || user?.role === "superadmin") && field === "qty") {
        if (original && original.qty > 0) {
          const gmvPerUnit = original.gmv / original.qty
          const poValuePerUnit = original.poValue / original.qty
          updated[skuIndex] = {
            ...updated[skuIndex],
            gmv: gmvPerUnit * updated[skuIndex].qty,
            poValue: poValuePerUnit * updated[skuIndex].qty,
          }
        }
      }

      return updated
    })
  }

  const handleConfirmEdit = (reason, comments) => {
    if (pendingEdit) {
      // Log the edit reason and comments for audit trail
      console.log("Edit confirmed:", {
        ...pendingEdit,
        reason,
        comments,
        user: user?.email,
        timestamp: new Date().toISOString(),
      })

      applyFieldChange(pendingEdit.skuIndex, pendingEdit.field, pendingEdit.value)
      setPendingEdit(null)
      setShowConfirmDialog(false)

      toast.success(`${pendingEdit.fieldLabel} updated successfully`)
    }
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
        return (
          sku.poValue !== original.poValue ||
          sku.qty !== original.qty ||
          sku.gmv !== original.gmv ||
          sku.updatedQty !== original.updatedQty ||
          sku.updatedGmv !== original.updatedGmv ||
          sku.updatedPoValue !== original.updatedPoValue
        )
      })

      if (!hasChanges) {
        setError("No changes detected")
        setIsUpdating(false)
        return
      }

      // Update via API
      await updateSkusByShipment({ shipmentId: shipmentId, skus: editedSkus })

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
      console.error(err)
      toast.error(`Failed to update SKU orders: ${err.message || err}`)
    }

    setIsUpdating(false)
  }

  const resetModal = () => {
    setShipmentData(null)
    setEditedSkus([])
    setError("")
    setSuccess("")
    setPendingEdit(null)
    setShowConfirmDialog(false)
  }

  const handleClose = () => {
    onClose()
    resetModal()
  }

  const editableFields = getEditableFields()
  const hasChanges =
    shipmentData &&
    editedSkus.some((sku, index) => {
      const original = shipmentData.skuOrders[index]
      if (!original) return false
      return (
        sku.poValue !== original.poValue ||
        sku.qty !== original.qty ||
        sku.gmv !== original.gmv ||
        sku.updatedQty !== original.updatedQty ||
        sku.updatedGmv !== original.updatedGmv ||
        sku.updatedPoValue !== original.updatedPoValue
      )
    })

  const calculateTotals = () => {
    return editedSkus.reduce(
      (totals, sku) => ({
        totalQty: totals.totalQty + (sku.qty || 0),
        totalGmv: totals.totalGmv + (sku.gmv || 0),
        totalPoValue: totals.totalPoValue + (sku.poValue || 0),
        totalUpdatedQty: totals.totalUpdatedQty + (sku.updatedQty || 0),
        totalUpdatedGmv: totals.totalUpdatedGmv + (sku.updatedGmv || 0),
        totalUpdatedPoValue: totals.totalUpdatedPoValue + (sku.updatedPoValue || 0),
        totalWeight: totals.totalWeight + (sku.actualWeight || 0),
      }),
      {
        totalQty: 0,
        totalGmv: 0,
        totalPoValue: 0,
        totalUpdatedQty: 0,
        totalUpdatedGmv: 0,
        totalUpdatedPoValue: 0,
        totalWeight: 0,
      },
    )
  }

  const calculateOriginalTotals = () => {
    return initialskus.reduce(
      (totals, sku) => ({
        totalQty: totals.totalQty + (sku.qty || 0),
        totalGmv: totals.totalGmv + (sku.gmv || 0),
        totalPoValue: totals.totalPoValue + (sku.poValue || 0),
        totalUpdatedQty: totals.totalUpdatedQty + (sku.updatedQty || 0),
        totalUpdatedGmv: totals.totalUpdatedGmv + (sku.updatedGmv || 0),
        totalUpdatedPoValue: totals.totalUpdatedPoValue + (sku.updatedPoValue || 0),
      }),
      {
        totalQty: 0,
        totalGmv: 0,
        totalPoValue: 0,
        totalUpdatedQty: 0,
        totalUpdatedGmv: 0,
        totalUpdatedPoValue: 0,
      },
    )
  }

  const totals = calculateTotals()
  const originalTotals = calculateOriginalTotals()

  // Calculate fill rates
  const fillRateUnits = totals.totalQty > 0 ? (totals.totalUpdatedQty / totals.totalQty) * 100 : 0
  const fillRateGmv = totals.totalGmv > 0 ? (totals.totalUpdatedGmv / totals.totalGmv) * 100 : 0

  return (
    <>
      <Dialog className={"w-[70vw] max-w-[80vw]"} open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>SKU Level Edit</span>
              {shipment && (
                <Badge variant="outline" className="ml-2">
                  {shipment.poNumber}
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription>
              {isLoading
                ? "Loading shipment data..."
                : editableFields.length > 0
                  ? `Edit ${editableFields.map((f) => f.label).join(", ")} for individual SKU orders`
                  : "No editable fields available for your role"}
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

              {/* Basic Details Section */}
              {shipmentData && !isLoading && (
                <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
                  <CardHeader>
                    <CardTitle className="text-lg text-blue-900 dark:text-blue-100">
                      Basic Details (Original Values)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                      <div className="space-y-1">
                        <Label className="text-xs text-gray-600 dark:text-gray-400">Channel</Label>
                        <div className="font-semibold text-blue-900 dark:text-blue-100">{shipment.channel}</div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-gray-600 dark:text-gray-400">Location</Label>
                        <div className="font-semibold text-blue-900 dark:text-blue-100">{shipment.location}</div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-gray-600 dark:text-gray-400">PO Date</Label>
                        <div className="font-semibold text-blue-900 dark:text-blue-100">{shipment.poDate}</div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-gray-600 dark:text-gray-400">PO Number</Label>
                        <div className="font-semibold text-blue-900 dark:text-blue-100">{shipment.poNumber}</div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-gray-600 dark:text-gray-400">Quantity</Label>
                        <div className="font-semibold text-blue-900 dark:text-blue-100">
                          {originalTotals.totalQty.toLocaleString()}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-gray-600 dark:text-gray-400">GMV</Label>
                        <div className="font-semibold text-blue-900 dark:text-blue-100">
                          ₹{originalTotals.totalGmv.toLocaleString()}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-gray-600 dark:text-gray-400">PO Value</Label>
                        <div className="font-semibold text-blue-900 dark:text-blue-100">
                          ₹{originalTotals.totalPoValue.toLocaleString()}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-gray-600 dark:text-gray-400">Fill Rate (Units)</Label>
                        <div className="font-semibold text-blue-900 dark:text-blue-100">
                          {originalTotals.totalQty > 0
                            ? ((originalTotals.totalUpdatedQty / originalTotals.totalQty) * 100).toFixed(1)
                            : 0}
                          %
                        </div>
                      </div>
                    </div>
                    <Separator className="my-4" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label className="text-xs text-gray-600 dark:text-gray-400">Fill Rate (GMV)</Label>
                        <div className="font-semibold text-blue-900 dark:text-blue-100">
                          {originalTotals.totalGmv > 0
                            ? ((originalTotals.totalUpdatedGmv / originalTotals.totalGmv) * 100).toFixed(1)
                            : 0}
                          %
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

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
                          <span>
                            Total Qty: <strong>{totals.totalQty}</strong>
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calculator className="h-4 w-4 text-purple-600" />
                          <span>
                            Total GMV: <strong>₹{totals.totalGmv.toLocaleString()}</strong>
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span>
                            Total PO Value: <strong>₹{totals.totalPoValue.toLocaleString()}</strong>
                          </span>
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
                            {editableFields.map((field) => (
                              <TableHead key={field.key} className="w-32 text-center">
                                <div className="flex items-center justify-center space-x-1">
                                  <field.icon className={`h-4 w-4 ${field.color}`} />
                                  <span>{field.label}</span>
                                </div>
                              </TableHead>
                            ))}
                            <TableHead className="w-24 text-center">SKU Fill Rate</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {editedSkus.map((sku, index) => {
                            const original = shipmentData.skuOrders[index]
                            const skuFillRate = sku.gmv > 0 ? ((sku.gmv || 0) / initialskus[index].gmv) * 100 : 0

                            return (
                              <TableRow key={sku.id} className="group">
                                <TableCell className="font-mono text-sm text-center">{sku.srNo}</TableCell>
                                <TableCell>
                                  <div className="space-y-1">
                                    <div className="font-medium text-sm">{sku.skuName}</div>
                                    <div className="text-xs text-gray-500 space-y-0.5">
                                      <div>
                                        SKU Code: <span className="font-mono">{sku.skuCode}</span>
                                      </div>
                                      <div>
                                        Channel Code: <span className="font-mono">{sku.channelSkuCode}</span>
                                      </div>
                                    </div>
                                  </div>
                                </TableCell>
                                {editableFields.map((field) => {
                                  const hasChanged = original && sku[field.key] !== original[field.key]
                                  return (
                                    <TableCell key={field.key}>
                                      <div className="relative">
                                        <Input
                                          type="number"
                                          value={sku[field.key] || 0}
                                          onChange={(e) => handleFieldChange(index, field.key, e.target.value)}
                                          className={`text-center font-mono ${
                                            hasChanged
                                              ? "border-orange-300 bg-orange-50 dark:border-orange-600 dark:bg-orange-950"
                                              : ""
                                          }`}
                                          step={field.key.includes("Qty") ? "1" : "0.01"}
                                          min="0"
                                          disabled={isUpdating}
                                        />
                                        {hasChanged && (
                                          <div className="absolute -top-1 -right-1">
                                            <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
                                          </div>
                                        )}
                                        {field.requiresConfirmation && (
                                          <Edit className="absolute -top-1 -left-1 h-3 w-3 text-red-500" />
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
                                <TableCell className="text-center">
                                  <Badge
                                    variant={
                                      skuFillRate >= 90 ? "default" : skuFillRate >= 70 ? "secondary" : "destructive"
                                    }
                                    className="font-mono"
                                  >
                                    {skuFillRate.toFixed(1)}%
                                  </Badge>
                                </TableCell>
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
                          Changes detected in{" "}
                          {
                            editedSkus.filter((sku, index) => {
                              const original = shipmentData?.skuOrders[index]
                              return (
                                original &&
                                (sku.poValue !== original.poValue ||
                                  sku.qty !== original.qty ||
                                  sku.gmv !== original.gmv ||
                                  sku.updatedQty !== original.updatedQty ||
                                  sku.updatedGmv !== original.updatedGmv ||
                                  sku.updatedPoValue !== original.updatedPoValue)
                              )
                            }).length
                          }{" "}
                          SKU orders
                        </span>
                      </div>
                      <div className="text-sm text-orange-700 dark:text-orange-300">Review changes before saving</div>
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
              {editableFields.length === 0
                ? "No editable fields available for your role"
                : `You can edit: ${editableFields.map((f) => f.label).join(", ")}`}
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

      {/* Edit Confirmation Dialog */}
      <EditConfirmationDialog
        isOpen={showConfirmDialog}
        onClose={() => {
          setShowConfirmDialog(false)
          setPendingEdit(null)
        }}
        onConfirm={handleConfirmEdit}
        field={pendingEdit?.fieldLabel}
        isLoading={false}
      />
    </>
  )
}
