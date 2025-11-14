// Master sheet configurations with expected columns and API endpoints

export const MASTER_SHEETS_CONFIG = {

    // facility master
    facility: {
        name: "Facility Master",
        expectedColumns: ["Facility", "Pickup Location"],
        endpoint: "/api/master/facility",
        fileKey: "facilityData",
    },

    // courier partner master
    courierPartner: {
        name: "Courier Partner Master",
        expectedColumns: [
            "Courier Partner - Mode",
            "Courier Partner",
            "Courier Mode",
            "Appointment Charge (Appointment Channel Yes)",
            "Appointment Charge (Appointment Channel No)",
            "Docket Charges",
            "Courier Type",
        ],
        endpoint: "/api/master/courier-partner",
        fileKey: "courierPartnerData",
    },

    // status master
    status: {
        name: "Status Master",
        expectedColumns: ["Status (Planning)", "Status (Warehouse)", "Status (Logistics)", "Status (Final Status)"],
        endpoint: "/api/master/status",
        fileKey: "statusData",
    },

    // courier tat rates
    courierRates: {
        name: "Courier Rates Master",
        expectedColumns: ["Courier Partner", "Pickup Location", "Drop Location", "Rates Per KG", "TAT"],
        endpoint: "/api/master/courier-rates",
        fileKey: "courierRatesData",
    },

    // channel location master
    channel: {
        name: "Channel Location Master",
        expectedColumns: [
            "Channel Category",
            "Channel",
            "Channel Location",
            "Drop Location",
            "Appt Channel",
            "Appt Channel Type",
        ],
        endpoint: "/api/master/channel",
        fileKey: "channelData",
    },

    // appointment remark master
    appointmentRemarks: {
        name: "Appointment Remarks Master",
        expectedColumns: ["Appointment Change Remarks", "Appointment Change Category"],
        endpoint: "/api/master/appointment-remarks",
        fileKey: "appointmentRemarksData",
    },

    // sku master
    sku: {
        name: "SKU Master",
        expectedColumns: ["Channel", "SKU Code", "SKU Name", "Channel SKU Code", "Brand", "MRP"],
        endpoint: "/api/master/sku",
        fileKey: "skuData",
    },
}
