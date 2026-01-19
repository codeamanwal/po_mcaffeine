
import { generateS3UploadUrl, uploadSkuDataToS3 } from "../utils/s3.js"
import SkuOrder from "../models/sku-order.model.js";
import ShipmentOrder from "../models/shipment-order.model.js";
import { Op } from "sequelize";

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
        const signedUrl = await uploadSkuDataToS3(finalQuery, replacements);

        return res.status(200).json({
            msg: "File generated successfully",
            downloadUrl: signedUrl
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({ msg: "Could not generate file download url!", error: error })
    }
}