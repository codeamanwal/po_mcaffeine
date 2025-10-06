const adminAllowedFieldsBulkShipment = [
  "poDate",
  "facility",
  "remarksPlanning",
  "specialRemarksCOPT", 
  "statusPlanning", 
  "channelInwardingRemarks", 
  "dispatchDateTentative", 
  "workingDatePlanner", 
  "firstAppointmentDateCOPT", 
  "orderNo1", 
  "orderNo2", 
  "orderNo3", 
  "labelsLink", 
  "invoiceValue", 
  "remarksAccountsTeam", 
  "invoiceChallanNumber",
  "invoiceCheckedBy", 
  "tallyCustomerName", 
  "customerCode", 
  "poEntryCount", 
  "updatedGmv", 
]

const warehouseAllowedFieldsBulkShipment = [
  "statusWarehouse",
  "dispatchRemarksWarehouse",
  "rtsDate",
  "dispatchDate",
  "workingDatePlanner",
  "noOfBoxes",
  "pickListNo",
  "inventoryRemarksWarehouse",
  "b2bWorkingTeamRemarks",
  "actualWeight",
  "volumetricWeight",
  "firstTransporter",
  "firstDocketNo",
  "secondTransporter",
  "secondDocketNo",
  "thirdTransporter",
  "thirdDocketNo",
  "proofOfDispatch",
]

const logisticsAllowedFieldsBulkShipment = [
  "statusLogistics",
  "dispatchRemarksLogistics",
//   "currentAppointmentDate",
//   "allAppointmentDate",
//   "newAppointmentDate",
//   "newAppointmentRemark",
  "deliveryDate",
  "rescheduleLag",
  "finalRemarks",
  "physicalWeight",
//   "tentativeDeliveryDate",
  "deliveryCharges",
  "halting",
  "unloadingCharges",
  "dedicatedVehicle",
  "otherCharges",
  "proofOfDelivery",
  "tat",
  "criticalDispatchDate",
  "rpk",
]

export function isBulkShipmentUpdateAllowed(fields, role) {
  if (!fields || !role) return false;

  if (role === "superadmin") {
    return true;
  }

  if (role === "admin") {
    return fields.every(item => adminAllowedFieldsBulkShipment.includes(item));
  }

  if (role === "warehouse") {
    return fields.every(item => warehouseAllowedFieldsBulkShipment.includes(item));
  }

  if (role === "logistics") {
    return fields.every(item => logisticsAllowedFieldsBulkShipment.includes(item));
  }

  return false;
}