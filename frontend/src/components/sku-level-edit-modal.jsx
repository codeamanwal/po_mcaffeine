"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle, Loader2, Package, Save, X } from 'lucide-react'
import { useUserStore } from "@/store/user-store"
import { getSkuOrdersByShipment, updateSkusByShipment } from "@/lib/order"
import { toast } from "sonner"

// Master reasons for quantity changes
const QUANTITY_CHANGE_REASONS = [
  "Stock shortage at warehouse",
  "Damaged goods during handling",
  "Quality control rejection",
  "Inventory reconciliation",
  "Customer request modification",
  "System error correction",
  "Other (specify in comments)",
]

export default function SkuLevelEditModal({
  isOpen,
  onClose,
  shipmentId,
  onSave,
  shipment,
}) {
  const { user } = useUserStore()
  const [isLoading, setIsLoading] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [shipmentData, setShipmentData] = useState(null)
  const [originalSkus, setOriginalSkus] = useState([])
  const [editedSkus, setEditedSkus] = useState([])
  const [editReason, setEditReason] = useState("")
  const [editComments, setEditComments] = useState("")
  const [changedSkus, setChangedSkus] = useState(new Set())

  const isWarehouse = user?.role === "warehouse" || user?.role === "superadmin"

  // Fetch data when opened
  useEffect(() => {
    let mounted = true
    const run = async () => {
      if (!isOpen || !shipmentId) return
      setIsLoading(true)
      setError("")
      setSuccess("")
      try {
        const res = await getSkuOrdersByShipment(shipmentId)
        console.log(res.data)
        // API shape assumed: { data: { ... , skus: [...] } }
        const data= {
          ...(res?.data ?? {}),
          skus: res?.data?.skus ?? [],
        }

        setOriginalSkus(res?.data?.skus)

        // Normalize skus to include our new fields (updatedQty, updatedGmv, updatedPoValue)
        const normalized = (data.skus ?? []).map((sku) => {
          const baseQty = Number(sku.qty ?? 0)
          const baseGMV = Number(sku.gmv ?? 0)
          const basePOV = Number(sku.poValue ?? 0)

          // Prefer existing "updatedQty/updatedGmv/updatedPoValue" if present;
          // otherwise fallback to previously used casing updatedQty/updatedGmv/updatedPoValue;
          // otherwise default to originals.
          const uQty = sku.updatedQty ?? sku.updatedQty ?? baseQty
          const unitGmv = baseQty > 0 ? baseGMV / baseQty : 0
          const unitPo = baseQty > 0 ? basePOV / baseQty : 0
          const uGmv = sku.updatedGmv ?? sku.updatedGmv ?? Math.round(unitGmv * Number(uQty) * 100) / 100
          const uPo = sku.updatedPoValue ?? sku.updatedPoValue ?? Math.round(unitPo * Number(uQty) * 100) / 100

          return {
            ...sku,
            updatedQty: Number.isFinite(Number(uQty)) ? Number(uQty) : 0,
            updatedGmv: Number.isFinite(Number(uGmv)) ? Number(uGmv) : 0,
            updatedPoValue: Number.isFinite(Number(uPo)) ? Number(uPo) : 0,
          }
        })

        if (!mounted) return
        setShipmentData({ ...data, skus: normalized })
        setEditedSkus(normalized)
      } catch (e) {
        console.error(e)
        setError("Failed to fetch SKU data. Please try again.")
      } finally {
        if (mounted) setIsLoading(false)
      }
    }
    run()
    return () => {
      mounted = false
    }
  }, [isOpen, shipmentId])

  // Change handlers - warehouse can edit only quantity, saved to updatedQty and recalc updatedGmv/updatedPoValue
  const onQtyChange = (index, value) => {
    if (!isWarehouse) return
    const nextQty = Math.max(0, Math.floor(Number(value) || 0))
    const originalQty = Number(originalSkus[index]?.qty ?? 0)
    
    // Ensure updatedQty <= original qty
    const validatedQty = Math.min(nextQty, originalQty)
    
    setEditedSkus((prev) => {
      const next = [...prev]
      const row = next[index]
      const baseQty = Number(row.qty ?? 0)
      const baseGMV = Number(row.gmv ?? 0)
      const basePOV = Number(row.poValue ?? 0)
      const unitGmv = baseQty > 0 ? baseGMV / baseQty : 0
      const unitPo = baseQty > 0 ? basePOV / baseQty : 0
      const newUpdatedGmv = Math.round(unitGmv * validatedQty * 100) / 100
      const newUpdatedPo = Math.round(unitPo * validatedQty * 100) / 100

      next[index] = {
        ...row,
        updatedQty: validatedQty,
        updatedGmv: newUpdatedGmv,
        updatedPoValue: newUpdatedPo,
      }
      return next
    })

    // Track changed SKUs
    setChangedSkus(prev => {
      const newSet = new Set(prev)
      if (validatedQty !== originalQty) {
        newSet.add(index)
      } else {
        newSet.delete(index)
      }
      return newSet
    })
  }

  // Helper function to calculate fill rates
  const calculateFillRates = (sku, original) => {
    const originalQty = Number(original?.qty ?? 0)
    const originalGmv = Number(original?.gmv ?? 0)
    const updatedQty = Number(sku?.updatedQty ?? originalQty)
    const updatedGmv = Number(sku?.updatedGmv ?? originalGmv)
    
    const qtyFillRate = originalQty > 0 ? (updatedQty / originalQty) * 100 : 100
    const gmvFillRate = originalGmv > 0 ? (updatedGmv / originalGmv) * 100 : 100
    
    return { qtyFillRate, gmvFillRate }
  }

  // Changes detection
  const hasChanges = useMemo(() => {
    if (!shipmentData) return false
    return editedSkus.some((sku, i) => {
      const orig = originalSkus[i]
      if (!orig) return false
      return (
        sku.updatedQty !== orig.updatedQty ||
        sku.updatedGmv !== orig.updatedGmv ||
        sku.updatedPoValue !== orig.updatedPoValue
      )
    })
  }, [editedSkus, originalSkus, shipmentData])

  // Save
  const handleSave = async () => {
    if (!shipmentId || !shipmentData) return
    if (!isWarehouse) {
      toast.error("Only Warehouse can update quantities.")
      return
    }
    if (!hasChanges) {
      setError("No changes detected.")
      return
    }
    if (changedSkus.size > 0 && !editReason) {
      setError("Please provide a reason for quantity changes.")
      return
    }

    setIsUpdating(true)
    setError("")
    setSuccess("")
    try {
      // Build minimal payload: send only identifiers and our updated fields
      const payloadSkus = editedSkus.map((sku, idx) => {
        let isChanged = sku.qty !== sku.updatedQty ? true : false;
        if(!isChanged) return originalSkus[idx];
        return {
          ...sku,
           updatedQty: sku.updatedQty ?? 0,
          updatedGmv: sku.updatedGmv ?? 0,
          updatedPoValue: sku.updatedPoValue ?? 0,
        }})

      console.log(payloadSkus);
      await updateSkusByShipment({
        shipmentId,
        skus: payloadSkus,
        editReason: editReason,
        editComments: editComments,
        updatedBy: user?.email,
        updatedAt: new Date().toISOString(),
      })

      setSuccess("SKU updates saved successfully.")
      toast.success("SKU updates saved successfully.")
      setOriginalSkus(editedSkus)
      setChangedSkus(new Set())
      setEditReason("")
      setEditComments("")
      if (onSave) onSave(shipmentId, editedSkus)
      setTimeout(() => {
        onClose()
      }, 1000)
    } catch (e) {
      console.error(e)
      const msg = err.response.data.error || err.message || err || "Failed to update SKUs. Please try again."
      setError(msg)
      toast.error(msg)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleClose = () => {
    onClose()
    // reset transient state
    setError("")
    setSuccess("")
    setEditReason("")
    setEditComments("")
    setChangedSkus(new Set())
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[96vw] md:max-w-5xl h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            <span>SKU Level Edit</span>
            {shipment?.poNumber && (
              <Badge variant="outline" className="ml-1">
                {shipment.poNumber}
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            {isWarehouse
              ? "Update only quantity. GMV and PO Value will auto-calculate and be stored in updated fields."
              : "View-only. Only Warehouse can update quantity."}
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

        

        

        {/* SKU Cards */}
        <ScrollArea className="max-h-[60vh] pr-3">

          {/* Top basic info (optional) */}
          {shipment && (
            <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
              <CardHeader>
                <CardTitle className="text-sm md:text-base">Shipment Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-xs text-gray-600 dark:text-gray-400">Channel</Label>
                    <div className="font-semibold">{shipment.channel ?? "-"}</div>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600 dark:text-gray-400">Location</Label>
                    <div className="font-semibold">{shipment.location ?? "-"}</div>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600 dark:text-gray-400">PO Date</Label>
                    <div className="font-semibold">{shipment.poDate ?? "-"}</div>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600 dark:text-gray-400">PO Number</Label>
                    <div className="font-semibold">{shipment.poNumber ?? "-"}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {isLoading && (
              <Card>
                <CardContent className="py-10 flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                </CardContent>
              </Card>
            )}

            {!isLoading &&
              editedSkus.map((sku, index) => {
                const original = originalSkus[index] ?? {}
                const { qtyFillRate, gmvFillRate } = calculateFillRates(sku, original)
                const isChanged = changedSkus.has(index)
                const originalQty = Number(original.qty ?? 0)
                
                return (
                  <Card key={sku.id ?? `${sku.skuCode}-${index}`} className={`border rounded-lg ${isChanged ? 'border-orange-300 bg-orange-50 dark:border-orange-600 dark:bg-orange-950' : ''}`}>
                    <CardHeader className="pb-2">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm md:text-base">{sku.skuName ?? "SKU"}</CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-[10px] md:text-xs">
                              Sr No: {sku.srNo ?? "-"}
                            </Badge>
                            {isChanged && (
                              <Badge variant="outline" className="text-[10px] text-orange-600 border-orange-300">
                                Changed
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-[11px] text-gray-500">
                          SKU: <span className="font-mono">{sku.skuCode ?? "-"}</span> • Channel:{" "}
                          <span className="font-mono">{sku.channelSkuCode ?? "-"}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {/* Fill Rates */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="text-center p-2 rounded-md bg-gray-100 dark:bg-gray-800">
                          <div className="text-xs text-gray-600 dark:text-gray-400">Fill Rate (Qty)</div>
                          <Badge 
                            variant={qtyFillRate >= 90 ? "default" : qtyFillRate >= 70 ? "secondary" : "destructive"}
                            className="font-mono text-xs"
                          >
                            {qtyFillRate.toFixed(1)}%
                          </Badge>
                        </div>
                        <div className="text-center p-2 rounded-md bg-gray-100 dark:bg-gray-800">
                          <div className="text-xs text-gray-600 dark:text-gray-400">Fill Rate (GMV)</div>
                          <Badge 
                            variant={gmvFillRate >= 90 ? "default" : gmvFillRate >= 70 ? "secondary" : "destructive"}
                            className="font-mono text-xs"
                          >
                            {gmvFillRate.toFixed(1)}%
                          </Badge>
                        </div>
                      </div>

                      {/* Original vs Updated */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-md border p-3 bg-gray-50 dark:bg-gray-900">
                          <div className="text-xs font-medium mb-2">Original</div>
                          <div className="text-xs text-gray-600">Qty</div>
                          <div className="font-semibold tabular-nums">{original.qty ?? 0}</div>
                          <div className="mt-2 text-xs text-gray-600">GMV</div>
                          <div className="font-semibold tabular-nums">
                            ₹{Number(original.gmv ?? 0).toLocaleString()}
                          </div>
                          <div className="mt-2 text-xs text-gray-600">PO Value</div>
                          <div className="font-semibold tabular-nums">
                            ₹{Number(original.poValue ?? 0).toLocaleString()}
                          </div>
                        </div>

                        <div className="rounded-md border p-3">
                          <div className="text-xs font-medium mb-2">Updated</div>

                          <div className="text-xs text-gray-600 flex items-center justify-between">
                            <span>Quantity (Max: {originalQty})</span>
                            {!isWarehouse && <Badge variant="outline">View Only</Badge>}
                          </div>
                          <Input
                            type="number"
                            inputMode="numeric"
                            min={0}
                            max={originalQty}
                            step={1}
                            className="mt-1 text-center font-mono"
                            value={Number(sku.updatedQty ?? 0)}
                            onChange={(e) => onQtyChange(index, e.target.value)}
                            disabled={!isWarehouse || isUpdating}
                          />
                          {Number(sku.updatedQty ?? 0) > originalQty && (
                            <div className="text-xs text-red-500 mt-1">
                              Cannot exceed original quantity ({originalQty})
                            </div>
                          )}

                          <div className="mt-2 text-xs text-gray-600">GMV (updatedGmv)</div>
                          <div className="font-semibold tabular-nums">
                            ₹{Number(sku.updatedGmv ?? 0).toLocaleString()}
                          </div>

                          <div className="mt-2 text-xs text-gray-600">PO Value (updatedPoValue)</div>
                          <div className="font-semibold tabular-nums">
                            ₹{Number(sku.updatedPoValue ?? 0).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
          </div>
          <Separator />

          {/* Reason Section for Changes */}
          {changedSkus.size > 0 && isWarehouse && (
            <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-orange-900 dark:text-orange-100">
                  <AlertCircle className="h-5 w-5" />
                  <span>Reason Required for Quantity Changes</span>
                </CardTitle>
                <div className="text-sm text-orange-700 dark:text-orange-300">
                  You have changed quantities for {changedSkus.size} SKU(s). Please provide a reason.
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="edit-reason" className="text-orange-900 dark:text-orange-100">
                    Reason for Changes *
                  </Label>
                  <select 
                    className="w-full mt-1 p-2 border border-orange-300 rounded-md focus:border-orange-500"
                    value={editReason} 
                    onChange={(e) => setEditReason(e.target.value)}
                  >
                    <option value="">Select a reason...</option>
                    {QUANTITY_CHANGE_REASONS.map((reason) => (
                      <option key={reason} value={reason}>
                        {reason}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="edit-comments" className="text-orange-900 dark:text-orange-100">
                    Additional Comments
                  </Label>
                  <textarea
                    id="edit-comments"
                    placeholder="Any additional details about the changes..."
                    value={editComments}
                    onChange={(e) => setEditComments(e.target.value)}
                    rows={3}
                    className="w-full mt-1 p-2 border border-orange-300 rounded-md focus:border-orange-500"
                  />
                </div>

                {!editReason && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>Please select a reason before saving the changes.</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}

       
          <ScrollBar orientation="vertical" />
        </ScrollArea>

         {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t">
          {!isWarehouse ? (
            <div className="text-sm text-gray-500">Only Warehouse can edit quantity.</div>
          ) : (
            <div className="text-sm text-gray-500">You can edit: Quantity (auto-updates GMV and PO Value)</div>
          )}
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose} disabled={isUpdating}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!isWarehouse || !hasChanges || isUpdating || isLoading || (changedSkus.size > 0 && !editReason)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
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
