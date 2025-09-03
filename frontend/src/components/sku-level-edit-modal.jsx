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
import { AlertCircle, CheckCircle, Loader2, Package, Save, X } from "lucide-react"
import { useUserStore } from "@/store/user-store"
import { getSkuOrdersByShipment, updateSkusByShipment } from "@/lib/order"
import { toast } from "sonner"

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

  const isWarehouse = user?.role === "warehouse" || 
  // "superadmin"

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
    setEditedSkus((prev) => {
      const next = [...prev]
      const row = next[index]
      const baseQty = Number(row.qty ?? 0)
      const baseGMV = Number(row.gmv ?? 0)
      const basePOV = Number(row.poValue ?? 0)
      const unitGmv = baseQty > 0 ? baseGMV / baseQty : 0
      const unitPo = baseQty > 0 ? basePOV / baseQty : 0
      const newupdatedGmv = Math.round(unitGmv * nextQty * 100) / 100
      const newUpdatedPo = Math.round(unitPo * nextQty * 100) / 100

      next[index] = {
        ...row,
        updatedQty: nextQty,
        updatedGmv: newupdatedGmv,
        updatedPoValue: newUpdatedPo,
      }
      return next
    })
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
      })

      setSuccess("SKU updates saved successfully.")
      toast.success("SKU updates saved successfully.")
      setOriginalSkus(editedSkus)
      if (onSave) onSave(shipmentId, editedSkus)
      setTimeout(() => {
        onClose()
      }, 1000)
    } catch (e) {
      console.error(e)
      const msg = e?.message || "Failed to update SKUs. Please try again."
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
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[96vw] md:max-w-5xl max-h-[95vh] overflow-hidden">
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

        {/* SKU Cards */}
        <ScrollArea className="max-h-[60vh] pr-3">
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
                return (
                  <Card key={sku.id ?? `${sku.skuCode}-${index}`} className="border rounded-lg">
                    <CardHeader className="pb-2">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm md:text-base">{sku.skuName ?? "SKU"}</CardTitle>
                          <Badge variant="secondary" className="text-[10px] md:text-xs">
                            Sr No: {sku.srNo ?? "-"}
                          </Badge>
                        </div>
                        <div className="text-[11px] text-gray-500">
                          SKU: <span className="font-mono">{sku.skuCode ?? "-"}</span> • Channel:{" "}
                          <span className="font-mono">{sku.channelSkuCode ?? "-"}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
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
                            <span>Quantity</span>
                            {!isWarehouse && <Badge variant="outline">View Only</Badge>}
                          </div>
                          <Input
                            type="number"
                            inputMode="numeric"
                            min={0}
                            step={1}
                            className="mt-1 text-center font-mono"
                            value={Number(sku.updatedQty ?? 0)}
                            onChange={(e) => onQtyChange(index, e.target.value)}
                            disabled={!isWarehouse || isUpdating}
                          />

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
              disabled={!isWarehouse || !hasChanges || isUpdating || isLoading}
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
