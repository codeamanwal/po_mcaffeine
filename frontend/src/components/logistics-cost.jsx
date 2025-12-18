"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calculator, Truck, MapPin, Calendar, Hash, Weight, DollarSign, FileText, Clock, Package, InfoIcon } from "lucide-react"
import { format } from "date-fns"
import { getSkuOrdersByShipment } from "@/lib/order"
import { getMasterDocketCharges, getPickupLocationFromFacilityMaster, getMasterCourierType, getMasterRPKAndTAT, getMasterApptChannel, getMasterAppointmentCharges } from "@/master-sheets/fetch-master-sheet-data"


export default function LogisticsCost({ shipmentData }) {
  const [isFetching, setFetching] = useState(true)
  const [skus, setSkus] = useState([])
  const [calculations, setCalculations] = useState(null)
  const [basicInfo, setBasic] = useState({})
  const [costs, setCosts] = useState({})
  const [error, setError] = useState("")

  async function getAllDocketCharges() {
    // get all the transporter from shipment data
    // get respective docket charges from three api calls for all of them
    // sum all the docket charges
    // return sum
    try {
      const res = await Promise.all([
        getMasterDocketCharges(shipmentData.firstTransporter),
        getMasterDocketCharges(shipmentData.secondTransporter),
        getMasterDocketCharges(shipmentData.thirdTransporter),
      ]) 
      console.log("all docket charges:",res)
      let total = 0;
      for(let i=0; i<res.length; i++){
        total += res[i]
      }
      return total
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const calculateCosts = async (shipmentData, skuData) => {
    if (!shipmentData) return null

    const totalUpdatedPoValue = () => {
      let val = 0
      if (!skuData || skuData.length === 0) return 0
      skuData.forEach((element) => {
        val += element?.updatedPoValue ?? element.poValue ?? 0
      })
      return val
    }

    // Basic info extraction
    const uid = shipmentData.uid || "N/A"
    const entryDate = shipmentData?.entryDate || null
    const poDate = shipmentData?.poDate || null
    const channel = shipmentData?.channel || "Default"
    const location = shipmentData?.location || "N/A"
    const facility = shipmentData?.facility || "Default"
    const poNumber = shipmentData?.poNumber || "N/A"
    const chargeableWeight = Number.parseFloat(shipmentData.chargeableWeight || shipmentData.physicalWeight || shipmentData.actualWeight) || 0
    const updatedPoValue = totalUpdatedPoValue() || 0
    const firstTransporter = shipmentData.firstTransporter || null
    const secondTransporter = shipmentData.secondTransporter || null
    const thirdTransporter = shipmentData.thirdTransporter || null

    // Get mapped values
    const pickupLocation = await getPickupLocationFromFacilityMaster(facility) ?? "Unknown"
    //  FACILITY_PICKUP_MAPPING[facility] || FACILITY_PICKUP_MAPPING["Default"] || "Unknown"
    const courierType = await getMasterCourierType(thirdTransporter ?? secondTransporter ?? firstTransporter)

    const rpkAndtat = await getMasterRPKAndTAT(firstTransporter, pickupLocation, location)

    
    let ratePerKg = shipmentData?.rpk ??  rpkAndtat?.ratesPerKg ?? 0
    let tat = rpkAndtat?.tat
    // if(ratePerKg === 0){
    //   // fetch rates per kg from courier-rates master sheet
    //   ratePerKg = await getRates(firstTransporter, pickupLocation, location)
    // }

    // Cost calculations
    const frightCost = chargeableWeight * ratePerKg

    // Final FOV calculation based on courier type
    let finalFov = 0
    switch (courierType) {
      case "Type A":
        finalFov = Math.max(updatedPoValue * 0.001, 100)
        break
      case "Type B":
        finalFov = 100
        break
      case "Type C":
        finalFov = 0
        break
      default:
        finalFov = 0
    }

    // Docket charges
    // let docketCharges = -100
    // if (firstTransporter) docketCharges += getDocketCharges(firstTransporter)
    // if (secondTransporter) docketCharges += getDocketCharges(secondTransporter)
    // if (thirdTransporter) docketCharges += getDocketCharges(thirdTransporter)
    const docketCharges = await getAllDocketCharges()

    // Appointment charges
    // const apptChannel = master_channel_location_mapping[channel] ? master_channel_location_mapping[channel][0]["apptChannel"] : "no";
    const apptChannel = `${await getMasterApptChannel(channel)}`?.toLowerCase() ?? "no" // will be either yes or no

    const appointmentCharges = await getMasterAppointmentCharges(firstTransporter, apptChannel);
      // APPOINTMENT_CHARGES_MAPPING[channel]?.[firstTransporter] ||
      // APPOINTMENT_CHARGES_MAPPING[channel]?.["Default"] ||
      // APPOINTMENT_CHARGES_MAPPING["Default"]["Default"]

    // Misc charges
    const MISC_CHARGES = {
      "Delivery Charges": shipmentData.deliveryCharges ?? 0,
      "Halting": shipmentData.halting ?? 0,
      "Unloading Charges": shipmentData.unloadingCharges ?? 0,
      "Dedicated Vehicle": shipmentData.dedicatedVehicle ?? 0,
      "Other Charges": shipmentData.otherCharges ?? 0,
    }
    const miscCharges = Object.values(MISC_CHARGES)
    const totalMiscCharges = miscCharges.reduce((sum, charge) => sum + charge, 0)

    // Total cost
    const totalCost = frightCost + finalFov + docketCharges + appointmentCharges + totalMiscCharges

    return {
      basicInfo: {
        uid,
        entryDate,
        poDate,
        channel,
        location,
        pickupLocation,
        poNumber,
        chargeableWeight,
        ratePerKg,
        courierType,
        apptChannel, // enum - ["yes", "no"] 
        firstTransporter,
        secondTransporter,
        thirdTransporter,
        updatedPoValue,
      },
      costs: {
        frightCost,
        finalFov,
        docketCharges,
        appointmentCharges,
        miscCharges: MISC_CHARGES,
        totalMiscCharges,
        totalCost,
      },
    }
  }

  const getSkuData = async () => {
    if (!shipmentData) {
      setFetching(false)
      return
    }

    try {
      setFetching(true)
      setError("")

      const res = await getSkuOrdersByShipment(shipmentData.uid)
      // console.log("SKU Data Response:", res.data)

      const skuData = res.data?.skus || []
      setSkus(skuData)

      // Calculate costs after fetching SKU data
      const calculationResult = await calculateCosts(shipmentData, skuData)

      if (calculationResult) {
        setCalculations(calculationResult)
        setBasic(calculationResult.basicInfo)
        setCosts(calculationResult.costs)
      }
    } catch (error) {
      console.error("Error fetching SKU data:", error)
      setError("Failed to fetch SKU data: " + (error.message || error))
      setSkus([])
      setCalculations(null)
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => {
    getSkuData()
  }, [shipmentData])

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Calculator className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600 font-medium">Loading SKU data and calculating costs...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait while we fetch the shipment details</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Calculator className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-600 font-medium">Error loading data</p>
          <p className="text-sm text-red-500 mt-2">{error}</p>
          <button
            onClick={getSkuData}
            className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!calculations) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No shipment data available for cost calculation</p>
          <p className="text-sm text-gray-400 mt-2">Please select a valid shipment to view logistics costs</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Debug Info */}
      <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
        <CardHeader>
          <CardTitle className="text-sm text-blue-900 dark:text-blue-100">Debug Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs space-y-1">
            <p>
              <strong>SKUs Found:</strong> {skus.length}
            </p>
            <p>
              <strong>Total Updated PO Value:</strong> ₹{basicInfo.updatedPoValue?.toFixed(2) || "0.00"}
            </p>
            <p>
              <strong>Shipment UID:</strong> {shipmentData?.uid || "N/A"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Basic Shipment Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Basic Shipment Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Hash className="h-4 w-4" />
                Shipment UID
              </div>
              <div className="font-mono text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded">{basicInfo.uid}</div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                Entry Date
              </div>
              <div className="text-sm">
                {basicInfo.entryDate
                  ? typeof basicInfo.entryDate === "string"
                    ? basicInfo.entryDate
                    : format(new Date(basicInfo.entryDate), "dd MMM yyyy")
                  : "N/A"}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                PO Date
              </div>
              <div className="text-sm">
                {basicInfo.poDate
                  ? typeof basicInfo.poDate === "string"
                    ? basicInfo.poDate
                    : format(new Date(basicInfo.poDate), "dd MMM yyyy")
                  : "N/A"}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Truck className="h-4 w-4" />
                Channel
              </div>
              <Badge variant="outline">{basicInfo.channel}</Badge>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MapPin className="h-4 w-4" />
                Location
              </div>
              <div className="text-sm">{basicInfo.location}</div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MapPin className="h-4 w-4" />
                Pickup Location
              </div>
              <div className="text-sm">{basicInfo.pickupLocation}</div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FileText className="h-4 w-4" />
                PO Number
              </div>
              <div className="font-mono text-sm">{basicInfo.poNumber}</div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Weight className="h-4 w-4" />
                Chargeable Weight
              </div>
              <div className="text-sm font-semibold">{basicInfo?.chargeableWeight?.toFixed(2)} kg</div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <DollarSign className="h-4 w-4" />
                Rate per KG
              </div>
              <div className="text-sm font-semibold">₹{basicInfo?.ratePerKg?.toFixed(2)}</div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <InfoIcon className="h-4 w-4" />
                Appointment Charges type
              </div>
              <div className="text-sm font-semibold">{basicInfo?.apptChannel?.toUpperCase()}</div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <InfoIcon className="h-4 w-4" />
                Transporters (Courier partners)
              </div>
              <div className="text-sm ">
                <span className="font-bold">1st: </span>{basicInfo?.firstTransporter ?? "None"}, <span className="font-bold">2nd: </span>{basicInfo?.secondTransporter ?? "None"}, <span className="font-bold">3rd: </span>{basicInfo?.thirdTransporter ?? "None"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cost Calculations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Cost Calculations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Freight Cost */}
          <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <div>
              <div className="font-medium">Freight Cost</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {basicInfo.chargeableWeight?.toFixed(2)} kg × ₹{basicInfo.ratePerKg?.toFixed(2)}
              </div>
            </div>
            <div className="text-lg font-bold text-blue-600">₹{costs.frightCost?.toFixed(2)}</div>
          </div>

          {/* Final FOV */}
          <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950 rounded-lg">
            <div>
              <div className="font-medium">Final FOV</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Courier Type: {basicInfo.courierType} -
                {basicInfo.courierType === "Type A" && " Max(Updated PO Value × 0.001, ₹100)"}
                {basicInfo.courierType === "Type B" && " Flat ₹100"}
                {basicInfo.courierType === "Type C" && " ₹0"}
                {!["Type A", "Type B", "Type C"].includes(basicInfo.courierType) &&
                  " No Courier type"}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Based on PO Value: ₹{basicInfo.updatedPoValue?.toFixed(2)}
              </div>
            </div>
            <div className="text-lg font-bold text-green-600">₹{costs.finalFov?.toFixed(2)}</div>
          </div>

          {/* Docket Charges */}
          <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
            <div>
              <div className="font-medium">Docket Charges</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {basicInfo.firstTransporter  ?? "None"}, {basicInfo.secondTransporter  ?? "None"}, {basicInfo.thirdTransporter  ?? "None"} - courier partners
              </div>
            </div>
            <div className="text-lg font-bold text-orange-600">₹{costs.docketCharges?.toFixed(2)}</div>
          </div>

          {/* Appointment Charges */}
          <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
            <div>
              <div className="font-medium flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Appointment Charges
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {basicInfo.channel} × {basicInfo.firstTransporter || "Default"}
              </div>
            </div>
            <div className="text-lg font-bold text-purple-600">₹{costs.appointmentCharges?.toFixed(2)}</div>
          </div>

          {/* Miscellaneous Charges */}
          <div className="space-y-3">
            <div className="font-medium flex items-center gap-2">
              <Package className="h-4 w-4" />
              Miscellaneous Charges
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {costs.miscCharges &&
                Object.entries(costs.miscCharges).map(([name, amount]) => (
                  <div key={name} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded">
                    <span className="text-sm">{name}</span>
                    <span className="font-semibold">₹{amount?.toFixed(2)}</span>
                  </div>
                ))}
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-700 rounded font-medium">
              <span>Total Miscellaneous</span>
              <span>₹{costs.totalMiscCharges?.toFixed(2)}</span>
            </div>
          </div>

          <Separator />

          {/* Total Cost */}
          <div className="flex items-center justify-between p-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 rounded-lg border-2 border-indigo-200 dark:border-indigo-800">
            <div>
              <div className="text-xl font-bold">Total Logistics Cost</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Sum of all charges and fees</div>
            </div>
            <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
              ₹{costs.totalCost?.toFixed(2)}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
