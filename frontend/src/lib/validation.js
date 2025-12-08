// Import master data from existing files
import { master_facility_option, master_rto_remark_options } from "@/constants/master_sheet"
import { master_channel_options } from "@/constants/master_sheet"
import { master_status_planning_options } from "@/constants/master_sheet"
import { master_status_warehouse_options } from "@/constants/master_sheet"
import { master_status_logistics_options } from "@/constants/master_sheet"
import { getAllCourierPartners } from "@/constants/courier-partners"
import { master_rejection_reasons } from "@/constants/master_sheet"
import { channelSkuMapping } from "@/constants/master_channel_skucode_map"
import { master_sku_code_options } from "@/constants/sku_code_options"
import { master_channel_location_mapping } from "@/constants/master_sheet"

const master_courier_partner_options = getAllCourierPartners();

// Location options (derived from common locations)
export const master_location_options = [
  "New Delhi",
  "Mumbai",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Ahmedabad",
  "Surat",
  "Jaipur",
  "Gurgaon",
  "Noida",
  "Guwahati",
]


// Field validation function
export const validateField = (fieldName, value, allowedValues)=> {
  const errors = []

  if (!value || value.trim() === "") {
    errors.push(`${fieldName} is required`)
  } else if (!allowedValues?.includes(value)) {
    errors.push(
      `${fieldName} must be one of: ${allowedValues?.slice(0, 5).join(", ")}${allowedValues?.length > 5 ? "..." : ""}`,
    )
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// Shipment data validation
export const validateShipmentData = (shipmentData)=> {
  const errors = []
  const warnings = []

  // Validate facility
  // if (shipmentData.facility) {
  //   const facilityValidation = validateField("Facility", shipmentData.facility, master_facility_option)
  //   errors.push(...facilityValidation.errors)
  // }

  // Validate channel
  // if (shipmentData.channel) {
  //   const channelValidation = validateField("Channel", shipmentData.channel, master_channel_options)
  //   errors.push(...channelValidation.errors)
  // }

  // Validate location
  // first get all the location for given channel
  // const locs =  master_channel_location_mapping[shipmentData.channel]?.map((loc) => {
  //   return loc.location;
  // })
  // if (shipmentData.location) {
  //   const locationValidation = validateField("Location", shipmentData.location, locs)
  //   errors.push(...locationValidation.errors)
  // }

  // Validate status fields
  if (shipmentData.statusPlanning) {
    const statusPlanningValidation = validateField(
      "Status Planning",
      shipmentData.statusPlanning,
      master_status_planning_options,
    )
    errors.push(...statusPlanningValidation.errors)
  }

  if (shipmentData.statusWarehouse) {
    const statusWarehouseValidation = validateField(
      "Status Warehouse",
      shipmentData.statusWarehouse,
      master_status_warehouse_options,
    )
    errors.push(...statusWarehouseValidation.errors)
  }

  if (shipmentData.statusLogistics) {
    const statusLogisticsValidation = validateField(
      "Status Logistics",
      shipmentData.statusLogistics,
      master_status_logistics_options,
    )
    errors.push(...statusLogisticsValidation.errors)
  }

  // Validate transporter fields
  // const transporterFields = ["firstTransporter", "secondTransporter", "thirdTransporter"]
  // transporterFields.forEach((field) => {
  //   if (shipmentData[field]) {
  //     const transporterValidation = validateField(field, shipmentData[field], master_courier_partner_options)
  //     errors.push(...transporterValidation.errors)
  //   }
  // })

  // Validate reschedule lag remark
  if (shipmentData.rescheduleLag) {
    const rescheduleValidation = validateField(
      "Reschedule Lag Remark",
      shipmentData.rescheduleLag,
      master_rto_remark_options,
    )
    errors.push(...rescheduleValidation.errors)
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}

// Bulk order data validation
export const validateBulkOrderData = (orders) => {
  const errors= []
  const warnings = []

  // Group orders by PO Number for brand consistency check
  const ordersByPO = orders.reduce((acc, order, index) => {
    const poNumber = order.poNumber
    if (!acc[poNumber]) {
      acc[poNumber] = []
    }
    acc[poNumber].push({ ...order, originalIndex: index })
    return acc
  }, {})

  // Check brand consistency within each PO
  // Object.entries(ordersByPO).forEach(([poNumber, poOrders]) => {
  //   const brands = new Set()

  //   poOrders.forEach((order) => {
  //     const masterSku = master_sku_code_options.find((m) => m.sku_code === order.skuCode)
  //     if (masterSku) {
  //       brands.add(masterSku.brand_name)
  //     }
  //   })

  //   if (brands.size > 1) {
  //     errors.push(
  //       `PO ${poNumber}: Multiple brands detected: ${Array.from(brands).join(", ")}. All SKUs in a PO must be from the same brand.`,
  //     )
  //   }
  // })

  // Validate each order
  orders.forEach((order, index) => {
    const orderPrefix = `Order ${index + 1}`

    // Validate SKU code exists in master data
    // if (order.skuCode) {
    //   const masterSku = master_sku_code_options.find((m) => m.sku_code === order.skuCode)
    //   if (!masterSku) {
    //     errors.push(`${orderPrefix}: SKU Code "${order.skuCode}" not found in master data`)
    //   } else {
    //     // Auto-fill validation - check if provided data matches master data
    //     if (order.skuName && order.skuName !== masterSku.sku_name) {
    //       warnings.push(`${orderPrefix}: SKU Name should be "${masterSku.sku_name}" for SKU Code "${order.skuCode}"`)
    //     }

    //     if (order.brand && order.brand !== masterSku.brand_name) {
    //       errors.push(`${orderPrefix}: Brand should be "${masterSku.brand_name}" for SKU Code "${order.skuCode}"`)
    //     }

    //     // Validate GMV calculation
    //     if (masterSku.mrp && order.qty) {
    //       const expectedGmv = order.qty * masterSku.mrp
    //       if (order.gmv && Math.abs(order.gmv - expectedGmv) > 0.01) {
    //         warnings.push(`${orderPrefix}: GMV should be ${expectedGmv} (Qty: ${order.qty} × MRP: ${masterSku.mrp})`)
    //       }
    //     }
    //   }
    // }

    // Validate channel SKU code mapping
    // if (order.channel && order.skuCode && order.channelSkuCode) {
    //   const channelMapping = channelSkuMapping[order.channel]
    //   if (channelMapping && channelMapping[order.skuCode]) {
    //     const expectedChannelSkuCode = channelMapping[order.skuCode]
    //     if (order.channelSkuCode !== expectedChannelSkuCode) {
    //       warnings.push(
    //         `${orderPrefix}: Channel SKU Code should be "${expectedChannelSkuCode}" for Channel "${order.channel}" and SKU "${order.skuCode}"`,
    //       )
    //     }
    //   }
    // }

    // Validate other fields using existing validation
    const shipmentValidation = validateShipmentData(order)
    errors.push(...shipmentValidation.errors.map((error) => `${orderPrefix}: ${error}`))
    warnings.push(...(shipmentValidation.warnings || []).map((warning) => `${orderPrefix}: ${warning}`))
  })

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}

// Bulk sku validation
export const validateBulkSkuData = (csvSkus) => {
  const errors = []
  const warnings = []

  // Check for duplicate entries in CSV
  const seen = new Set()
  const duplicates = new Set()

  csvSkus.forEach((csvSku, index) => {
    const key = `${csvSku.poNumber}-${csvSku.skuCode}`
    if (seen.has(key)) {
      duplicates.add(key)
    }
    seen.add(key)
  })

  if (duplicates.size > 0) {
    errors.push(`Duplicate entries found in CSV for: ${Array.from(duplicates).join(", ")}`)
  }

  // Validate each CSV SKU entry
  csvSkus.forEach((csvSku, index) => {
    const rowPrefix = `Row ${csvSku.rowNumber || index + 1}`

    // Check if record has errors from matching process
    if (csvSku.error) {
      errors.push(`${rowPrefix}: ${csvSku.error}`)
      return
    }

    // Validate required fields
    if (!csvSku.poNumber || !csvSku.skuCode) {
      errors.push(`${rowPrefix}: poNumber, and skuCode are required`)
    }

    // Validate updated quantity
    if (csvSku.updatedQty === undefined || csvSku.updatedQty === null) {
      errors.push(`${rowPrefix}: updatedQty is required`)
    } else {
      const updatedQty = Number(csvSku.updatedQty)
      const originalQty = Number(csvSku.originalQty ?? 0)

      if (isNaN(updatedQty)) {
        errors.push(`${rowPrefix}: updatedQty must be a valid number`)
      } else {
        if (updatedQty < 0) {
          errors.push(`${rowPrefix}: updatedQty cannot be negative`)
        }

        if (!Number.isInteger(updatedQty)) {
          errors.push(`${rowPrefix}: updatedQty must be a whole number`)
        }

        if (originalQty > 0 && updatedQty > originalQty) {
          errors.push(`${rowPrefix}: updatedQty (${updatedQty}) cannot exceed original quantity (${originalQty})`)
        }
      }
    }

    // Validate calculated values if present
    if (csvSku.calculatedGmv !== undefined && csvSku.calculatedPoValue !== undefined) {
      const originalGmv = Number(csvSku.originalGmv ?? 0)
      const originalPoValue = Number(csvSku.originalPoValue ?? 0)
      const originalQty = Number(csvSku.originalQty ?? 0)
      const updatedQty = Number(csvSku.updatedQty ?? 0)

      if (originalQty > 0) {
        const expectedGmv = Math.round((originalGmv / originalQty) * updatedQty * 100) / 100
        const expectedPoValue = Math.round((originalPoValue / originalQty) * updatedQty * 100) / 100

        if (Math.abs(csvSku.calculatedGmv - expectedGmv) > 0.01) {
          warnings.push(`${rowPrefix}: Calculated GMV (${csvSku.calculatedGmv}) differs from expected (${expectedGmv})`)
        }

        if (Math.abs(csvSku.calculatedPoValue - expectedPoValue) > 0.01) {
          warnings.push(
            `${rowPrefix}: Calculated PO Value (${csvSku.calculatedPoValue}) differs from expected (${expectedPoValue})`,
          )
        }
      }
    }

    // Check for significant quantity reductions (warning only)
    if (csvSku.originalQty && csvSku.updatedQty) {
      const originalQty = Number(csvSku.originalQty)
      const updatedQty = Number(csvSku.updatedQty)
      const reductionPercentage = ((originalQty - updatedQty) / originalQty) * 100

      if (reductionPercentage > 50) {
        warnings.push(`${rowPrefix}: Large quantity reduction (${reductionPercentage.toFixed(1)}%) - please verify`)
      }
    }
  })

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}

// Auto-fill functions
export const autoFillSkuData = (skuCode) => {
  const masterSku = master_sku_code_options?.find((m) => m.sku_code === skuCode)
  if (!masterSku) return null

  let brand = "";
  const prefix = `${skuCode}`.substring(0,3).toLowerCase();
  if(prefix === "hyp"){
      brand = "Hyphen"
    } else if(prefix === "ama"){
      brand = "Aman"
    } else if(prefix === "viv"){
      brand = "Vivek"
    } else {
      brand = masterSku?.brand_name || "MCaffeine"
    }
  return {
    skuName: masterSku?.sku_name || "",
    brandName: brand ?? "MCaffeine",
    mrp: masterSku?.mrp || "",
  }
}

export const calculateGmv = (qty, skuCode) => {
  const masterSku = master_sku_code_options?.find((m) => m.sku_code === skuCode)
  if (!masterSku || !masterSku?.mrp) return 0

  return qty * masterSku?.mrp
}

export const generateChannelSkuCode = (channel, skuCode) => {
  const channelMapping = channelSkuMapping[channel]
  if (!channelMapping || !channelMapping[skuCode]) {
    return ""
  }
  return channelMapping[skuCode]
}

// Get brand from SKU codes
export const getBrandFromSkus = (skuCodes) => {
  const brands = new Set()
  skuCodes.forEach((skuCode) => {
    const masterSku = master_sku_code_options?.find((m) => m.sku_code === skuCode)
    if (masterSku) {
      brands.add(masterSku?.brand_name ?? "MCaffeine")
    }
  })

  // Return brand only if all SKUs are from the same brand
  if (brands.size === 1) {
    return Array.from(brands)[0]
  }

  return null
}

// Validate brand consistency for multiple SKUs
export const validateBrandConsistency = (skuCodes) => {
  const errors = []
  const brands = new Set()

  skuCodes.forEach((skuCode) => {
    const masterSku = master_sku_code_options?.find((m) => m.sku_code === skuCode)
    if (masterSku) {
      brands.add(masterSku?.brand_name ?? "MCaffeine")
    }
  })

  if (brands.size > 1) {
    errors.push(`Multiple brands detected: ${Array.from(brands).join(", ")}. All SKUs must be from the same brand.`)
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// Get available locations for a channel (if there are channel-specific restrictions)
export const getLocationsForChannel = (channel) => {
  // For now, return all locations. This can be customized based on business rules
  const location_options = master_channel_location_mapping[channel]
  // console.log(location_options)
  return location_options
}

// Validate PO Value calculation
export const validatePoValue = (gmv, expectedRatio = 0.8) => {
  // Assuming PO Value is typically 80% of GMV (this can be adjusted based on business rules)
  return Math.round(gmv * expectedRatio * 100) / 100
}

// Get SKU suggestions based on partial input
export const getSkuSuggestions = (searchTerm, limit = 10) => {
  const term = searchTerm.toLowerCase()
  return master_sku_code_options
    .filter((sku) => sku.sku_code.toLowerCase().includes(term) || sku.sku_name.toLowerCase().includes(term))
    .slice(0, limit)
}

// Get channel suggestions
export const getChannelSuggestions = (searchTerm, limit = 10) => {
  const term = searchTerm.toLowerCase()
  return master_channel_options.filter((channel) => channel.toLowerCase().includes(term)).slice(0, limit)
}

// Get Delivery type
export const getDeliveryType = (channel, type) => {
  if(type) return type;
  if(!channel) return "";
  const ch = `${channel}`.toLowerCase()
  if(ch === "amazon" || ch === "flipkart") return "Pick up";
  else return "Drop in";
}


// Export master data for use in components
export {
  master_facility_option,
  master_channel_options,
  master_status_planning_options,
  master_status_warehouse_options,
  master_status_logistics_options,
  master_courier_partner_options,
  master_rejection_reasons,
  channelSkuMapping,
  master_sku_code_options,
}
