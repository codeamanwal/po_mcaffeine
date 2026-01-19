import { sequelize } from "../db/mysql.js";
import SkuOrder from "../models/sku-order.model.js";
import ShipmentOrder from "../models/shipment-order.model.js"
import { Op } from "sequelize";
// filter body sku orders
const filters = {
  search: "",
  brand: ["Mcaffien", "hyphen"],
  channel: ["Bigbasket", "Puple SOR"],
  facility: ["Abc"],
  location: [],
  statusPlaning: [],
  statusWarehouse: [],
  statusLogistic: [],
  // date filters
  poDateFrom: "",
  poDateTo: "",
  workingDateFrom: "",
  workingDateTo: "",
  dispatchDateFrom: "",
  dispatchDateTo: "",
  // search filters
  skuCode: "",
  poNumber: "",
  docketNo: "",
  // null date filters
  nullDatesFilter: ["Current Appointment Date", "Working Date", "Dispatch Date"],
}

export async function getSkus(req, res) {
  try {
    const currRole = req.user?.role;
    const query = req?.query;
    const shipmentOrderId = query?.shipmentOrderId || null;

    // filters
    const filters = req.body.filters;
    // console.log("filters:", filters)

    // pagination parameter
    const page = parseInt(query?.page) ?? 1;
    const limit = parseInt(query?.limit) ?? null;
    const offset = limit ? (page - 1) * limit : null;

    // add clause based on filters
    const skuWhere = {};
    const shipmentWhere = {};
    if (filters?.skuCode && filters.skuCode !== "") {
      skuWhere.skuCode = { [Op.like]: `%${filters.skuCode}%` };
    }
    if (filters?.brand && filters?.brand?.length > 0) {
      if (filters?.brand?.includes("Not Assigned")) {
        skuWhere.brandName = {
          [Op.or]: [
            { [Op.in]: filters?.brand?.filter(val => val !== "Not Assigned") },
            { [Op.is]: null },
            { [Op.eq]: "" }
          ]
        }
      }
      else {
        skuWhere.brandName = { [Op.in]: filters.brand };
      }
    }

    if (filters?.channel && filters?.channel?.length > 0) {
      if (filters?.channel?.includes("Not Assigned")) {
        shipmentWhere.channel = {
          [Op.or]: [
            { [Op.in]: filters?.channel?.filter(val => val !== "Not Assigned") },
            { [Op.is]: null },
            { [Op.eq]: "" }
          ]
        }
      }
      else {
        shipmentWhere.channel = { [Op.in]: filters.channel };
      }
    }
    if (filters?.facility && filters?.facility?.length > 0) {
      if (filters?.facility?.includes("Not Assigned")) {
        shipmentWhere.facility = {
          [Op.or]: [
            { [Op.in]: filters?.facility?.filter(val => val !== "Not Assigned") },
            { [Op.is]: null },
            { [Op.eq]: "" }
          ]
        }
      }
      else {
        shipmentWhere.facility = { [Op.in]: filters?.facility };
      }
    }
    if (filters?.location && filters?.location?.length > 0) {
      if (filters?.location?.includes("Not Assigned")) {
        shipmentWhere.location = {
          [Op.or]: [
            { [Op.in]: filters?.location?.filter(val => val !== "Not Assigned") },
            { [Op.is]: null },
            { [Op.eq]: "" }
          ]
        }
      }
      else {
        shipmentWhere.location = { [Op.in]: filters?.location };
      }
    }
    if (filters?.statusPlanning && filters?.statusPlanning?.length > 0) {
      if (filters?.statusPlanning?.includes("Not Assigned")) {
        shipmentWhere.statusPlanning = {
          [Op.or]: [
            { [Op.in]: filters?.statusPlanning?.filter(val => val !== "Not Assigned") },
            { [Op.is]: null },
            { [Op.eq]: "" }
          ]
        }
      }
      else {
        shipmentWhere.statusPlanning = { [Op.in]: filters?.statusPlanning };
      }
    }
    if (filters?.statusWarehouse && filters?.statusWarehouse?.length > 0) {
      if (filters?.statusWarehouse?.includes("Not Assigned")) {
        shipmentWhere.statusWarehouse = {
          [Op.or]: [
            { [Op.in]: filters?.statusWarehouse?.filter(val => val !== "Not Assigned") },
            { [Op.is]: null },
            { [Op.eq]: "" }
          ]
        }
      }
      else {
        shipmentWhere.statusWarehouse = { [Op.in]: filters.statusWarehouse };
      }
    }
    if (filters?.statusLogistics && filters?.statusLogistics?.length > 0) {
      if (filters?.statusLogistics?.includes("Not Assigned")) {
        shipmentWhere.statusLogistics = {
          [Op.or]: [
            { [Op.in]: filters?.statusLogistics?.filter(val => val !== "Not Assigned") },
            { [Op.is]: null },
            { [Op.eq]: "" }
          ]
        }
      }
      else {
        shipmentWhere.statusLogistics = { [Op.in]: filters?.statusLogistics };
      }
    }
    if (filters?.poDateFrom || filters?.poDateTo) {
      shipmentWhere.poDate = {};
      
      if (filters.poDateFrom) {
        shipmentWhere.poDate[Op.gte] = filters.poDateFrom;
      }
      if (filters.poDateTo) {
        shipmentWhere.poDate[Op.lte] = filters.poDateTo;
      }
    }
    if (filters?.workingDateFrom || filters?.workingDateTo) {
      shipmentWhere.workingDatePlanner = {};
      
      if (filters.workingDateFrom) {
        shipmentWhere.workingDatePlanner[Op.gte] = filters.workingDateFrom;
      }
      if (filters.workingDateTo) {
        shipmentWhere.workingDatePlanner[Op.lte] = filters.workingDateTo;
      }
    }
    if (filters?.search && filters.search !== "") {
      shipmentWhere[Op.or] = [
        { poNumber: { [Op.like]: `%${filters.search}%` } },
        { uid: { [Op.like]: `%${filters.search}%` } }
      ];
    }

    if (shipmentOrderId) skuWhere.shipmentOrderId = shipmentOrderId;

    let skuOrders;
    let totalCount;

    if (currRole === "superadmin" || currRole === "admin") {
      const { rows, count } = await SkuOrder.findAndCountAll({
        where: skuWhere,
        include: [{ model: ShipmentOrder, as: "shipmentOrder", required: true, where: shipmentWhere }],
        order: [
          ["shipmentOrderId", "DESC"],
          [
            sequelize.literal(`
              CASE
                WHEN srNo REGEXP '^[0-9]+$' THEN CAST(srNo AS UNSIGNED)
                ELSE NULL
              END
            `),
            "ASC",
          ],
        ],
        limit: limit ? limit : null,
        offset: offset ? offset : null,
      });

      skuOrders = rows;
      totalCount = count;
    } 
    else {
      const allotedFacilities = req.user?.allotedFacilities;

      if (!allotedFacilities || allotedFacilities?.length === 0) {
        res.setHeader("X-No-More-Pages", "true");
        return res.status(200).json({
          msg: "No facilities allotted",
          orders: [],
          page,
          totalPages: 0,
          totalCount: 0,
          calculationDone: true,
        });
      }

      let facilityFilter = allotedFacilities; // default = ALL allowed facilities

      if (filters?.facility && filters?.facility?.length > 0) {
        // Intersect
        facilityFilter = filters?.facility?.filter(f =>
          allotedFacilities?.includes(f)
        );

        // If intersection is empty -> user filtered by facilities they don't have access to
        if (facilityFilter?.length === 0) {
          res.setHeader("X-No-More-Pages", "true");
          return res.status(200).json({
            msg: "No shipments found for your allotted facilities",
            shipments: [],
            totalCount: 0,
            totalPages: 0,
            page,
            limit,
          });
        }
      }

      shipmentWhere.facility = { [Op.in]: facilityFilter };

      const { rows, count } = await SkuOrder.findAndCountAll({
        where: skuWhere,
        include: [
          {
            model: ShipmentOrder,
            as: "shipmentOrder",
            required: true,
            where: shipmentWhere,
          },
        ],
        order: [
          ["shipmentOrderId", "DESC"],
          [
            sequelize.literal(`
              CASE
                WHEN srNo REGEXP '^[0-9]+$' THEN CAST(srNo AS UNSIGNED)
                ELSE NULL
              END
            `),
            "ASC",
          ],
        ],
        limit: limit ? limit : null,
        offset: offset ? offset : null,
      });

      skuOrders = rows;
      totalCount = count;
    }

    const totalPages = Math.ceil(totalCount / limit);

    // --- Check if this is the last page ---
    if (page >= totalPages) {
      res.setHeader("X-No-More-Pages", "true");
    } else {
      res.setHeader("X-No-More-Pages", "false");
    }

    // --- Flatten SKU + ShipmentOrder data ---
    const skuDataList = skuOrders.map((sku) => {
      const { shipmentOrder, ...skuData } = sku.dataValues;
      return {
        ...shipmentOrder?.dataValues,
        ...skuData,
      };
    });

    // --- Final response ---
    return res.status(200).json({
      msg: "Data fetched successfully",
      page,
      limit,
      totalCount,
      totalPages,
      orders: skuDataList,
      calculationDone: true,
    });
  } catch (err) {
    console.error("Error fetching SKU orders:", err);
    return res.status(500).json({
      error: "Failed to retrieve SKU orders.",
      calculationDone: false,
    });
  }
}


export async function getShipments(req, res) {
  try {
    const start = Date.now();
    const currUser = req.user;
    const query = req.query;

    const filters = req.body.filters;

    // pagination parameter
    const page = parseInt(query?.page) ?? 1;
    const limit = parseInt(query?.limit) ?? null;
    const offset = limit ? (page - 1) * limit : null;

    // add clause based on filters
    const skuWhere = {};
    const shipmentWhere = {};

    if (filters?.brand && filters.brand?.length > 0) {
      if (filters?.brand?.includes("Not Assigned")) {
        skuWhere.brandName = {
          [Op.or]: [
            { [Op.in]: filters?.brand?.filter(val => val !== "Not Assigned") },
            { [Op.is]: null },
            { [Op.eq]: "" }
          ]
        }
      }
      else {
        skuWhere.brandName = { [Op.in]: filters.brand };
      }
    }

    if (filters?.channel && filters?.channel?.length > 0) {
      if (filters?.channel?.includes("Not Assigned")) {
        shipmentWhere.channel = {
          [Op.or]: [
            { [Op.in]: filters?.channel?.filter(val => val !== "Not Assigned") },
            { [Op.is]: null },
            { [Op.eq]: "" }
          ]
        }
      }
      else {
        shipmentWhere.channel = { [Op.in]: filters.channel };
      }
    }
    if (filters?.facility && filters?.facility?.length > 0) {
      if (filters?.facility?.includes("Not Assigned")) {
        shipmentWhere.facility = {
          [Op.or]: [
            { [Op.in]: filters?.facility?.filter(val => val !== "Not Assigned") },
            { [Op.is]: null },
            { [Op.eq]: "" }
          ]
        }
      }
      else {
        shipmentWhere.facility = { [Op.in]: filters?.facility };
      }
    }
    if (filters?.location && filters?.location?.length > 0) {
      if (filters?.location?.includes("Not Assigned")) {
        shipmentWhere.location = {
          [Op.or]: [
            { [Op.in]: filters?.location?.filter(val => val !== "Not Assigned") },
            { [Op.is]: null },
            { [Op.eq]: "" }
          ]
        }
      }
      else {
        shipmentWhere.location = { [Op.in]: filters?.location };
      }
    }
    if (filters?.statusPlanning && filters?.statusPlanning?.length > 0) {
      if (filters?.statusPlanning?.includes("Not Assigned")) {
        shipmentWhere.statusPlanning = {
          [Op.or]: [
            { [Op.in]: filters?.statusPlanning?.filter(val => val !== "Not Assigned") },
            { [Op.is]: null },
            { [Op.eq]: "" }
          ]
        }
      }
      else {
        shipmentWhere.statusPlanning = { [Op.in]: filters?.statusPlanning };
      }
    }
    if (filters?.statusWarehouse && filters?.statusWarehouse?.length > 0) {
      if (filters?.statusWarehouse?.includes("Not Assigned")) {
        shipmentWhere.statusWarehouse = {
          [Op.or]: [
            { [Op.in]: filters?.statusWarehouse?.filter(val => val !== "Not Assigned") },
            { [Op.is]: null },
            { [Op.eq]: "" }
          ]
        }
      }
      else {
        shipmentWhere.statusWarehouse = { [Op.in]: filters?.statusWarehouse };
      }
    }
    if (filters?.statusLogistics && filters?.statusLogistics?.length > 0) {
      if (filters?.statusLogistics?.includes("Not Assigned")) {
        shipmentWhere.statusLogistics = {
          [Op.or]: [
            { [Op.in]: filters?.statusLogistics?.filter(val => val !== "Not Assigned") },
            { [Op.is]: null },
          ]
        }
      }
      else {
        shipmentWhere.statusLogistics = { [Op.in]: filters.statusLogistics };
      }
    }
    if (filters?.transporter && filters?.transporter?.length > 0) {
      if (filters?.transporter?.includes("Not Assigned")) {
        shipmentWhere.firstTransporter = {
          [Op.or]: [
            { [Op.in]: filters?.transporter?.filter(val => val !== "Not Assigned") },
            { [Op.is]: null },
            { [Op.eq]: "" }
          ]
        };
        shipmentWhere.secondTransporter = {
          [Op.or]: [
            { [Op.in]: filters?.transporter?.filter(val => val !== "Not Assigned") },
            { [Op.is]: null },
            { [Op.eq]: "" }
          ]
        };
         shipmentWhere.thirdTransporter = {
          [Op.or]: [
            { [Op.in]: filters?.transporter?.filter(val => val !== "Not Assigned") },
            { [Op.is]: null },
            { [Op.eq]: "" }
          ]
        }
      }
      else {
        shipmentWhere[Op.or] = [
          { firstTransporter: { [Op.in]: filters.transporter } },
          { secondTransporter: { [Op.in]: filters.transporter } },
          { thirdTransporter: { [Op.in]: filters.transporter } },
        ];
      }
    }

    if (filters?.nullDatesFilter && filters.nullDatesFilter?.length > 0) {
      if(filters.nullDatesFilter?.includes("Current Appointment Date")) {
        shipmentWhere[Op.and] = [
          {currentAppointmentDate: { [Op.is]: null }},
          {firstAppointmentDateCOPT: { [Op.is]: null }},
        ]
      }
      if(filters.nullDatesFilter?.includes("Dispatch Date")) {
        shipmentWhere.dispatchDate = {
          [Op.is]: null
        }
      }
      if(filters.nullDatesFilter?.includes("Working Date")) {
        shipmentWhere.workingDatePlanner = {
          [Op.is]: null
        }
      }
    }

    if (filters?.poDateFrom || filters?.poDateTo) {
      shipmentWhere.poDate = {};
      
      if (filters.poDateFrom) {
        shipmentWhere.poDate[Op.gte] = filters.poDateFrom;
      }
      if (filters.poDateTo) {
        shipmentWhere.poDate[Op.lte] = filters.poDateTo;
      }
    }
    if (filters?.workingDateFrom || filters?.workingDateTo) {
      shipmentWhere.workingDatePlanner = {};
      
      if (filters.workingDateFrom) {
        shipmentWhere.workingDatePlanner[Op.gte] = filters.workingDateFrom;
      }
      if (filters.workingDateTo) {
        shipmentWhere.workingDatePlanner[Op.lte] = filters.workingDateTo;
      }
    }
    if (filters?.dispatchDateFrom || filters?.dispatchDateTo) {
      shipmentWhere.dispatchDate = {};
      
      if (filters.dispatchDateFrom) {
        shipmentWhere.dispatchDate[Op.gte] = filters.dispatchDateFrom;
      }
      if (filters.dispatchDateTo) {
        shipmentWhere.dispatchDate[Op.lte] = filters.dispatchDateTo;
      }
    }
    if (filters?.currentAppointmentDateFrom || filters?.currentAppointmentDateTo) {
      shipmentWhere.currentAppointmentDate = {};
      
      if (filters.currentAppointmentDateFrom) {
        shipmentWhere.currentAppointmentDate[Op.gte] = filters.currentAppointmentDateFrom;
      }
      if (filters.dispatchDateTo) {
        shipmentWhere.currentAppointmentDate[Op.lte] = filters.currentAppointmentDateTo;
      }
    }

    if (filters?.search && filters.search !== "") {
      shipmentWhere[Op.or] = [
        { poNumber: { [Op.like]: `%${filters.search}%` } },
        { uid: { [Op.like]: `%${filters.search}%` } }
      ];
    }

    if (filters?.docketNo && filters.docketNo !== "") {
      shipmentWhere[Op.or] = [
        { firstDocketNo: { [Op.like]: `%${filters.docketNo}%` } },
        { secondDocketNo: { [Op.like]: `%${filters.docketNo}%` } },
        { thirdDocketNo: { [Op.like]: `%${filters.docketNo}%` } },
      ];
    }

    let totalCount = 0;
    let shipments = [];

    // --- SUPERADMIN / ADMIN ---
    if (currUser.role === "superadmin" || currUser.role === "admin") {
      const { rows, count } = await ShipmentOrder.findAndCountAll({
        where: shipmentWhere,
        order: [["uid", "DESC"]],
        include: [
          {
            model: SkuOrder,
            as: "skuOrders",
            where: skuWhere,
            required: true
          },
        ],
        limit: limit ? limit : null,
        offset: offset ? offset : null,
        distinct: true,
      });

      shipments = rows;
      totalCount = count;
    }

    // --- WAREHOUSE / LOGISTICS ---
    else if (currUser.role === "warehouse" || currUser.role === "logistics") {
      const allotedFacilities = currUser.allotedFacilities;

      if (!allotedFacilities || allotedFacilities?.length === 0) {
        // No facilities assigned → no data, tell frontend to stop pagination
        res.setHeader("X-No-More-Pages", "true");
        return res.status(200).json({
          msg: "No facilities allotted",
          shipments: [],
          totalCount: 0,
          totalPages: 0,
          page,
          limit: limit,
        });
      }

      let facilityFilter = allotedFacilities; // default = ALL allowed facilities

      if (filters?.facility && filters?.facility?.length > 0) {
        // Intersect
        facilityFilter = filters?.facility?.filter(f =>
          allotedFacilities?.includes(f)
        );

        // If intersection is empty -> user filtered by facilities they don't have access to
        if (facilityFilter?.length === 0) {
          res.setHeader("X-No-More-Pages", "true");
          return res.status(200).json({
            msg: "No shipments found for your allotted facilities",
            shipments: [],
            totalCount: 0,
            totalPages: 0,
            page,
            limit,
          });
        }
      }

      shipmentWhere.facility = { [Op.in]: facilityFilter };

      const { rows, count } = await ShipmentOrder.findAndCountAll({
        where: shipmentWhere,
        order: [["uid", "DESC"]],
        include: [
          {
            model: SkuOrder,
            as: "skuOrders",
          },
        ],
        limit: limit ? limit : null,
        offset: offset ? offset : null,
        distinct: true,
      });

      shipments = rows;
      totalCount = count;
    }

    // --- OTHER ROLES ---
    else {
      res.setHeader("X-No-More-Pages", "true");
      return res.status(200).json({
        msg: "No access for this role",
        shipments: [],
        totalCount: 0,
        totalPages: 0,
        page,
        limit,
      });
    }

    // --- If no shipments found ---
    if (!shipments || shipments?.length === 0) {
      res.setHeader("X-No-More-Pages", "true");
      return res.status(200).json({
        msg: "No shipments found",
        shipments: [],
        totalCount: 0,
        totalPages: 0,
        page,
        limit,
      });
    }

    // --- Calculate totalUnits for each shipment ---
    const shipmentsWithTotals = shipments.map((shipment) => {
      const shipmentData = shipment.toJSON();
      const totalUnits = shipmentData.skuOrders.reduce((sum, sku) => {
        const qty = Number(sku.updatedQty ?? sku.qty ?? 0);
        return sum + qty;
      }, 0);
      shipmentData.totalUnits = totalUnits;
      delete shipmentData.skuOrders;
      return shipmentData;
    });

    const totalPages = Math.ceil(totalCount / limit);

    // --- Set header to tell frontend if this is the last page ---
    if (page >= totalPages) {
      res.setHeader("X-No-More-Pages", "true");
    } else {
      res.setHeader("X-No-More-Pages", "false");
    }

    const end = Date.now()
    // --- Send final response ---
    return res.status(200).json({
      msg: "Paginated shipment data fetched successfully",
      page,
      limit,
      totalCount,
      totalPages,
      shipments: shipmentsWithTotals,
      calculationDone: true,
      // duration: `${(end - start) / 1000} sec`,
    });
  } catch (error) {
    console.log(error)
    console.error("Error fetching paginated shipments:", error);
    return res.status(500).json({
      msg: "Something went wrong while fetching paginated shipments",
      error: error.message,
      calculationDone: false,
    });
  }
}

// get unique filter options
export async function getFilterOptions(req, res) {
  try {
    const currUser = req.user;
    let isAdmin = false;

    if (currUser.role === "superadmin" || currUser.role === "admin") {
      isAdmin = true
    }

    const allotedFacilities = currUser.allotedFacilities;
    // console.log("allotedFacilities: ", allotedFacilities);

    let filteroptionsql = `
      SELECT
        GROUP_CONCAT(DISTINCT channel) AS channel,
        GROUP_CONCAT(DISTINCT facility) AS faci,
        GROUP_CONCAT(DISTINCT location) AS location,
        GROUP_CONCAT(DISTINCT statusPlanning) AS statusPlanning,
        GROUP_CONCAT(DISTINCT statusWarehouse) AS statusWarehouse,
        GROUP_CONCAT(DISTINCT statusLogistics) AS statusLogistics,
        GROUP_CONCAT(DISTINCT firstTransporter) AS firstTransporter,
        GROUP_CONCAT(DISTINCT secondTransporter) AS secondTransporter,
        GROUP_CONCAT(DISTINCT thirdTransporter) AS thirdTransporter
      FROM shipment_orders
    `;

    // Add WHERE only for non-admins
    if (!isAdmin) {
      filteroptionsql += ` WHERE facility IN (:allotted)`;
    }

    const [rows] = await sequelize.query(filteroptionsql, {
      replacements: {
        allotted: allotedFacilities
      },
      // logging: console.log,
      type: sequelize.QueryTypes.SELECT
    });



    const [skuRows] = await sequelize.query(`
      SELECT GROUP_CONCAT(DISTINCT brandName) AS brand
      FROM sku_orders;
    `);

    const parse = (val) => {
      return val && typeof val === "string"
        ? Array.from(
          new Set(
            val
              ?.split(",")
              ?.map((v) => v.trim())
              ?.filter((v) => v && v !== "0")
          )
        )
        : [];
      }
    
    
    // console.log("rows: ", parse(rows?.channel), "channel: ", rows.channel)


    const filters = {
      brand: parse(skuRows[0]?.brand),
      channel: parse(rows?.channel),
      facility: parse(rows?.faci),
      location: parse(rows?.location),
      statusPlanning: parse(rows?.statusPlanning),
      statusWarehouse: parse(rows?.statusWarehouse),
      statusLogistics: parse(rows?.statusLogistics),
      statusLogistics: parse(rows?.statusLogistics),
      transporter: [...parse(rows.firstTransporter), ...parse(rows.firstTransporter), ...parse(rows.firstTransporter)],
    };

    return res.status(200).json({ msg: "Fetched unique options for filters", filterOptions: filters })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ msg: "Could not fetch filter options", error })
  }
}

// download csvs with filters
export async function downloadSkuCsv(req, res) {
  try {
    
  } catch (error) {
    console.error("Error downloading SKU CSV:", error);
    return res.status(500).json({ msg: "Something went wrong while downloading SKU CSV", error });
  }
}