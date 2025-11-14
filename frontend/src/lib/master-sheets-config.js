// Master sheet configurations with expected columns and API endpoints

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

export const MASTER_SHEETS_CONFIG = {

    // facility master
    facility: {
        name: "Facility Master",
        expectedColumns: ["Facility", "Pickup Location"],
        endpoint: `${baseUrl}/api/v1/master/facility`,
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
        endpoint: `${baseUrl}/api/v1/master/courier-partner`,
        fileKey: "courierPartnerData",
    },

    // status master
    status: {
        name: "Status Master",
        expectedColumns: ["Status (Planning)", "Status (Warehouse)", "Status (Logistics)", "Status (Final Status)"],
        endpoint: `${baseUrl}/api/v1/master/status`,
        fileKey: "statusData",
    },

    // courier tat rates
    courierRates: {
        name: "Courier Rates Master",
        expectedColumns: ["Courier Partner", "Pickup Location", "Drop Location", "Rates Per KG", "TAT"],
        endpoint: `${baseUrl}/api/v1/master/courier-rates`,
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
        endpoint: `${baseUrl}/api/v1/master/channel`,
        fileKey: "channelData",
    },

    // appointment remark master
    appointmentRemarks: {
        name: "Appointment Remarks Master",
        expectedColumns: ["Appointment Change Remarks", "Appointment Change Category"],
        endpoint: `${baseUrl}/api/v1/master/appointment-remarks`,
        fileKey: "appointmentRemarksData",
    },

    // sku master
    sku: {
        name: "SKU Master",
        expectedColumns: ["Channel", "SKU Code", "SKU Name", "Channel SKU Code", "Brand", "MRP"],
        endpoint: `${baseUrl}/api/v1/master/sku`,
        fileKey: "skuData",
    },
}
