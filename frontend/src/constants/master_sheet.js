export const master_facility_option = [
  "HYP_SRGWHT",
  "HYP_SRBGLR",
  "HYP_SRHYD",
  "HYP_SRKOL",
  "mCaff_Ahmedabad",
  "mCaff_Kolkata2",
  "mCaff_Guwahati",
  "mCaff_Hyderabad2",
  "mCaff_Bangalore2",
  "mCaff_Gurgaon2",
  "mCaff_Mumbai2",
  "HYP_SRGGN",
  "HYP_AHMD",
  "HYP_B2B_MUM2",
  "MUM_Warehouse2"
];

export const master_appointment_change_options = [
  {
    remark: "Appointment Miss - Inventory Issue",
    category: "Appointment Miss",
  },
  {
    remark: "Appointment Miss - Logisitc Team",
    category: "Appointment Miss",
  },
  {
    remark: "Appointment Miss - Appointment Not Reschduled",
    category: "Appointment Miss",
  },
  {
    remark: "Appointment Rejected - MRP Issue",
    category: "Appointment Rejected",
  },
  {
    remark: "Appointment shift - Festival/Holiday",
    category: "Appointment Shift",
  },
  {
    remark: "Appointment shift - Cancelled by Channel",
    category: "Appointment Shift",
  },
  {
    remark: "Channel Rejection - Appointment Shift",
    category: "Channel Rejection",
  },
  {
    remark: "Channel Rejection - Address Issue",
    category: "Channel Rejection",
  },
  {
    remark: "Channel Rejection - ASN issue",
    category: "Channel Rejection",
  },
  {
    remark: "Channel Rejection - Barcode issue",
    category: "Channel Rejection",
  },
  {
    remark: "Channel Rejection - Box Mismatch",
    category: "Channel Rejection",
  },
  {
    remark: "Channel Rejection - Capacity Full",
    category: "Channel Rejection",
  },
  {
    remark: "Channel Rejection - Duplicate Order",
    category: "Channel Rejection",
  },
  {
    remark: "Channel Rejection - E Way Bill Issue",
    category: "Channel Rejection",
  },
  {
    remark: "Channel Rejection - EAN Issue",
    category: "Channel Rejection",
  },
  {
    remark: "Channel Rejection - Incorrect PO Raised",
    category: "Channel Rejection",
  },
  {
    remark: "Channel Rejection - Invoice Issue",
    category: "Channel Rejection",
  },
  {
    remark: "Channel Rejection - Invoice Number Mismatch",
    category: "Channel Rejection",
  },
  {
    remark: "Channel Rejection - Local Protest",
    category: "Channel Rejection",
  },
  {
    remark: "Channel Rejection - Natural disasters",
    category: "Channel Rejection",
  },
  {
    remark: "Channel Rejection - No Appointment",
    category: "Channel Rejection",
  },
  {
    remark: "Channel Rejection - Open Box Delivery Issue",
    category: "Channel Rejection",
  },
  {
    remark: "Channel Rejection - Packinglist Issue",
    category: "Channel Rejection",
  },
  {
    remark: "Channel Rejection - Partial Delivery",
    category: "Channel Rejection",
  },
  {
    remark: "Channel Rejection - PL Uplodaing Issue",
    category: "Channel Rejection",
  },
  {
    remark: "Channel Rejection - PO Cancelled",
    category: "Channel Rejection",
  },
  {
    remark: "Channel Rejection - Revised Qty Issue",
    category: "Channel Rejection",
  },
  {
    remark: "Channel Rejection - Server Issue",
    category: "Channel Rejection",
  },
  {
    remark: "Channel Rejection - SKU Issue",
    category: "Channel Rejection",
  },
  {
    remark: "Channel Rejection - SOP Issue",
    category: "Channel Rejection",
  },
  {
    remark: "Channel Rejection - Tech Issue",
    category: "Channel Rejection",
  },
  {
    remark: "Channel Rejection - Warehouse Audit",
    category: "Channel Rejection",
  },
  {
    remark: "Channel Rejection - Warehouse Shifted",
    category: "Channel Rejection",
  },
  {
    remark: "Channel Rejection - Wrong Invoice Created",
    category: "Channel Rejection",
  },
  {
    remark: "Channel Rejection - Wrongly tagged",
    category: "Channel Rejection",
  },
  {
    remark: "Channel Rejection-Space Issue",
    category: "Channel Rejection",
  },
  {
    remark: "Channel Rejection-Wrong PO",
    category: "Channel Rejection",
  },
  {
    remark: "Courier Miss - Appointment Letter Issue",
    category: "Courier Miss",
  },
  {
    remark: "Courier Miss - Late Reporting",
    category: "Courier Miss",
  },
  {
    remark: "Courier Miss - Local Protest",
    category: "Courier Miss",
  },
  {
    remark: "Courier Miss - Location Untraceable",
    category: "Courier Miss",
  },
  {
    remark: "Courier Miss - Logistics Risk",
    category: "Courier Miss",
  },
  {
    remark: "Courier Miss - No Info",
    category: "Courier Miss",
  },
  {
    remark: "Courier Miss - Not attempted",
    category: "Courier Miss",
  },
  {
    remark: "Courier Miss - Pincode Issue",
    category: "Courier Miss",
  },
  {
    remark: "Courier Miss - Risky TAT",
    category: "Courier Miss",
  },
  {
    remark: "Courier Miss - Shipment Misrouted",
    category: "Courier Miss",
  },
  {
    remark: "Courier Miss - Traffic Jam/Road Block",
    category: "Courier Miss",
  },
  {
    remark: "Courier Miss- Taging Issue",
    category: "Courier Miss",
  },
  {
    remark: "Courier Miss - Box Missplaced/Lost",
    category: "Courier Miss",
  },
  {
    remark: "Courier Miss - Breakdown/Vehicle Issue",
    category: "Courier Miss",
  },
  {
    remark: "Courier Miss - Intransit delay",
    category: "Courier Miss",
  },
  {
    remark: "Courier Miss - RAD<>Not attempted",
    category: "Courier Miss",
  },
  {
    remark: "Planning/WH - Not Dispatch",
    category: "Planning/WH Miss",
  },
  {
    remark: "Planning/WH - Working Delay",
    category: "Planning/WH Miss",
  },
  {
    remark: "Shipment Rejected - EAN Issue",
    category: "Shipment Rejected",
  },
  {
    remark: "Shipment Rejected - Inwarding Closed",
    category: "Shipment Rejected",
  }
];

export const master_status_planning_options = [
    "Confirmed", // default
    "Not Confirmed", 
    "Cancelled Shipment - Channel", 
    "Cancelled Shipment - Low Value", 
    "Hold",
]

export const master_status_warehouse_options = [
    "Confirmed", // default
    "Picking",
    "Packed",
    "Label Pending", 
    "RTS",
    "Dispatched",
    "Cancelled Shipment - Low Value", 
    "Cancelled Shipment - Channel", 
    "RTO Received", 
    "Internal Transfer",
]

export const master_status_logistics_options = [
    "Confirmed", // default
    "Dispatched",
    "Partner Pickup", 
    "OFD",
    "Delivered POD Pending", 
    "Delivered",
    "RTO Initiated", 
    "RTO Delivered", 
    "Internal Transfer", 
]

export const master_rto_remark_options = [
    "Cancelled Shipment - Channel",
    "Cancelled Shipment - Expired Shipment",
]

export const master_sku_channel_mapping = [
    {
        sku_code:"",
        channel:"",
        channel_code: "",
    }
]

export const master_rejection_reasons = [
    "Appointment Miss - Inventory Issue",
    "Appointment Miss - Logisitc Team",
    "Appointment Miss - Appointment Not Reschduled",
    "Appointment Rejected - MRP Issue",
    "Appointment shift - Festival/Holiday",
    "Appointment shift - Cancelled by Channel",
    "Channel Rejection - Appointment Shift",
    "Channel Rejection - Address Issue",
    "Channel Rejection - ASN issue",
    "Channel Rejection - Barcode issue",
    "Channel Rejection - Box Mismatch",
    "Channel Rejection - Capacity Full",
    "Channel Rejection - Duplicate Order",
    "Channel Rejection - E Way Bill Issue",
    "Channel Rejection - EAN Issue",
    "Channel Rejection - Incorrect PO Raised",
    "Channel Rejection - Invoice Issue",
    "Channel Rejection - Invoice Number Mismatch",
    "Channel Rejection - Local Protest",
    "Channel Rejection - Natural disasters",
    "Channel Rejection - No Appointment",
    "Channel Rejection - Open Box Delivery Issue",
    "Channel Rejection - Packinglist Issue",
    "Channel Rejection - Partial Delivery",
    "Channel Rejection - PL Uplodaing Issue",
    "Channel Rejection - PO Cancelled",
    "Channel Rejection - Revised Qty Issue",
    "Channel Rejection - Server Issue",
    "Channel Rejection - SKU Issue",
    "Channel Rejection - SOP Issue",
    "Channel Rejection - Tech Issue",
    "Channel Rejection - Warehouse Audit",
    "Channel Rejection - Warehouse Shifted",
    "Channel Rejection - Wrong Invoice Created",
    "Channel Rejection - Wrongly tagged",
    "Channel Rejection-Space Issue",
    "Channel Rejection-Wrong PO",
    "Courier Miss - Appointment Letter Issue",
    "Courier Miss - Late Reporting",
    "Courier Miss - Local Protest",
    "Courier Miss - Location Untraceable",
    "Courier Miss - Logistics Risk",
    "Courier Miss - No Info",
    "Courier Miss - Not attempted",
    "Courier Miss - Pincode Issue",
    "Courier Miss - Risky TAT",
    "Courier Miss - Shipment Misrouted",
    "Courier Miss - Traffic Jam/Road Block",
    "Courier Miss- Taging Issue",
    "Courier Miss - Box Missplaced/Lost",
    "Courier Miss - Breakdown/Vehicle Issue",
    "Courier Miss - Intransit delay",
    "Courier Miss - RAD<>Not attempted",
    "Planning/WH - Not Dispatch",
    "Planning/WH - Working Delay",
    "Shipment Rejected - EAN Issue",
    "Shipment Rejected - Inwarding Closed"
]