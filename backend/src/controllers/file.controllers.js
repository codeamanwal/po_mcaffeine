import { generateS3UploadUrl, uploadCsvDataToS3 } from "../utils/s3.js"
import SkuOrder from "../models/sku-order.model.js";
import ShipmentOrder from "../models/shipment-order.model.js";
import { Op } from "sequelize";
import { poFormatDataType, shipmentFormatDataType } from "../utils/constant.js";

export async function getS3UploadUrl(req, res) {
    try {
        const query = req.query
        const fileName = query.fileName
        const fileType = query.fileType
        const uploadUri = await generateS3UploadUrl(fileName, fileType);
        return res.status(200).json({ msg: "Fetched the s3-upload-url", uploadUrl: uploadUri });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: "Could not generate file upload url!", error })
    }
}

export async function downloadSkuDataWithFiltersInCsvFile(req, res) {
    try {
        const currRole = req.user?.role;
        const query = req?.query;
        const shipmentOrderId = query?.shipmentOrderId || null;

        // filters
        const filters = req.body.filters;

        let replacements = [];
        let whereClauses = [];

        // --- Build WHERE Clauses ---

        // 1. SKU Code
        if (filters?.skuCode && filters.skuCode !== "") {
            whereClauses.push("so.skuCode LIKE ?");
            replacements.push(`%${filters.skuCode}%`);
        }

        // 2. Brand
        if (filters?.brand && filters.brand.length > 0) {
            const hasNotAssigned = filters.brand.includes("Not Assigned");
            const brandValues = filters.brand.filter(val => val !== "Not Assigned");

            if (hasNotAssigned) {
                if (brandValues.length > 0) {
                    whereClauses.push("(so.brandName IN (?) OR so.brandName IS NULL OR so.brandName = '')");
                    replacements.push(brandValues);
                } else {
                    whereClauses.push("(so.brandName IS NULL OR so.brandName = '')");
                }
            } else {
                whereClauses.push("so.brandName IN (?)");
                replacements.push(brandValues);
            }
        }

        // 3. Channel
        if (filters?.channel && filters.channel.length > 0) {
            const hasNotAssigned = filters.channel.includes("Not Assigned");
            const channelValues = filters.channel.filter(val => val !== "Not Assigned");

            if (hasNotAssigned) {
                if (channelValues.length > 0) {
                    whereClauses.push("(sho.channel IN (?) OR sho.channel IS NULL OR sho.channel = '')");
                    replacements.push(channelValues);
                } else {
                    whereClauses.push("(sho.channel IS NULL OR sho.channel = '')");
                }
            } else {
                whereClauses.push("sho.channel IN (?)");
                replacements.push(channelValues);
            }
        }

        // 4. Facility
        if (filters?.facility && filters.facility.length > 0) {
            const hasNotAssigned = filters.facility.includes("Not Assigned");
            const facilityValues = filters.facility.filter(val => val !== "Not Assigned");

            if (hasNotAssigned) {
                if (facilityValues.length > 0) {
                    whereClauses.push("(sho.facility IN (?) OR sho.facility IS NULL OR sho.facility = '')");
                    replacements.push(facilityValues);
                } else {
                    whereClauses.push("(sho.facility IS NULL OR sho.facility = '')");
                }
            } else {
                whereClauses.push("sho.facility IN (?)");
                replacements.push(facilityValues);
            }
        }

        // 5. Location
        if (filters?.location && filters.location.length > 0) {
            const hasNotAssigned = filters.location.includes("Not Assigned");
            const locationValues = filters.location.filter(val => val !== "Not Assigned");

            if (hasNotAssigned) {
                if (locationValues.length > 0) {
                    whereClauses.push("(sho.location IN (?) OR sho.location IS NULL OR sho.location = '')");
                    replacements.push(locationValues);
                } else {
                    whereClauses.push("(sho.location IS NULL OR sho.location = '')");
                }
            } else {
                whereClauses.push("sho.location IN (?)");
                replacements.push(locationValues);
            }
        }

        // 6. Status Planning
        if (filters?.statusPlanning && filters.statusPlanning.length > 0) {
            const hasNotAssigned = filters.statusPlanning.includes("Not Assigned");
            const values = filters.statusPlanning.filter(val => val !== "Not Assigned");

            if (hasNotAssigned) {
                if (values.length > 0) {
                    whereClauses.push("(sho.statusPlanning IN (?) OR sho.statusPlanning IS NULL OR sho.statusPlanning = '')");
                    replacements.push(values);
                } else {
                    whereClauses.push("(sho.statusPlanning IS NULL OR sho.statusPlanning = '')");
                }
            } else {
                whereClauses.push("sho.statusPlanning IN (?)");
                replacements.push(values);
            }
        }

        // 7. Status Warehouse
        if (filters?.statusWarehouse && filters.statusWarehouse.length > 0) {
            const hasNotAssigned = filters.statusWarehouse.includes("Not Assigned");
            const values = filters.statusWarehouse.filter(val => val !== "Not Assigned");
            if (hasNotAssigned) {
                if (values.length > 0) {
                    whereClauses.push("(sho.statusWarehouse IN (?) OR sho.statusWarehouse IS NULL OR sho.statusWarehouse = '')");
                    replacements.push(values);
                } else {
                    whereClauses.push("(sho.statusWarehouse IS NULL OR sho.statusWarehouse = '')");
                }
            } else {
                whereClauses.push("sho.statusWarehouse IN (?)");
                replacements.push(values);
            }
        }

        // 8. Status Logistics
        if (filters?.statusLogistics && filters.statusLogistics.length > 0) {
            const hasNotAssigned = filters.statusLogistics.includes("Not Assigned");
            const values = filters.statusLogistics.filter(val => val !== "Not Assigned");
            if (hasNotAssigned) {
                if (values.length > 0) {
                    whereClauses.push("(sho.statusLogistics IN (?) OR sho.statusLogistics IS NULL OR sho.statusLogistics = '')");
                    replacements.push(values);
                } else {
                    whereClauses.push("(sho.statusLogistics IS NULL OR sho.statusLogistics = '')");
                }
            } else {
                whereClauses.push("sho.statusLogistics IN (?)");
                replacements.push(values);
            }
        }

        // 9. PO Date
        if (filters?.poDateFrom) {
            whereClauses.push("sho.poDate >= ?");
            replacements.push(filters.poDateFrom);
        }
        if (filters?.poDateTo) {
            whereClauses.push("sho.poDate <= ?");
            replacements.push(filters.poDateTo);
        }

        // 10. Working Date
        if (filters?.workingDateFrom) {
            whereClauses.push("sho.workingDatePlanner >= ?");
            replacements.push(filters.workingDateFrom);
        }
        if (filters?.workingDateTo) {
            whereClauses.push("sho.workingDatePlanner <= ?");
            replacements.push(filters.workingDateTo);
        }

        // 11. Search (PO Number or UID)
        if (filters?.search && filters.search !== "") {
            whereClauses.push("(sho.poNumber LIKE ? OR sho.uid LIKE ?)");
            replacements.push(`%${filters.search}%`);
            replacements.push(`%${filters.search}%`);
        }

        // 12. Shipment Order ID
        if (shipmentOrderId) {
            whereClauses.push("so.shipmentOrderId = ?");
            replacements.push(shipmentOrderId);
        }

        // 13. Role-based Restrictions (Allotted Facilities)
        if (currRole !== "superadmin" && currRole !== "admin") {
            const allotedFacilities = req.user?.allotedFacilities;

            if (!allotedFacilities || allotedFacilities.length === 0) {
                // Return empty file loop early logic
                // Since we need to return a file, if NO access, return empty file (headers only).
                // We can achieve this by adding a false condition 1=0
                whereClauses.push("1 = 0");
            } else {
                // Check if user filtered by facility provided in filters, intersect with alloted
                let finalFacilities = allotedFacilities;
                if (filters?.facility && filters.facility.length > 0) {
                    // Extract clean filter values (ignoring Not Assigned for intersection check base)
                    const reqFacilities = filters.facility.filter(f => f !== "Not Assigned");

                    // If the user request specifically asks for facilities, we must ensure they obey allotments
                    // However, we already built the facility WHERE clause above based on request.
                    // We need to AND it with allotments.
                    // Actually, simpler logic: Always append AND facility IN (allotted)
                    // But if the user request 'Not Assigned', that would conflict if 'Not Assigned' is not a facility.
                    // Typically 'allotedFacilities' are actual facility names.

                    // Correct implementation:
                    // The query must restrict results to allotedFacilities.
                    // So we append: AND sho.facility IN (allotedFacilities)
                    whereClauses.push("sho.facility IN (?)");
                    replacements.push(allotedFacilities);
                } else {
                    // No facility filter from user, but we must restrict
                    whereClauses.push("sho.facility IN (?)");
                    replacements.push(allotedFacilities);
                }
            }
        }

        // --- Construct Final Query ---
        const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')} ` : '';

        const finalQuery = `
SELECT
so.shipmentOrderId,
    sho.entryDate,
    sho.poDate,
    sho.facility,
    sho.channel,
    sho.location,
    so.poNumber,
    so.brandName,
    so.srNo,
    so.skuName,
    so.skuCode,
    so.channelSkuCode,
    so.qty,
    so.gmv,
    so.poValue,
    so.updatedQty,
    so.updatedGmv,
    so.updatedPoValue,
    so.actualWeight AS productWeight,
        sho.workingDatePlanner AS workingDate,
            sho.dispatchDate,
            sho.currentAppointmentDate,
            sho.statusPlanning,
            sho.statusWarehouse,
            sho.statusLogistics
            FROM sku_orders so
            LEFT JOIN shipment_orders sho ON so.shipmentOrderId = sho.uid
            ${whereSql}
            ORDER BY
so.shipmentOrderId DESC,
    CASE
                    WHEN so.srNo REGEXP '^[0-9]+$' THEN CAST(so.srNo AS UNSIGNED)
                    ELSE NULL
                END ASC
    `;

        // --- Upload to S3 ---
        const signedUrl = await uploadCsvDataToS3(finalQuery, poFormatDataType, replacements);

        return res.status(200).json({
            msg: "File generated successfully",
            downloadUrl: signedUrl
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: "Could not generate file download url!", error: error })
    }
}

export async function downloadShipmentDataWithFiltersInCsvFile(req, res) {
    try {
        const currUser = req.user;
        const query = req.query;
        const filters = req.body.filters;

        // --- Construct Final Query ---

        // Sum total units subquery
        const totalUnitsQuery = `(SELECT SUM(COALESCE(sub_so.updatedQty, sub_so.qty, 0)) FROM sku_orders sub_so WHERE sub_so.shipmentOrderId = sho.uid)`;

        // For role-based access, we need to ensure the query respects allotment
        // The above sequelize 'findAndCountAll' does this via WHERE clauses.
        // We need to use 'replacements' for raw SQL.

        // Re-construct WHERE clauses for RAW SQL
        let rawWhereClauses = [];
        let rawReplacements = [];

        // Note: The previous logic built 'filters' into 'shipmentWhere' and 'skuWhere'.
        // Converting this Complex Sequelize Logic to Raw SQL is tricky because of the JOINs and 'distinct' behavior.
        // BUT, since we are downloading SHIPMENT data, we are selecting from shipment_orders.
        // If we filter by BRAND (which is on SKU), we must join SKU.
        // If we join SKU, we get multiple rows per shipment.
        // To get one row per shipment, we must GROUP BY shipment_order.uid or use DISTINCT.
        // However, we can't select specific columns easily if we group, unless we aggregate everything.
        // A better approach for Filtered Shipment Download might be:
        // 1. Build the exact same query as 'findAndCountAll' up to the filtering.
        // 2. But perform it in raw SQL.

        // Let's iterate over filters again and build RAW SQL conditions for 'shipment_orders' alias 'sho'.

        // Brand Filter (requires EXISTS or JOIN)
        if (filters?.brand && filters.brand.length > 0) {
            const hasNotAssigned = filters.brand.includes("Not Assigned");
            const brandValues = filters.brand.filter(val => val !== "Not Assigned");

            let brandCondition = "";
            if (hasNotAssigned) {
                if (brandValues.length > 0) {
                    brandCondition = `(so.brandName IN (?) OR so.brandName IS NULL OR so.brandName = '')`;
                    rawReplacements.push(brandValues);
                } else {
                    brandCondition = `(so.brandName IS NULL OR so.brandName = '')`;
                }
            } else {
                brandCondition = `so.brandName IN (?)`;
                rawReplacements.push(brandValues);
            }

            // We use EXISTS to filter shipments that have AT LEAST ONE sku with this brand
            rawWhereClauses.push(`EXISTS (SELECT 1 FROM sku_orders so WHERE so.shipmentOrderId = sho.uid AND ${brandCondition})`);
        }

        // Channel
        if (filters?.channel && filters.channel.length > 0) {
            const hasNotAssigned = filters.channel.includes("Not Assigned");
            const values = filters.channel.filter(val => val !== "Not Assigned");
            if (hasNotAssigned) {
                if (values.length > 0) {
                    rawWhereClauses.push("(sho.channel IN (?) OR sho.channel IS NULL OR sho.channel = '')");
                    rawReplacements.push(values);
                } else {
                    rawWhereClauses.push("(sho.channel IS NULL OR sho.channel = '')");
                }
            } else {
                rawWhereClauses.push("sho.channel IN (?)");
                rawReplacements.push(values);
            }
        }

        // Facility
        if (filters?.facility && filters.facility.length > 0) {
            const hasNotAssigned = filters.facility.includes("Not Assigned");
            const values = filters.facility.filter(val => val !== "Not Assigned");
            if (hasNotAssigned) {
                if (values.length > 0) {
                    rawWhereClauses.push("(sho.facility IN (?) OR sho.facility IS NULL OR sho.facility = '')");
                    rawReplacements.push(values);
                } else {
                    rawWhereClauses.push("(sho.facility IS NULL OR sho.facility = '')");
                }
            } else {
                rawWhereClauses.push("sho.facility IN (?)");
                rawReplacements.push(values);
            }
        }

        // Location
        if (filters?.location && filters.location.length > 0) {
            const hasNotAssigned = filters.location.includes("Not Assigned");
            const values = filters.location.filter(val => val !== "Not Assigned");
            if (hasNotAssigned) {
                if (values.length > 0) {
                    rawWhereClauses.push("(sho.location IN (?) OR sho.location IS NULL OR sho.location = '')");
                    rawReplacements.push(values);
                } else {
                    rawWhereClauses.push("(sho.location IS NULL OR sho.location = '')");
                }
            } else {
                rawWhereClauses.push("sho.location IN (?)");
                rawReplacements.push(values);
            }
        }

        // Status Planning
        if (filters?.statusPlanning && filters.statusPlanning.length > 0) {
            const hasNotAssigned = filters.statusPlanning.includes("Not Assigned");
            const values = filters.statusPlanning.filter(val => val !== "Not Assigned");
            if (hasNotAssigned) {
                if (values.length > 0) {
                    rawWhereClauses.push("(sho.statusPlanning IN (?) OR sho.statusPlanning IS NULL OR sho.statusPlanning = '')");
                    rawReplacements.push(values);
                } else {
                    rawWhereClauses.push("(sho.statusPlanning IS NULL OR sho.statusPlanning = '')");
                }
            } else {
                rawWhereClauses.push("sho.statusPlanning IN (?)");
                rawReplacements.push(values);
            }
        }

        // Status Warehouse
        if (filters?.statusWarehouse && filters.statusWarehouse.length > 0) {
            const hasNotAssigned = filters.statusWarehouse.includes("Not Assigned");
            const values = filters.statusWarehouse.filter(val => val !== "Not Assigned");
            if (hasNotAssigned) {
                if (values.length > 0) {
                    rawWhereClauses.push("(sho.statusWarehouse IN (?) OR sho.statusWarehouse IS NULL OR sho.statusWarehouse = '')");
                    rawReplacements.push(values);
                } else {
                    rawWhereClauses.push("(sho.statusWarehouse IS NULL OR sho.statusWarehouse = '')");
                }
            } else {
                rawWhereClauses.push("sho.statusWarehouse IN (?)");
                rawReplacements.push(values);
            }
        }

        // Status Logistics
        if (filters?.statusLogistics && filters.statusLogistics.length > 0) {
            const hasNotAssigned = filters.statusLogistics.includes("Not Assigned");
            const values = filters.statusLogistics.filter(val => val !== "Not Assigned");
            if (hasNotAssigned) {
                if (values.length > 0) {
                    rawWhereClauses.push("(sho.statusLogistics IN (?) OR sho.statusLogistics IS NULL OR sho.statusLogistics = '')");
                    rawReplacements.push(values);
                } else {
                    rawWhereClauses.push("(sho.statusLogistics IS NULL OR sho.statusLogistics = '')");
                }
            } else {
                rawWhereClauses.push("sho.statusLogistics IN (?)");
                rawReplacements.push(values);
            }
        }

        // Transporter
        if (filters?.transporter && filters.transporter.length > 0) {
            const hasNotAssigned = filters.transporter.includes("Not Assigned");
            const values = filters.transporter.filter(val => val !== "Not Assigned");

            if (hasNotAssigned) {
                // OR condition for nulls
                const nullCond = "(sho.firstTransporter IN (?) OR sho.firstTransporter IS NULL OR sho.firstTransporter = '' " +
                    "OR sho.secondTransporter IN (?) OR sho.secondTransporter IS NULL OR sho.secondTransporter = '' " +
                    "OR sho.thirdTransporter IN (?) OR sho.thirdTransporter IS NULL OR sho.thirdTransporter = '')";
                rawWhereClauses.push(nullCond);
                rawReplacements.push(values);
                rawReplacements.push(values);
                rawReplacements.push(values);
            } else {
                // Must be in one of them?
                // The original sequelize logic was:
                // shipmentWhere[Op.or] = [ { firstTransporter: { [Op.in]: filters.transporter } }, ... ]

                const orCond = "(sho.firstTransporter IN (?) OR sho.secondTransporter IN (?) OR sho.thirdTransporter IN (?))";
                rawWhereClauses.push(orCond);
                rawReplacements.push(filters.transporter);
                rawReplacements.push(filters.transporter);
                rawReplacements.push(filters.transporter);
            }
        }

        // Null Dates
        if (filters?.nullDatesFilter && filters.nullDatesFilter.length > 0) {
            if (filters.nullDatesFilter.includes("Current Appointment Date")) {
                rawWhereClauses.push("(sho.currentAppointmentDate IS NULL AND sho.firstAppointmentDateCOPT IS NULL)");
            }
            if (filters.nullDatesFilter.includes("Dispatch Date")) {
                rawWhereClauses.push("sho.dispatchDate IS NULL");
            }
            if (filters.nullDatesFilter.includes("Working Date")) {
                rawWhereClauses.push("sho.workingDatePlanner IS NULL");
            }
        }

        // Dates
        if (filters?.poDateFrom) { rawWhereClauses.push("sho.poDate >= ?"); rawReplacements.push(filters.poDateFrom); }
        if (filters?.poDateTo) { rawWhereClauses.push("sho.poDate <= ?"); rawReplacements.push(filters.poDateTo); }

        if (filters?.workingDateFrom) { rawWhereClauses.push("sho.workingDatePlanner >= ?"); rawReplacements.push(filters.workingDateFrom); }
        if (filters?.workingDateTo) { rawWhereClauses.push("sho.workingDatePlanner <= ?"); rawReplacements.push(filters.workingDateTo); }

        if (filters?.dispatchDateFrom) { rawWhereClauses.push("sho.dispatchDate >= ?"); rawReplacements.push(filters.dispatchDateFrom); }
        if (filters?.dispatchDateTo) { rawWhereClauses.push("sho.dispatchDate <= ?"); rawReplacements.push(filters.dispatchDateTo); }

        if (filters?.currentAppointmentDateFrom) { rawWhereClauses.push("sho.currentAppointmentDate >= ?"); rawReplacements.push(filters.currentAppointmentDateFrom); }
        if (filters?.currentAppointmentDateTo) { rawWhereClauses.push("sho.currentAppointmentDate <= ?"); rawReplacements.push(filters.currentAppointmentDateTo); } // Fix typo in original code: if (filters.dispatchDateTo) -> currentAppointmentDateTo

        // Search
        if (filters?.search && filters.search !== "") {
            rawWhereClauses.push("(sho.poNumber LIKE ? OR sho.uid LIKE ?)");
            rawReplacements.push(`%${filters.search}%`);
            rawReplacements.push(`%${filters.search}%`);
        }

        // Docket No
        if (filters?.docketNo && filters.docketNo !== "") {
            rawWhereClauses.push("(sho.firstDocketNo LIKE ? OR sho.secondDocketNo LIKE ? OR sho.thirdDocketNo LIKE ?)");
            rawReplacements.push(`%${filters.docketNo}%`);
            rawReplacements.push(`%${filters.docketNo}%`);
            rawReplacements.push(`%${filters.docketNo}%`);
        }

        // Role Access
        if (currUser.role !== "superadmin" && currUser.role !== "admin") {
            const allotedFacilities = currUser.allotedFacilities;
            if (!allotedFacilities || allotedFacilities.length === 0) {
                rawWhereClauses.push("1 = 0");
            } else {
                rawWhereClauses.push("sho.facility IN (?)");
                rawReplacements.push(allotedFacilities);
            }
        }

        const whereSql = rawWhereClauses.length > 0 ? `WHERE ${rawWhereClauses.join(' AND ')}` : '';

        // Select columns mapping to shipmentFormatDataType
        // Note: fieldName in constant matches DB column usually, but sometimes needs alias.

        const finalQuery = `
            SELECT 
                sho.uid,
                sho.entryDate,
                sho.poDate,
                sho.facility,
                sho.channel,
                sho.location,
                sho.poNumber,
                ${totalUnitsQuery} AS totalUnits,
                sho.remarksPlanning,
                sho.specialRemarksCOPT,
                sho.newShipmentReference,
                sho.statusPlanning,
                sho.statusWarehouse,
                sho.statusLogistics,
                sho.channelInwardingRemarks,
                sho.dispatchRemarksLogistics,
                sho.dispatchRemarksWarehouse,
                sho.dispatchDateTentative,
                sho.workingDatePlanner,
                sho.rtsDate,
                sho.dispatchDate,
                sho.currentAppointmentDate,
                sho.firstAppointmentDateCOPT,
                sho.noOfBoxes,
                sho.orderNo1,
                sho.orderNo2,
                sho.orderNo3,
                sho.poNumberInwardCWH,
                sho.pickListNo,
                sho.workingTypeWarehouse,
                sho.inventoryRemarksWarehouse,
                sho.b2bWorkingTeamRemarks,
                sho.volumetricWeight,
                sho.channelType,
                sho.firstTransporter,
                sho.firstDocketNo,
                sho.secondTransporter,
                sho.secondDocketNo,
                sho.thirdTransporter,
                sho.thirdDocketNo,
                sho.appointmentLetter,
                sho.labelsLink,
                sho.invoiceDate,
                sho.invoiceLink,
                sho.cnLink,
                sho.ewayLink,
                sho.invoiceValue,
                sho.remarksAccountsTeam,
                sho.invoiceChallanNumber,
                sho.invoiceCheckedBy,
                sho.customerCode,
                sho.poEntryCount,
                sho.deliveryDate,
                sho.rescheduleLag,
                sho.finalRemarks,
                sho.actualWeight,
                sho.physicalWeight,
                sho.deliveryCharges,
                sho.halting,
                sho.unloadingCharges,
                sho.dedicatedVehicle,
                sho.otherCharges,
                sho.dispatchDate As criticalDispatchDate,
                sho.rpk,
                sho.rpk As tat,
                sho.deliveryType,
                sho.appointmentShootedDate,
                sho.appointmentRequestedDate,
                sho.remarksWarehouse
            FROM shipment_orders sho
            ${whereSql}
            ORDER BY sho.uid DESC
        `;

        const signedUrl = await uploadCsvDataToS3(finalQuery, shipmentFormatDataType, rawReplacements);

        return res.status(200).json({
            msg: "File generated successfully",
            downloadUrl: signedUrl,
        });

    } catch (error) {
        console.error("Error downloading filtered shipments:", error);
        return res.status(500).json({
            msg: "Something went wrong while downloading filtered shipments",
            error: error.message,
        });
    }
}