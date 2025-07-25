// export const poFormatDataType = [
//   { fieldName: "entryDate", label: "Entry Date", id: "entryDate" },
//   { fieldName: "brand", label: "Brand", id: "brand" },
//   { fieldName: "channel", label: "Channel", id: "channel" },
//   { fieldName: "location", label: "Location", id: "location" },
//   { fieldName: "poDate", label: "PO Date", id: "poDate" },
//   { fieldName: "poNumber", label: "PO Number", id: "poNumber" },
//   { fieldName: "srNo", label: "Sr No", id: "srNo" },
//   { fieldName: "skuName", label: "SKU Name", id: "skuName" },
//   { fieldName: "skuCode", label: "SKU Code", id: "skuCode" },
//   { fieldName: "channelSkuCode", label: "Channel SKU Code", id: "channelSkuCode" },
//   { fieldName: "qty", label: "Quantity", id: "qty" },
//   { fieldName: "gmv", label: "GMV", id: "gmv" },
//   { fieldName: "poValue", label: "PO Value", id: "poValue" },
//   { fieldName: "actualPoNumber", label: "Actual PO Number", id: "actualPoNumber" },
//   { fieldName: "updatedQty", label: "Updated Quantity", id: "updatedQty" },
//   { fieldName: "updatedGmv", label: "Updated GMV", id: "updatedGmv" },
//   { fieldName: "updatedPoValue", label: "Updated PO Value", id: "updatedPoValue" },
//   { fieldName: "facility", label: "Facility", id: "facility" },
//   { fieldName: "accountsWorking", label: "Accounts Working", id: "accountsWorking" },
//   { fieldName: "channelInwardingQuantity", label: "Channel Inwarding Quantity", id: "channelInwardingQuantity" },
//   { fieldName: "workingDate", label: "Working Date", id: "workingDate" },
//   { fieldName: "dispatchDate", label: "Dispatch Date", id: "dispatchDate" },
//   { fieldName: "currentAppointmentDate", label: "Current Appointment Date", id: "currentAppointmentDate" },
//   { fieldName: "statusPlanning", label: "Status Planning", id: "statusPlanning" },
//   { fieldName: "statusWarehouse", label: "Status Warehouse", id: "statusWarehouse" },
//   { fieldName: "statusLogistics", label: "Status Logistics", id: "statusLogistics" },
//   { fieldName: "orderNo", label: "Order No", id: "orderNo" },
//   { fieldName: "poNumberInward", label: "PO Number Inward", id: "poNumberInward" },
// //   { fieldName: "invoiceLink", label: "Invoice Link", id: "invoiceLink" },
// //   { fieldName: "cnLink", label: "CN Link", id: "cnLink" },
//   { fieldName: "maxPoEntryCount", label: "Max PO Entry Count", id: "maxPoEntryCount" },
//   { fieldName: "poCheck", label: "PO Check", id: "poCheck" },
//   { fieldName: "temp", label: "Temp", id: "temp" },
//   { fieldName: "inwardPos", label: "Inward POS", id: "inwardPos" },
//   { fieldName: "sku", label: "SKU", id: "sku" },
//   { fieldName: "uidDb", label: "UID DB", id: "uidDb" },
//   { fieldName: "channelType", label: "Channel Type", id: "channelType" },
//   { fieldName: "actualWeight", label: "Actual Weight", id: "actualWeight" },
//   { fieldName: "check", label: "Check", id: "check" }
// ];

export const poFormatDataType = [
  { fieldName: "entryDate", label: "Entry Date", id: "entryDate", type: "date" },
  { fieldName: "brandName", label: "Brand", id: "brandName", type: "select", options: ["MCaffeine", "Other Brand"] },
  {
    fieldName: "channel",
    label: "Channel",
    id: "channel",
    type: "select",
    options: ["Zepto", "Amazon", "Flipkart", "Nykaa", "BigBasket", "Swiggy Instamart", "Blinkit"],
  },
  {
    fieldName: "location",
    label: "Location",
    id: "location",
    type: "select",
    options: ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune"],
  },
  { fieldName: "poDate", label: "PO Date", id: "poDate", type: "date" },
  { fieldName: "poNumber", label: "PO Number", id: "poNumber", type: "text" },
  { fieldName: "srNo", label: "Sr No", id: "srNo", type: "number" },
  { fieldName: "skuName", label: "SKU Name", id: "skuName", type: "text" },
  { fieldName: "skuCode", label: "SKU Code", id: "skuCode", type: "text" },
  { fieldName: "channelSkuCode", label: "Channel SKU Code", id: "channelSkuCode", type: "text" },
  { fieldName: "qty", label: "Quantity", id: "qty", type: "number" },
  { fieldName: "gmv", label: "GMV", id: "gmv", type: "number" },
  { fieldName: "poValue", label: "PO Value", id: "poValue", type: "number" },
  { fieldName: "actualPoNumber", label: "Actual PO Number", id: "actualPoNumber", type: "text" },
  { fieldName: "updatedQty", label: "Updated Quantity", id: "updatedQty", type: "number" },
  { fieldName: "updatedGmv", label: "Updated GMV", id: "updatedGmv", type: "text" },
  { fieldName: "updatedPoValue", label: "Updated PO Value", id: "updatedPoValue", type: "text" },
  {
    fieldName: "facility",
    label: "Facility",
    id: "facility",
    type: "select",
    options: ["MUM_WAREHOUSE1", "MUM_WAREHOUSE2", "DEL_WAREHOUSE1", "BLR_WAREHOUSE1"],
  },
  { fieldName: "accountsWorking", label: "Accounts Working", id: "accountsWorking", type: "number" },
  {
    fieldName: "channelInwardingQuantity",
    label: "Channel Inwarding Quantity",
    id: "channelInwardingQuantity",
    type: "text",
  },
  { fieldName: "workingDate", label: "Working Date", id: "workingDate", type: "date" },
  { fieldName: "dispatchDate", label: "Dispatch Date", id: "dispatchDate", type: "date" },
  {
    fieldName: "currentAppointmentDate",
    label: "Current Appointment Date",
    id: "currentAppointmentDate",
    type: "date",
  },
  {
    fieldName: "statusPlanning",
    label: "Status Planning",
    id: "statusPlanning",
    type: "select",
    options: ["Confirmed", "Pending", "Cancelled", "In Progress"],
  },
  {
    fieldName: "statusWarehouse",
    label: "Status Warehouse",
    id: "statusWarehouse",
    type: "select",
    options: ["Ready", "Processing", "Dispatched", ""],
  },
  {
    fieldName: "statusLogistics",
    label: "Status Logistics",
    id: "statusLogistics",
    type: "select",
    options: ["0", "1", "2", "3"],
  },
  { fieldName: "orderNo", label: "Order No", id: "orderNo", type: "text" },
  { fieldName: "poNumberInward", label: "PO Number Inward", id: "poNumberInward", type: "text" },
  { fieldName: "maxPoEntryCount", label: "Max PO Entry Count", id: "maxPoEntryCount", type: "number" },
  { fieldName: "poCheck", label: "PO Check", id: "poCheck", type: "text" },
  {
    fieldName: "temp",
    label: "Temp",
    id: "temp",
    type: "select",
    options: ["Ignore", "Missing", "Active", "Inactive"],
  },
  { fieldName: "inwardPos", label: "Inward POS", id: "inwardPos", type: "text" },
  { fieldName: "sku", label: "SKU", id: "sku", type: "text" },
  { fieldName: "uidDb", label: "UID DB", id: "uidDb", type: "text" },
  {
    fieldName: "channelType",
    label: "Channel Type",
    id: "channelType",
    type: "select",
    options: ["Quick-commerce", "E-commerce", "Marketplace", "Retail"],
  },
  { fieldName: "actualWeight", label: "Actual Weight", id: "actualWeight", type: "number" },
  { fieldName: "check", label: "Check", id: "check", type: "text" },
];


export const shipmentStatusDataType = [
  { fieldName: "uid", label: "UID", id: "uid", type: "text" },
  { fieldName: "entryDate", label: "Entry Date", id: "entryDate", type: "date" },
  { fieldName: "poDate", label: "PO Date", id: "poDate", type: "date" },
  {
    fieldName: "facility",
    label: "Facility",
    id: "facility",
    type: "select",
    options: ["MUM_WAREHOUSE1", "MUM_WAREHOUSE2", "DEL_WAREHOUSE1", "BLR_WAREHOUSE1"],
  },
  {
    fieldName: "channel",
    label: "Channel",
    id: "channel",
    type: "select",
    options: ["Zepto", "Amazon", "Flipkart", "Nykaa", "BigBasket", "Swiggy Instamart", "Blinkit"],
  },
  {
    fieldName: "location",
    label: "Location",
    id: "location",
    type: "select",
    options: ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune"],
  },
  { fieldName: "poNumber", label: "PO Number", id: "poNumber", type: "text" },
  { fieldName: "totalUnits", label: "Total Units", id: "totalUnits", type: "number" },
  { fieldName: "brandName", label: "Brand Name", id: "brandName", type: "text" },
  { fieldName: "remarksPlanning", label: "Remarks (Planning)", id: "remarksPlanning", type: "text" },
  { fieldName: "specialRemarksCOPT", label: "Special Remarks (COPT)", id: "specialRemarksCOPT", type: "text" },
  { fieldName: "newShipmentReference", label: "New Shipment Reference", id: "newShipmentReference", type: "text" },
  {
    fieldName: "statusActive",
    label: "Status (Active/Inactive)",
    id: "statusActive",
    type: "select",
    options: ["Active", "Inactive"],
  },
  {
    fieldName: "statusPlanning",
    label: "Status (Planning)",
    id: "statusPlanning",
    type: "select",
    options: ["Confirmed", "Pending", "Cancelled", "In Progress"],
  },
  {
    fieldName: "statusWarehouse",
    label: "Status (Warehouse)",
    id: "statusWarehouse",
    type: "select",
    options: ["Ready", "Processing", "Dispatched", ""],
  },
  {
    fieldName: "statusLogistics",
    label: "Status (Logistics)",
    id: "statusLogistics",
    type: "select",
    options: ["0", "1", "2", "3"],
  },
  { fieldName: "channelInwardingRemarks", label: "Channel Inwarding Remarks", id: "channelInwardingRemarks", type: "text" },
  { fieldName: "dispatchRemarksLogistics", label: "Dispatch Remarks (Logistics)", id: "dispatchRemarksLogistics", type: "text" },
  { fieldName: "dispatchRemarksWarehouse", label: "Dispatch Remarks (Warehouse)", id: "dispatchRemarksWarehouse", type: "text" },
  { fieldName: "dispatchDateTentative", label: "Dispatch Date - Tentative (Planning)", id: "dispatchDateTentative", type: "date" },
  { fieldName: "workingDatePlanner", label: "Working Date (Planner)", id: "workingDatePlanner", type: "date" },
  { fieldName: "rtsDate", label: "RTS Date", id: "rtsDate", type: "date" },
  { fieldName: "dispatchDate", label: "Dispatch Date", id: "dispatchDate", type: "date" },
  { fieldName: "currentAppointmentDate", label: "Current Appointment Date", id: "currentAppointmentDate", type: "date" },
  { fieldName: "firstAppointmentDateCOPT", label: "First Appointment Date (COPT)", id: "firstAppointmentDateCOPT", type: "date" },
  { fieldName: "noOfBoxes", label: "No of Boxes", id: "noOfBoxes", type: "number" },
  { fieldName: "orderNo1", label: "Order No 1", id: "orderNo1", type: "text" },
  { fieldName: "orderNo2", label: "Order No 2", id: "orderNo2", type: "text" },
  { fieldName: "orderNo3", label: "Order No 3", id: "orderNo3", type: "text" },
  { fieldName: "poNumberInwardCWH", label: "PO Number (Inward - CWH)", id: "poNumberInwardCWH", type: "text" },
  { fieldName: "pickListNo", label: "Pick List No", id: "pickListNo", type: "text" },
  { fieldName: "workingTypeWarehouse", label: "Working Type (Warehouse)", id: "workingTypeWarehouse", type: "text" },
  { fieldName: "inventoryRemarksWarehouse", label: "Inventory Remarks (Warehouse)", id: "inventoryRemarksWarehouse", type: "text" },
  { fieldName: "b2bWorkingTeamRemarks", label: "B2B Working Team Remarks", id: "b2bWorkingTeamRemarks", type: "text" },
  { fieldName: "actualWeight", label: "Actual Weight", id: "actualWeight", type: "number" },
  { fieldName: "volumetricWeight", label: "Volumetric Weight", id: "volumetricWeight", type: "number" },
  {
    fieldName: "channelType",
    label: "Channel Type",
    id: "channelType",
    type: "select",
    options: ["Quick-commerce", "E-commerce", "Marketplace", "Retail"],
  },
  { fieldName: "firstTransporter", label: "1st Transporter (First Mile)", id: "firstTransporter", type: "text" },
  { fieldName: "firstDocketNo", label: "1st Docket No/ Vehicle Number (First Mile)", id: "firstDocketNo", type: "text" },
  { fieldName: "secondTransporter", label: "2nd Transporter (Mid Mile)", id: "secondTransporter", type: "text" },
  { fieldName: "secondDocketNo", label: "2nd Docket No/ Vehicle Number (Mid Mile)", id: "secondDocketNo", type: "text" },
  { fieldName: "thirdTransporter", label: "3rd Transporter (Last Mile)", id: "thirdTransporter", type: "text" },
  { fieldName: "thirdDocketNo", label: "3rd Docket No/ Vehicle Number (Last Mile)", id: "thirdDocketNo", type: "text" },
  { fieldName: "appointmentLetter", label: "Appointment Letter/STN", id: "appointmentLetter", type: "text" },
  { fieldName: "labelsLink", label: "Labels - Amazon/Flipkart (Link)", id: "labelsLink", type: "text" },
  { fieldName: "invoiceDate", label: "Invoice Date", id: "invoiceDate", type: "date" },
  { fieldName: "invoiceLink", label: "Invoice Link", id: "invoiceLink", type: "text" },
  { fieldName: "cnLink", label: "CN Link", id: "cnLink", type: "text" },
  { fieldName: "ewayLink", label: "E-Way Link", id: "ewayLink", type: "text" },
  { fieldName: "invoiceValue", label: "Invoice Value (Check with Invoice Link)", id: "invoiceValue", type: "number" },
  { fieldName: "remarksAccountsTeam", label: "Remarks by Accounts Team", id: "remarksAccountsTeam", type: "text" },
  { fieldName: "invoiceChallanNumber", label: "Invoice / Challan Number", id: "invoiceChallanNumber", type: "text" },
  { fieldName: "invoiceCheckedBy", label: "Invoice Checked By", id: "invoiceCheckedBy", type: "text" },
  { fieldName: "tallyCustomerName", label: "Tally Customer Name", id: "tallyCustomerName", type: "text" },
  { fieldName: "customerCode", label: "Customer Code", id: "customerCode", type: "text" },
  { fieldName: "poEntryCount", label: "PO Entry Count", id: "poEntryCount", type: "number" },
  { fieldName: "deliveryDate", label: "Delivery Date", id: "deliveryDate", type: "date" },
  { fieldName: "rescheduleLag", label: "Reschedule Lag (Remarks)", id: "rescheduleLag", type: "number" },
  { fieldName: "finalRemarks", label: "Final Remarks", id: "finalRemarks", type: "text" },
  { fieldName: "updatedGmv", label: "Updated GMV", id: "updatedGmv", type: "number" },
  { fieldName: "physicalWeight", label: "Physical Weight", id: "physicalWeight", type: "number" },
  // Add more fields as needed
];