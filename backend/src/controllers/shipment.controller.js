import { Op, where } from "sequelize";
// import { sequelize } from "../db/postgresql.js";
import { sequelize } from '../db/mysql.js';
import {ShipmentOrder} from "../models/index.js";
import {SkuOrder} from "../models/index.js";
import Log from "../models/log.model.js";
import User from "../models/user.model.js";
import { isBulkShipmentUpdateAllowed } from "../utils/shipment.js";

function checkNullCond(value, prevValue) {
  // return true if prev == non-null and now == null
  // only move on when have the return false
  if (prevValue === null || value === undefined) {
    return false;
  }
  return value !== "" && value !== "null" && value !== "undefined" && (prevValue === null || prevValue === undefined || prevValue === "" || prevValue === "null" || prevValue === "undefined");
}

// log Controllers

async function createLog({shipmentId, createdBy, fieldName, change, remark}){
  try {
    console.log(createdBy, shipmentId, change, remark);
    if(!shipmentId || !createdBy || !change || !remark){
      throw "Provide required fields";
    }
    const user = await User.findByPk(createdBy.id);
    if(!user){
      throw "No such user!";
    }
    const newMsg = {
      fieldName: fieldName || "",
      remark: remark || "",
      createdBy,
      change,
      remark,
      timestamp: Date.now(),
    }
    const existingLog = await Log.findOne({where: {shipmentOrderId: shipmentId}});
    if(existingLog){
      // update the existing log
      const log = await existingLog.update({ messages:[newMsg,...existingLog.messages]});
      console.log("Updated the log: ", log);      
      return log;
    } 
    // create new log
    const log = await Log.create({shipmentOrderId:shipmentId, messages:[newMsg], createdBy:createdBy?.id});
    console.log("Created new log: ", log);
    return log;
  } catch (error) {
    throw error
  }
} 

async function getLogsByShipment({shipmentId}){
  try {
    const log = await Log.findOne({where: {shipmentOrderId: shipmentId}});
    return log || {};
  } catch (error) {
    throw error
  }
}

async function createShipment(req, res) {
  const { shipmentOrder, skuOrders } = req.body;

  // Start a transaction so either all writes succeed or all roll back
  const t = await sequelize.transaction();
  try {
    // unique ponumber check
    const existingShipment = await ShipmentOrder.findAll({where: {poNumber: shipmentOrder.poNumber}});
    console.log(existingShipment)
    if(existingShipment.length > 0){
       await t.rollback();
      return res.status(400).json({msg: "Shipment order already exist with this Po Number!"})
    }
    // creating shipment order as a parent 
    const parent = await ShipmentOrder.create(shipmentOrder, { transaction: t });

    // attached the shared fields to each sku-order and link to parent UID
    const skusToCreate = skuOrders.map(sku => ({
      ...sku,
      shipmentOrderId: parent.uid
    }));

    // 3) Bulk‐insert all SKU records
    await SkuOrder.bulkCreate(skusToCreate, { transaction: t });

    // 4) Commit
    await t.commit();
    return res.status(201).json({ shipment: parent });

  } catch (err) {
    await t.rollback();
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}

async function createBulkShipment(req, res) {
  try {
    const { data } = req.body;
    // seprate all orders based on ponumber 
    const ordersByPoNumber = data.reduce((acc, order) => {
      const poNumber = order.poNumber;
      if (!acc[poNumber]) {
        acc[poNumber] = [];
      }
      acc[poNumber].push(order);
      return acc;
    }, {});

    let errors = [];

    for(const poNumber in ordersByPoNumber) {
      const orders = ordersByPoNumber[poNumber];
      const shipmentOrder = {
        entryDate: orders[0]?.entryDate,
        poDate: orders[0]?.poDate,
        facility: orders[0]?.facility,
        channel: orders[0]?.channel,
        location: orders[0]?.location,
        poNumber: orders[0]?.poNumber,
        totalUnits: orders[0]?.totalUnits,
        brandName: orders[0]?.brandName || orders[0].brand,
        remarksPlanning: orders[0]?.remarksPlanning,
        specialRemarksCOPT: orders[0]?.specialRemarksCOPT,
        newShipmentReference: orders[0]?.newShipmentReference,
        statusActive: "Active",
        statusPlanning: orders[0]?.statusPlanning,
        statusWarehouse: orders[0]?.statusWarehouse,
        statusLogistics: orders[0]?.statusLogistics,
        channelInwardingRemarks: orders[0]?.channelInwardingRemarks,
        dispatchRemarksLogistics: orders[0].dispatchRemarksLogistics,
        dispatchRemarksWarehouse: orders[0].dispatchRemarksWarehouse,
        dispatchDateTentative: orders[0].dispatchDateTentative,
        workingDatePlanner: orders[0].workingDatePlanner,
        rtsDate: orders[0].rtsDate,
        dispatchDate: orders[0].dispatchDate,
        currentAppointmentDate: orders[0].currentAppointmentDate,
        firstAppointmentDateCOPT: orders[0].firstAppointmentDateCOPT,
        noOfBoxes: orders[0].noOfBoxes,
        orderNo1: orders[0].orderNo1,
        orderNo2: orders[0].orderNo2,
        orderNo3: orders[0].orderNo3,
        pickListNo: orders[0].pickListNo,
        workingTypeWarehouse: orders[0].workingTypeWarehouse,
        inventoryRemarksWarehouse: orders[0].inventoryRemarksWarehouse,
        b2bWorkingTeamRemarks: orders[0].b2bWorkingTeamRemarks,
        // common come from sku order and will also update similarly
        actualWeight: orders[0].actualWeight,
        volumetricWeight: orders[0].volumetricWeight,
        channelType: orders[0].channelType,
        firstTransporter: orders[0].firstTransporter,
        firstDocketNo: orders[0].firstDocketNo,
        secondTransporter: orders[0].secondTransporter,
        secondDocketNo: orders[0].secondDocketNo,
        thirdTransporter: orders[0].thirdTransporter,
        thirdDocketNo: orders[0].thirdDocketNo,
        appointmentLetter: orders[0].appointmentLetter,
        labelsLink: orders[0].labelsLink,
        invoiceDate: orders[0].invoiceDate,
        invoiceLink: orders[0].invoiceLink,
        cnLink: orders[0].cnLink,
        ewayLink: orders[0].ewayLink,
        invoiceValue: orders[0].invoiceValue,
        remarksAccountsTeam: orders[0].remarksAccountsTeam,
        invoiceChallanNumber: orders[0].invoiceChallanNumber,
        invoiceCheckedBy: orders[0].invoiceCheckedBy,
        tallyCustomerName: orders[0].tallyCustomerName,
        customerCode: orders[0].customerCode,
        poEntryCount: orders[0].poEntryCount,
        temp: orders[0].temp,
        deliveryDate: orders[0].deliveryDate,
        rescheduleLag: orders[0].rescheduleLag,
        finalRemarks: orders[0].finalRemarks,
        updatedGmv: orders[0].updatedGmv,
        physicalWeight: orders[0].physicalWeight,
      };
      const skuOrders = orders.map(order => ({
        srNo: order.srNo,
        brandName: order.brand,
        skuName: order.skuName,
        skuCode: order.skuCode,
        channelSkuCode: order.channelSkuCode,
        qty: order.qty,
        gmv: order.gmv,
        poValue: order.poValue,
        accountsWorking: order.accountsWorking,
        channelInwardingQuantity: order.channelInwardingQuantity,
      }));
      console.log(`One orders(${poNumber}):`, shipmentOrder, skuOrders);
      const t = await sequelize.transaction();
      try {
        const parent = await ShipmentOrder.create(shipmentOrder, { transaction: t });
        // attached the shared fields to each sku-order and link to parent UID
        const skusToCreate = skuOrders.map(sku => ({
          ...sku,
          shipmentOrderId: parent.uid
        }));
        const skus = await SkuOrder.bulkCreate(skusToCreate, { transaction: t });
        await t.commit();
      } catch (error) {
        await t.rollback();
        errors.push({ poNumber, error: error.message });
        console.error("Error creating bulk shipment:", error);
      }
    }
    

    // console.log("Orders grouped by PO Number:", ordersByPoNumber);
    console.log("Errors:", errors);
    if (errors.length > 0) {
      return res.status(200).json({ msg: "Some shipments failed to create", errors });
    }

    return res.status(200).json({ msg: "Bulk shipments created successfully" });
    // return res.status(200).json({ msg: "Orders grouped by PO Number", data: ordersByPoNumber });

  } catch (error) {
    console.error("Error: ",error);
    return res.status(500).json({ msg: "Failed to create bulk orders!", error: error });
  }
}

async function getShipmentWithSkuOrders(req, res) {
  try {
    const { uid } = req.body;
    const shipment = await ShipmentOrder.findOne({
      where: { uid },
      include: [{
        model: SkuOrder,
        as: 'skuOrders',
      }]
    });
    if (!shipment) {
      return res.status(404).json({ error: 'Shipment not found' });
    }
    return res.status(200).json({ shipment });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}

async function getSkusByShipment(req, res) {
  try {
    // console.log("getSkusByShipment triggered")
      // shioment uid as uid
    const { uid } = req.body;
    console.log(uid);
    const skus = await SkuOrder.findAll(
      {where: {shipmentOrderId:uid},
      order: [
        //  [
        //     sequelize.literal(`
        //       CASE
        //         WHEN "srNo" ~ '^[0-9]+$' THEN CAST("srNo" AS INTEGER)
        //         ELSE NULL
        //       END
        //     `),
        //     'ASC NULLS LAST'
        //   ], // postgresql
          [ 
            sequelize.literal(`
            CASE
              WHEN srNo REGEXP '^[0-9]+$' THEN CAST(srNo AS UNSIGNED)
              ELSE NULL
            END
            `),
            'ASC'
          ], // mysql
      ] 
    })
    if(!skus || skus.length == 0){
      return res.status(404).json({msg:"No sku orders found for given shipment order!"})
    }
    return res.status(200).json({msg: "Sku orders fetched successfully", skus});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}

async function getAllShipments(req, res) {
  try {
    const currUser = req.user;
    let shipments;
    if(currUser.role === "superadmin" || currUser.role === "admin"){
      shipments = await ShipmentOrder.findAll({
        order: [["uid", "DESC"]],
        include: [{
          model: SkuOrder,
          as: 'skuOrders',
        }]
      });
    } 
    else if(currUser.role === "warehouse" || currUser.role === "logistics"){
      const allotedFacilities = currUser.allotedFacilities;
      // console.log("Facilities: ", allotedFacilities)
      if(!allotedFacilities || allotedFacilities.length === 0){
        shipments = [];
      }
      else{ 
        shipments = await ShipmentOrder.findAll({
          // where facility is one of currUser.allotedFacilities that is array or can be null
          where: {facility: { [Op.in]: allotedFacilities }},
          order: [["uid", "DESC"]],
          include: [{
            model: SkuOrder,
            as: 'skuOrders',
          }]
        });
      }
    }
    else {
      shipments = [];
    }

    if (!shipments || shipments.length === 0) {
      return res.status(404).json({ error: 'No shipments found!' });
    }

    // Process each shipment to calculate totalUnits and remove skuOrders
    const shipmentsWithTotals = shipments.map(shipment => {
      const shipmentData = shipment.toJSON();

      // Sum total quantity from related skuOrders
      const totalUnits = shipmentData.skuOrders.reduce((sum, sku) => {
        const qty = Number(sku.updatedQty ?? sku.qty ?? 0);
        return sum + qty;
      }, 0);

      // Add totalUnits and remove skuOrders to reduce payload
      shipmentData.totalUnits = totalUnits;
      delete shipmentData.skuOrders;

      return shipmentData;
    });

    return res.status(200).json({
      msg: "Data fetched successfully",
      shipments: shipmentsWithTotals
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Something went wrong while fetching data!",
      error: error.message
    });
  }
}

async function getPaginatedShipments(req, res) {
  try {
    const currUser = req.user;
    const query = req.query;

    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 200;
    const offset = (page - 1) * limit;

    let where = {};
    let totalCount = 0;
    let shipments = [];

    // --- SUPERADMIN / ADMIN ---
    if (currUser.role === "superadmin" || currUser.role === "admin") {
      const { rows, count } = await ShipmentOrder.findAndCountAll({
        where,
        order: [["uid", "DESC"]],
        include: [
          {
            model: SkuOrder,
            as: "skuOrders",
          },
        ],
        limit,
        offset,
      });

      shipments = rows;
      totalCount = count;
    }

    // --- WAREHOUSE / LOGISTICS ---
    else if (currUser.role === "warehouse" || currUser.role === "logistics") {
      const allotedFacilities = currUser.allotedFacilities;

      if (!allotedFacilities || allotedFacilities.length === 0) {
        // No facilities assigned → no data, tell frontend to stop pagination
        res.setHeader("X-No-More-Pages", "true");
        return res.status(200).json({
          msg: "No facilities allotted",
          shipments: [],
          totalCount: 0,
          totalPages: 0,
          page,
          limit,
        });
      }

      const { rows, count } = await ShipmentOrder.findAndCountAll({
        where: {
          facility: { [Op.in]: allotedFacilities },
        },
        order: [["uid", "DESC"]],
        include: [
          {
            model: SkuOrder,
            as: "skuOrders",
          },
        ],
        limit,
        offset,
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
    if (!shipments || shipments.length === 0) {
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

    // --- Send final response ---
    return res.status(200).json({
      msg: "Paginated shipment data fetched successfully",
      page,
      limit,
      totalCount: shipmentsWithTotals.length ?? 0,
      totalPages: shipmentsWithTotals.length !== 0 ? Math.ceil(shipmentsWithTotals.length / limit) : 0,
      shipments: shipmentsWithTotals,
      calculationDone: true,
    });
  } catch (error) {
    console.error("Error fetching paginated shipments:", error);
    return res.status(500).json({
      msg: "Something went wrong while fetching paginated shipments",
      error: error.message,
      calculationDone: false,
    });
  }
}


async function getAllSkuOrders(req, res) {
  try {
    // pull shipmentOrderId from ?shipmentOrderId=... if provided
    const currRole = req.user?.role;
    const query = req?.query;
    const shipmentOrderId = query?.shipmentOrderId ? query.shipmentOrderId : null;
    
    // build a where clause
    const where = {};
    if (shipmentOrderId) {
      where.shipmentOrderId = shipmentOrderId;
    }

    let skuOrders;
    // fetch all SKUs, optionally include parent ShipmentOrder
    if(currRole === "superadmin" || currRole === "admin"){
      skuOrders = await SkuOrder.findAll({
        include: [{
          model: ShipmentOrder,
          as: 'shipmentOrder',
        }],
        order: [
          ['shipmentOrderId', 'DESC'],
          // [
          //   sequelize.literal(`
          //     CASE
          //       WHEN "srNo" ~ '^[0-9]+$' THEN CAST("srNo" AS INTEGER)
          //       ELSE NULL
          //     END
          //   `),
          //   'ASC NULLS LAST'
          // ], // postgresql
          [ 
            sequelize.literal(`
              CASE
                WHEN srNo REGEXP '^[0-9]+$' THEN CAST(srNo AS UNSIGNED)
                ELSE NULL
              END
            `),
            'ASC'
          ], // mysql
        ]
      });
    }
    else {
      const allotedFacilities = req.user?.allotedFacilities;
      if(!allotedFacilities || allotedFacilities?.length === 0){
        skuOrders = [];
      }
      else{
        // const allotedFacilities = req.user?.allotedFacilities;
        skuOrders = await SkuOrder.findAll({
          include: [
            {
              model: ShipmentOrder,
              as: "shipmentOrder",
              required: true, // ensures only skuOrders having matching shipmentOrder are fetched
              where: allotedFacilities.length > 0 ? {
                facility: {
                  [Op.in]: allotedFacilities,
                },
              } : undefined, // no filter if none are allotted
            },
          ],
          order: [
            ['shipmentOrderId', 'DESC'],
            // [
            //   sequelize.literal(`
            //     CASE
            //       WHEN "srNo" ~ '^[0-9]+$' THEN CAST("srNo" AS INTEGER)
            //       ELSE NULL
            //     END
            //   `),
            //   'ASC NULLS LAST'
            // ], // postgresql
            [ 
              sequelize.literal(`
              CASE
                WHEN srNo REGEXP '^[0-9]+$' THEN CAST(srNo AS UNSIGNED)
                ELSE NULL
              END
              `),
              'ASC'
            ], // mysql
          ]
        });
      }
    }

    const skuDataList = skuOrders.map(sku => {
      const {shipmentOrder, ...skuData} = sku.dataValues;
      return {
        ...shipmentOrder?.dataValues,
        ...skuData,
      }
    })

    return res.status(200).json({msg:"data fetched successfully", orders:skuDataList});
  } catch (err) {
    console.error('Error fetching SKU orders:', err);
    return res.status(500).json({ error: 'Failed to retrieve SKU orders.' });
  }
}

async function getPaginatedSkus(req, res) {
  try {
    const currRole = req.user?.role;
    const query = req?.query;
    const shipmentOrderId = query?.shipmentOrderId || null;
    const page = parseInt(query?.page) || 1;
    const limit = parseInt(query?.limit) || 200;
    const offset = (page - 1) * limit;

    const where = {};
    if (shipmentOrderId) where.shipmentOrderId = shipmentOrderId;

    let skuOrders;
    let totalCount;

    // --- Fetch logic (same as before) ---
    if (currRole === "superadmin" || currRole === "admin") {
      const { rows, count } = await SkuOrder.findAndCountAll({
        where,
        include: [{ model: ShipmentOrder, as: "shipmentOrder" }],
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
        limit,
        offset,
      });

      skuOrders = rows;
      totalCount = count;
    } else {
      const allotedFacilities = req.user?.allotedFacilities;

      if (!allotedFacilities || allotedFacilities.length === 0) {
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

      const { rows, count } = await SkuOrder.findAndCountAll({
        where,
        include: [
          {
            model: ShipmentOrder,
            as: "shipmentOrder",
            required: true,
            where: {
              facility: { [Op.in]: allotedFacilities },
            },
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
        limit,
        offset,
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

async function getAllData (req, res) {
  try {
    const shipments = await ShipmentOrder.findAll({
      include: [{
        model: SkuOrder,
        as: 'skuOrders',
      }],
      order: [['uid', 'DESC']]
    });

    const skuOrders = await SkuOrder.findAll({
      include: [{
        model: ShipmentOrder,
        as: 'shipmentOrder',
      }]
    });

    const skuDataList = skuOrders.map(sku => {
      const {shipmentOrder, ...skuData} = sku.dataValues;
      return {
        ...skuData,
        ...shipmentOrder?.dataValues
      }
    })

    return res.status(200).json({msg:"Data fetched successfully", shipments, skuOrders:skuDataList, success: true, status: 200});
  } catch (error) {
    return res.status(500).json({msg:"Something went wrong while fetching data!", success: false, error, status: 500});
  }
}

async function updateShipment(req, res) {
  try {
    let isLog = false;
    let logs = [];

    let { uid, poEditAudit, ...updateData } = req.body;
    if(!req.body.poNumber){
      return res.status(400).json({msg: "PO Number can not be empty!"});
    }
    const shipment = await ShipmentOrder.findOne({ where: { uid } });

    if(poEditAudit){
      console.log("poEdit: ", poEditAudit)
      const po_log = {
        shipmentId: shipment.uid,
        createdBy: req.user,
        fieldName: "Po Number",
        change: `Po number changed from ${poEditAudit.originalPoNumber} to ${poEditAudit?.newPoNumber}`,
        remark: `${poEditAudit.reason}! ${poEditAudit.comments}`,
      }
      isLog = true;
      logs = [...logs, po_log]
    }

    if (!shipment) {
      return res.status(404).json({ error: 'Shipment not found' });
    }
    // check log for appointment date change
    if(shipment?.dataValues?.allAppointmentDate?.length !== updateData.allAppointmentDate.length){
      const len = updateData.allAppointmentDate.length;
      updateData.currentAppointmentDate = updateData.allAppointmentDate[len-1];
      isLog = true;
      const new_log = {
        shipmentId: shipment.uid,
        createdBy: req.user,
        fieldName: "Appointment Date",
        change: `Appointment Date changed from ${shipment?.dataValues?.currentAppointmentDate} to ${updateData?.currentAppointmentDate}`,
        remark:  updateData.appointmentRemarks[len-1] || "No remark provided",
      }
      logs = [...logs, new_log]
    }
    // check log for facility change
    if(shipment?.dataValues?.facility !== updateData?.facility){
      isLog = true;
      const new_log = {
        shipmentId: shipment.uid,
        createdBy: req.user,
        fieldName: "Facility",
        change: `Facility changed from ${shipment?.dataValues?.facility} to ${updateData?.facility}`,
        remark: "No extra remark provided",
      }
      logs = [...logs, new_log]
    }
    
    const updatedShipment = await shipment.update(updateData);
    
    console.log("isLog: ",isLog);
      // console.log("Previous Shipment:", shipment);
    // console.log("Updated Shipment: ", updatedShipment);
    if(isLog || logs.length > 0){
      // console.log("Changing logs")
      logs.map(async (log) =>{
        await createLog(log)
      })
    }
    return res.status(200).json({ msg: "Shipment updated successfully", shipment: updatedShipment });
  } catch (error) {
    console.log("ERROR:", error);
    return res.status(500).json({ error: error });
  }
}

async function updateSkusBySipment(req, res){
  const t = await sequelize.transaction();

  try {
    const {shipmentId, skus} = req.body;
    for (const item of skus) {
      console.log(item)
      await SkuOrder.update(
        item ,
        { where: { shipmentOrderId: shipmentId, id: item.id }, transaction: t }
      );
    }
    await t.commit();
    return res.status(200).json({msg:"Sku orders updated successfully"});
  } catch (error) {
    await t.rollback()
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}

async function updateBulkShipment(req, res){
  const t = await sequelize.transaction();
  let errs = [];
  try {
    const  shipments = req.body;
    const user = req.user;
    if(!user) {
      return res.status(401).json({msg:"Unauthorized access!"});
    }

    if(user.role === "superadmin"){
      for(const shipment of shipments) {
        let { uid, poNumber, ...updateData } = shipment;

        // check for allowed fields only
        let updatedFields = Object.keys(shipment).filter(key => key !== "poNumber" && key !== "uid");
        if (!isBulkShipmentUpdateAllowed(updatedFields, "superadmin")) {
          // await t.rollback();
          return res.status(401).json({ msg: "Unauthorized to update some fields!" });
        }

        const existingShipment = await ShipmentOrder.findOne({ where: { uid } });
        if (!existingShipment) {
          errs.push({ uid, poNumber, error: 'Shipment not found with given uid' });
          continue; // Skip to the next shipment if not found
        }
        if(poNumber !== existingShipment.poNumber) {
          errs.push({ uid, poNumber, error: 'Shipment not found with gien poNumber' });
          continue;
        }
        // for (const field in updateData) {
        //   const entries = Object.entries(updateData[field]);
        //   for (const [key, value] of entries) {
        //     console.log("Key: ", key, "Value: ", value);
        //     console.log("Existing Shipment: ", existingShipment[field][value]);
        //     if (!existingShipment[field][value]) {
        //       updateData[field][value] = existingShipment[field]?.[value]; 
        //     } else if( !updateData[field][value] ) {
        //       updateData[field][value] = existingShipment[field]?.[value];
        //     } else if (updateData[field][value] && !existingShipment[field][value]) {
        //       updateData[field][value] = updateData[field][value];
        //     }
        //   }
        // }
        await existingShipment.update(updateData, { transaction: t });
      }
      await t.commit();
      if (errs.length > 0) {
        return res.status(207).json({ msg:"Some Shipments not updated, because they were not found!", errors: errs });
      }
      return res.status(200).json({ msg: "All Shipments updated successfully" });
    }

    else if(user.role === "admin"){
      for(const shipment of shipments) {
        const { uid, ...updateData } = shipment;
        
        // check for allowed fields only
        let updatedFields = Object.keys(shipment).filter(key => key !== "poNumber" && key !== "uid");
        if (!isBulkShipmentUpdateAllowed(updatedFields, "admin")) {
          // await t.rollback();
          return res.status(401).json({ msg: "Unauthorized to update some fields!" });
        }

        const existingShipment = await ShipmentOrder.findOne({ where: { uid } });
        if (!existingShipment) {
          errs.push({ uid, error: 'Shipment not found' });
          continue; // Skip to the next shipment if not found
        }
        await existingShipment.update(updateData, { transaction: t });
      }
      await t.commit();
      if (errs.length > 0) {
        return res.status(204).json({ errors: errs });
      }
      return res.status(200).json({ msg: "Shipments updated successfully" });
    }

    else if(user.role === "warehouse"){
      for(const shipment of shipments) {
        const { uid, ...updateData } = shipment;

        // check for allowed fields only
        let updatedFields = Object.keys(shipment).filter(key => key !== "poNumber" && key !== "uid");
        if (!isBulkShipmentUpdateAllowed(updatedFields, "warehouse")) {
          // await t.rollback();
          return res.status(401).json({ msg: "Unauthorized to update some fields!" });
        }

        const existingShipment = await ShipmentOrder.findOne({ where: { uid } });
        if (!existingShipment) {
          errs.push({ uid, error: 'Shipment not found' });
          continue; // Skip to the next shipment if not found
        }
        await existingShipment.update(updateData, { transaction: t });
      }
      await t.commit();
      if (errs.length > 0) {
        return res.status(204).json({ errors: errs });
      }
      return res.status(200).json({ msg: "Shipments updated successfully" });
    }

    else if(user.role === "logistics"){
      for(const shipment of shipments) {
        const { uid, ...updateData } = shipment;

        // check for allowed fields only
        let updatedFields = Object.keys(shipment).filter(key => key !== "poNumber" && key !== "uid");
        if (!isBulkShipmentUpdateAllowed(updatedFields, "logistics")) {
          console.log("updatedFields: ", updatedFields);
          console.log("flag:", isBulkShipmentUpdateAllowed(updatedFields, "logistics"))
          // await t.rollback();
          return res.status(401).json({ msg: "Unauthorized to update some fields!" });
        }

        const existingShipment = await ShipmentOrder.findOne({ where: { uid } });
        if (!existingShipment) {
          errs.push({ uid, error: 'Shipment not found' });
          continue; // Skip to the next shipment if not found
        }
        await existingShipment.update(updateData, { transaction: t });
      }
      await t.commit();
      if (errs.length > 0) {
        return res.status(204).json({ errors: errs });
      }
      return res.status(200).json({ msg: "Shipments updated successfully" });
    }
    
    else {
      await t.rollback();
      return res.status(401).json({msg:"Unauthorized!", error: error.message})
    }

  } catch (error) {
    console.log(error);
    await t.rollback();
    console.error("Error: ", error);
    return res.status(500).json({msg:"Something went wrong while updating Shipments!", error: error.message})
  }
}

async function updateBulkSku(req, res) {
  const transaction = await sequelize.transaction();
  
  try {
    const skus = req.body;
    console.log('Received SKUs for bulk update:', skus);

    if (!Array.isArray(skus) || skus.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        msg: "Invalid input. Expected non-empty array of SKU objects.",
        success: false
      });
    }
    
    const updatePromises = skus.map(async (sku) => {
      const id = sku.id;
      const updatedData = {
        updatedQty: sku.updatedQty,
        updatedGmv: sku.updatedGmv,
        updatedPoValue: sku.updatedPoValue,
        updateReason: sku.updateReason,
        updatedBy: sku.updatedBy
      }
      return await SkuOrder.update(updatedData, {
        where: { id: id },
        transaction: transaction,
        returning: true
      });
    });

    const results = await Promise.all(updatePromises);
    await transaction.commit();

    const successCount = results.reduce((sum, result) => sum + result[0], 0);

    return res.status(200).json({
      msg: "Bulk update completed successfully",
      success: true,
      summary: {
        total: skus.length,
        successful: successCount,
        failed: skus.length - successCount
      }
    });

  } catch (error) {
    await transaction.rollback();
    console.log("ERROR in updateBulkSkuWithTransaction: ", error);
    return res.status(500).json({
      msg: "Transaction failed. All changes rolled back.",
      success: false,
      err: error.message
    });
  }
}

async function deleteSku(req,res) {
  try {
    const {id} = req.body;
    if(!id){
      return res.status(400).json({msg:"Provide valid order id!"})
    }
    const sku = await SkuOrder.findByPk(id);
    if(!sku) {
      return res.status(404).json({msg: "no such sku order exist!"})
    }
    const skusWithSameShipment = await SkuOrder.findAll({where: {shipmentOrderId: sku.shipmentOrderId}})
    console.log("skus with same shipment:",skusWithSameShipment.length)
    const deleted = await SkuOrder.destroy({where: {id:id}});
    if(skusWithSameShipment.length == 1){
      await ShipmentOrder.destroy({where: { uid: sku.shipmentOrderId }})
    }
    return res.status(200).json({msg: "Sku order deleted successfully"})
  } catch (error) {
    console.log("ERROR: ",error)
    return res.status(500).json({msg:"Failed to delete Order!", error})
  }
}

async function deleteShipment(req, res) {
  const t = await sequelize.transaction();
  try {
    const { uid } = req.body;
    
    // Validation
    if (!uid) {
      await t.rollback();
      return res.status(400).json({
        msg: "UID is required",
        success: false
      });
    }

    const deletedSkuOrders = await SkuOrder.destroy({
      where: { 
        shipmentOrderId: uid 
      },
      transaction: t
    });

    const deletedShipment = await ShipmentOrder.destroy({
      where: { uid: uid },
      transaction: t
    });

    // Check if shipment was found and deleted
    if (deletedShipment === 0) {
      await t.rollback();
      return res.status(404).json({
        msg: "Shipment order not found",
        success: false
      });
    }

    // Commit the transaction
    await t.commit();

    return res.status(200).json({
      msg: "Shipment order and associated SKUs deleted successfully",
      success: true,
      deletedShipment: deletedShipment,
      deletedSkuOrders: deletedSkuOrders
    });

  } catch (error) {
    // Rollback transaction on error
    await t.rollback();
    console.log("ERROR in deleteShipment: ", error);
    
    return res.status(500).json({
      msg: "Failed to delete shipment order!",
      success: false,
      error: error.message
    });
  }
}


export const shipmentControllers = {
    createShipment,
    createBulkShipment,
    getShipmentWithSkuOrders,
    getSkusByShipment,
    getAllShipments,
    getAllSkuOrders,
    getAllData,
    updateShipment,
    updateBulkShipment,
    updateSkusBySipment,
    getLogsByShipment,
    updateBulkSku,
    deleteSku,
    deleteShipment,
    getPaginatedSkus,
    getPaginatedShipments,
};

