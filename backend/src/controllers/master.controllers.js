import FacilityMaster from "../models/facility-master.model.js";
import CourierPartnerMaster from "../models/courier-partner-master.model.js";
import StatusMaster from "../models/status-master.model.js";
import CourierRateMaster from "../models/courier-rate-master.model.js";
import ChannelLocationMaster from "../models/channel-location-master.model.js";
import AppointmentRemarkMaster from "../models/appointment-remark-master.model.js";
import SkuMaster from "../models/sku-master.model.js";

const getModelByType = (type) => {
    switch (type) {
        case 'facility': return FacilityMaster;
        case 'courier-partner': return CourierPartnerMaster;
        case 'status': return StatusMaster;
        case 'courier-rates': return CourierRateMaster;
        case 'channel': return ChannelLocationMaster;
        case 'appointment-remarks': return AppointmentRemarkMaster;
        case 'sku': return SkuMaster;
        default: return null;
    }
};

async function uploadMasterSheet(req, res) {
    try {
        const { type } = req.params;
        const { data } = req.body;

        if (!data || !Array.isArray(data)) {
            return res.status(400).json({ msg: "Invalid data format. Expected an array.", success: false, status: 400 });
        }

        const Model = getModelByType(type);
        if (!Model) {
            return res.status(400).json({ msg: "Invalid master sheet type", success: false, status: 400 });
        }

        // Full replace: Truncate and then Bulk Create
        await Model.destroy({ truncate: true });

        // Filter out duplicate rows from the input data
        const uniqueData = [...new Map(data.map(item => [JSON.stringify(item), item])).values()];

        const createdData = await Model.bulkCreate(uniqueData);

        return res.status(201).json({ msg: "Master sheet uploaded successfully", count: createdData.length, success: true, status: 201 });

    } catch (error) {
        console.error("Error uploading master sheet:", error);
        return res.status(500).json({ msg: "Something went wrong while uploading master sheet", success: false, error: error.message, status: 500 });
    }
}

async function deleteMasterSheet(req, res) {
    try {
        const { type } = req.params;
        const Model = getModelByType(type);

        if (!Model) {
            return res.status(400).json({ msg: "Invalid master sheet type", success: false, status: 400 });
        }

        await Model.destroy({ truncate: true });

        return res.status(200).json({ msg: "Master sheet deleted successfully", success: true, status: 200 });

    } catch (error) {
        console.error("Error deleting master sheet:", error);
        return res.status(500).json({ msg: "Something went wrong while deleting master sheet", success: false, error: error.message, status: 500 });
    }
}

async function getMasterSheet(req, res) {
    try {
        const { type } = req.params;
        const Model = getModelByType(type);

        if (!Model) {
            return res.status(400).json({ msg: "Invalid master sheet type", success: false, status: 400 });
        }

        const data = await Model.findAll();

        return res.status(200).json({ msg: "Data fetched successfully", data, success: true, status: 200 });

    } catch (error) {
        console.error("Error fetching master sheet:", error);
        return res.status(500).json({ msg: "Something went wrong while fetching master sheet", success: false, error: error.message, status: 500 });
    }
}

async function searchMasterSheet(req, res) {
    try {
        const { type } = req.params;
        const query = { ...req.query }; // Create a copy to avoid mutating req.query directly
        let attributes = query.attributes;
        const Model = getModelByType(type);

        if (!Model) {
            return res.status(400).json({ msg: "Invalid master sheet type", success: false, status: 400 });
        }

        // Handle attributes parsing
        if (attributes) {
            if (typeof attributes === 'string') {
                if (attributes.includes(',')) {
                    attributes = attributes.split(',').map(attr => attr.trim());
                } else {
                    attributes = [attributes];
                }
            }
            // If it's already an array, we leave it as is
            delete query.attributes; // Remove attributes from query used for filtering
        }

        // Remove empty query parameters
        Object.keys(query).forEach(key => {
            if (query[key] === '' || query[key] === undefined || query[key] === null) {
                delete query[key];
            }
        });

        console.log("attributes", attributes);
        console.log("query", query);
        console.log("Model: ", Model.name); // Log Model name instead of the whole model object for cleaner logs

        const data = await Model.findAll({ attributes: attributes, where: query });

        return res.status(200).json({ msg: "Data fetched successfully", data, success: true, status: 200 });

    } catch (error) {
        console.error("Error searching master sheet:", error);
        return res.status(500).json({ msg: "Something went wrong while searching master sheet", success: false, error: error.message, status: 500 });
    }
}

// async function selectMasterSheet(req, res) {
//     try {
//         const { type } = req.params;
//         const { attributes } = req.query;
//         const Model = getModelByType(type);

//         if (!Model) {
//             return res.status(400).json({ msg: "Invalid master sheet type", success: false, status: 400 });
//         }

//         const data = await Model.findAll({
//             attributes: attributes
//         })

//         return res.status(200).json({ msg: "Data fetched successfully", data, success: true, status: 200 });

//     } catch (error) {
//         console.error("Error fetching master sheet:", error);
//         return res.status(500).json({ msg: "Something went wrong while fetching master sheet", success: false, error: error.message, status: 500 });
//     }
// }

export const masterControllers = {
    uploadMasterSheet,
    deleteMasterSheet,
    getMasterSheet,
    searchMasterSheet,
    // selectMasterSheet,
};
