// Master sheet configurations with expected columns and API endpoints

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

export const MASTER_SHEETS_CONFIG = {

    // facility master
    facility: {
        name: "Facility Master",
        expectedColumns:
            [{ label: "Facility", key: "facility" },
            { label: "Pickup Location", key: "pickupLocation" }
            ],
        endpoint: `${baseUrl}/api/v1/master/facility`,
        fileKey: "facilityData",
    },

    // courier partner master
    courierPartner: {
        name: "Courier Partner Master",
        expectedColumns:
            [{ label: "Courier Partner - Mode", key: "courierPartnerMode", type: "string" },
            { label: "Courier Partner", key: "courierPartner", type: "string" },
            { label: "Courier Mode", key: "courierMode", type: "string" },
            { label: "Appointment Charge (Appointment Channel Yes)", key: "appointmentChargeAppointmentChannelYes", type: "number" },
            { label: "Appointment Charge (Appointment Channel No)", key: "appointmentChargeAppointmentChannelNo", type: "number" },
            { label: "Docket Charges", key: "docketCharges", type: "number" },
            { label: "Courier Type", key: "courierType", type: "string" },
            ],
        endpoint: `${baseUrl}/api/v1/master/courier-partner`,
        fileKey: "courierPartnerData",
    },

    // status master
    status: {
        name: "Status Master",
        expectedColumns:
            [{ label: "Status (Planning)", key: "statusPlanning", type: "string" },
            { label: "Status (Warehouse)", key: "statusWarehouse", type: "string" },
            { label: "Status (Logistics)", key: "statusLogistics", type: "string" },
            { label: "Status (Final Status)", key: "statusFinalStatus", type: "string" },
            ],
        endpoint: `${baseUrl}/api/v1/master/status`,
        fileKey: "statusData",
    },

    // courier tat rates
    courierRates: {
        name: "Courier Rates Master",
        expectedColumns:
            [{ label: "Courier Partner", key: "courierPartner", type: "string" },
            { label: "Pickup Location", key: "pickupLocation", type: "string" },
            { label: "Drop Location", key: "dropLocation", type: "string" },
            { label: "Rates Per KG", key: "ratesPerKG", type: "number" },
            { label: "TAT", key: "tat", type: "number" },
            ],
        endpoint: `${baseUrl}/api/v1/master/courier-rates`,
        fileKey: "courierRatesData",
    },

    // channel location master
    channel: {
        name: "Channel Location Master",
        expectedColumns:
            [{ label: "Channel Category", key: "channelCategory", type: "string" },
            { label: "Channel", key: "channel", type: "string" },
            { label: "Channel Location", key: "channelLocation", type: "string" },
            { label: "Drop Location", key: "dropLocation", type: "string" },
            { label: "Appt Channel", key: "apptChannel", type: "string" },
            { label: "Appt Channel Type", key: "apptChannelType", type: "string" },
            ],
        endpoint: `${baseUrl}/api/v1/master/channel`,
        fileKey: "channelData",
    },

    // appointment remark master
    appointmentRemarks: {
        name: "Appointment Remarks Master",
        expectedColumns:
            [{ label: "Appointment Change Remarks", key: "appointmentChangeRemarks", type: "string" },
            { label: "Appointment Change Category", key: "appointmentChangeCategory", type: "string" },
            ],
        endpoint: `${baseUrl}/api/v1/master/appointment-remarks`,
        fileKey: "appointmentRemarksData",
    },

    // sku master
    sku: {
        name: "SKU Master",
        expectedColumns:
            [{ label: "Channel", key: "channel", type: "string" },
            { label: "SKU Code", key: "skuCode", type: "string" },
            { label: "SKU Name", key: "skuName", type: "string" },
            { label: "Channel SKU Code", key: "channelSkuCode", type: "string" },
            { label: "Brand", key: "brand", type: "string" },
            { label: "MRP", key: "mrp", type: "number" },
            ],
        endpoint: `${baseUrl}/api/v1/master/sku`,
        fileKey: "skuData",
    },
}
