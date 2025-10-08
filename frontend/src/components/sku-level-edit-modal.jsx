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

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

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
  skus,
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
    console.log("Inside sku level panel")
    console.log(shipmentId)
    let mounted = true
    const run = async () => {
      if (!shipmentId) return
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

  const calculateOverallFillRates = () => {
    if (!originalSkus?.length || !editedSkus?.length) {
      return { qtyRate: 100, gmvRate: 100 }; // or 0, based on how you define "empty" fill rate
    }

    let qtyRate = 0;
    let gmvRate = 0;
    const length = Math.min(originalSkus.length, editedSkus.length);

    for (let x = 0; x < length; x++) {
      const singleRates = calculateFillRates(editedSkus[x], originalSkus[x]);
      qtyRate += singleRates.qtyFillRate;
      gmvRate += singleRates.gmvFillRate;
    }

    qtyRate = qtyRate / length;
    gmvRate = gmvRate / length;

    return { qtyRate, gmvRate };
  };


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
      // setTimeout(() => {
      //   onClose()
      // }, 1000)
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
    <div open={isOpen} onOpenChange={handleClose}>
      <div className="max-w-full my-5 mx-auto">
        <div>
          <strong className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            <span>SKU Level Edit</span>
            {shipment?.poNumber && (
              <Badge variant="outline" className="ml-1">
                {shipment.poNumber}
              </Badge>
            )}
          </strong>
          {/* <DialogDescription>
            {isWarehouse
              ? "Update only quantity. GMV and PO Value will auto-calculate and be stored in updated fields."
              : "View-only. Only Warehouse can update quantity."}
          </DialogDescription> */}
        </div>

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
        <ScrollArea className="pr-3 overflow-auto">
          {/* Top basic info (optional) */}
          {shipment && !isLoading && (
            <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
              <CardHeader>
                <CardTitle className="text-sm md:text-base">Fill Rate Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* <div>
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
                  </div> */}
                  <div>
                    <Label className="text-xs text-gray-600 dark:text-gray-400">Overall Qty Fill Rate</Label>
                    <div className="font-semibold">{calculateOverallFillRates().qtyRate.toFixed(1) ?? 100}%</div>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600 dark:text-gray-400">Overall GMV Fill Rate</Label>
                    <div className="font-semibold">{calculateOverallFillRates().gmvRate.toFixed(1) ?? 100}%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-1 gap-4 overflow-auto">
            {isLoading && (
              <Card>
                <CardContent className="py-10 flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                </CardContent>
              </Card>
            )}
          </div>
          
          
          <div className="my-10 max-w-full overflow-x-auto">
            <div className="max-h-[70vh] overflow-y-auto">
              <table className="min-w-full border border-gray-200 relative">
                {/* Table Head */}
                <TableHeader className="bg-background sticky top-0 z-20">
                <TableRow className={"text-xs"}>
                    {["Sr/NO","SKU Code", "SKU Name", "Qty", "GMV", "PO Value", "Upd Qty", "Upd GMV", "Upd PO Val", "Fill Rate(qty)"].map((item, idx) => {
                    const leftOffset = idx < 0 ? `${idx * 100}px` : "auto";
                    return (
                        <TableCell
                        key={idx}
                        className="px-4 py-2 border-b border-r border-gray-200 text-left text-wrap bg-background"
                        style={{
                            position: idx < 0 ? "sticky" : "static",
                            left: leftOffset,
                            minWidth: "20px",
                            maxWidth: "500px",
                            zIndex: idx < 0 ? 30 : 10,
                            whiteSpace: "normal",  
                            wordWrap: "break-word",
                            overflowWrap: "break-word",
                        }}
                        >
                        {item}
                        </TableCell>
                    );
                    })}
                </TableRow>
                </TableHeader>
                {/* Table Body */}
                <TableBody className={"text-xs"}>
                  {
                    !isLoading && editedSkus.map((sku, rowIdx) => {
                      const original = originalSkus[rowIdx] ?? {}
                      const { qtyFillRate, gmvFillRate } = calculateFillRates(sku, original)
                      const isChanged = changedSkus.has(rowIdx)
                      const originalQty = Number(original.qty ?? 0)
                    
                      return (
                        <TableRow key={rowIdx} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        {["Sr/NO", "SKU Code", "SKU Name", "Qty", "GMV", "PO Value", "Upd Qty", "Upd GMV", "Upd PO Val", "Fill Rate(qty)"].map((item, colIdx) => {
                            const leftOffset = colIdx < 0 ? `${colIdx * 100}px` : "auto";
                            return (
                            <TableCell
                                key={colIdx}
                                className="px-4 py-2 border-b border-r border-gray-200 bg-background text-wrap overflow-hidden"
                                style={{
                                position: colIdx < 0 ? "sticky" : "static",
                                left: leftOffset,
                                minWidth: "20px",
                                maxWidth: "500px",
                                zIndex: colIdx < 0 ? 10 : 1,
                                whiteSpace: "normal",  
                                wordWrap: "break-word",
                                overflowWrap: "break-word",
                                }}
                            >
                                {
                                  item === "Sr/NO" && (
                                    <div className="mx-auto">{sku.srNo || "--"}</div>
                                  )
                                }
                                {
                                  item === "SKU Code" && (
                                    <div className="mx-auto">{sku.skuCode || "--"}</div>
                                  )
                                }
                                {
                                  item === "SKU Name" && (
                                    <div className="mx-auto">{sku.skuName || "--"}</div>
                                  )
                                }
                                {
                                  item === "Qty" && (
                                    <div className="font-semibold tabular-nums">{original.qty ?? 0}</div>
                                  )
                                }
                                {
                                  item === "GMV" && (
                                    <div className="font-semibold tabular-nums">
                                      ₹{Number(original.gmv ?? 0).toLocaleString()}
                                    </div>
                                  )
                                }
                                {
                                  item === "PO Value" && (
                                    <div className="font-semibold tabular-nums">
                                      ₹{Number(original.poValue ?? 0).toLocaleString()}
                                    </div>
                                  )
                                }
                                {
                                  item === "Upd Qty" && (
                                    <>
                                    {/* <span>Max: {originalQty}</span> */}
                                    <Input
                                      type="number"
                                      // inputMode="numeric"
                                      min={0}
                                      max={originalQty}
                                      step={1}
                                      className="mt-1 text-center font-mono min-w-20"
                                      value={Number(sku.updatedQty ?? 0)}
                                      onChange={(e) => onQtyChange(rowIdx, e.target.value)}
                                      disabled={!isWarehouse || isUpdating}
                                    />
                                    </>
                                  )
                                }
                                {
                                  item === "Upd GMV" && (
                                    <div className="font-semibold tabular-nums">
                                      ₹{Number(sku.updatedGmv ?? 0).toLocaleString()}
                                    </div>
                                  )
                                }
                                {
                                  item === "Upd PO Val" && (
                                    <div className="font-semibold tabular-nums">
                                      ₹{Number(sku.updatedPoValue ?? 0).toLocaleString()}
                                    </div>
                                  )
                                }
                                {
                                  item === "Fill Rate(qty)" && (
                                    <Badge 
                                      variant={qtyFillRate >= 90 ? "default" : qtyFillRate >= 70 ? "secondary" : "destructive"}
                                      className="font-mono text-xs"
                                    >
                                      {qtyFillRate.toFixed(1)}%
                                    </Badge>
                                  )
                                }
                            </TableCell>
                            );
                        })}
                        </TableRow>
                      )})
                  }
                </TableBody>
              </table>
            </div>
          </div>

          {/* Reason Section for Changes */}
          {changedSkus.size > 0 && isWarehouse && (
            <Card className="overflow-auto border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
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

          <Separator />
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
            {/* <Button variant="outline" onClick={handleClose} disabled={isUpdating}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button> */}
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
       
      </div>
    </div>
  )
}
