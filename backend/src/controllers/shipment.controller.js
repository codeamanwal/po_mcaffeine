import { sequelize } from "../db/postgresql.js";
import {ShipmentOrder} from "../models/index.js";
import {SkuOrder} from "../models/index.js";
import Log from "../models/log.model.js";
import User from "../models/user.model.js";

function checkNullCond(value, prevValue) {
  // return true if prev == non-null and now == null
  // only move on when have the return false
  if (prevValue === null || value === undefined) {
    return false;
  }
  return value !== "" && value !== "null" && value !== "undefined" && (prevValue === null || prevValue === undefined || prevValue === "" || prevValue === "null" || prevValue === "undefined");
}

// log Controllers

async function createLog({shipmentId, createdBy, change, remark}){
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
      createdBy,
      change,
      remark,
    }
    const existingLog = await Log.findOne({where: {shipmentOrderId: shipmentId}});
    if(existingLog){
      // update the existing log
      const log = await existingLog.update({ messages:[...existingLog.messages, newMsg]});
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
      try {
        const t = await sequelize.transaction();
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
    console.log("getSkusByShipment triggered")
      // shioment uid as uid
    const { uid } = req.body;
    console.log(uid);
    const skus = await SkuOrder.findAll({where: {shipmentOrderId:uid} })
    if(!skus || skus.length == 0){
      return res.status(404).json({msg:"No sku orders found for given shipment order!"})
    }
    return res.status(200).json({msg: "Sku orders fetched successfully", skus});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}

async function getAllShipments(req, res){
    try {
        const shipments = await ShipmentOrder.findAll({});
        return res.status(200).json({msg:"Data fetched successfully", shipments, success: true, status: 200});
    } catch (error) {
        console.log(error)
        return res.status(500).json({msg:"Something went wrong While fetching data!", success: false, error, status: 500});
    }
}

async function getAllSkuOrders(req, res) {
  try {
    // pull shipmentOrderId from ?shipmentOrderId=... if provided
    const query = req?.query;
    const shipmentOrderId = query?.shipmentOrderId ? query.shipmentOrderId : null;
    
    // build a where clause
    const where = {};
    if (shipmentOrderId) {
      where.shipmentOrderId = shipmentOrderId;
    }

    // fetch all SKUs, optionally include parent ShipmentOrder
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

    return res.status(200).json({msg:"data fetched successfully", orders:skuDataList});
  } catch (err) {
    console.error('Error fetching SKU orders:', err);
    return res.status(500).json({ error: 'Failed to retrieve SKU orders.' });
  }
}

async function getAllData (req, res) {
  try {
    const shipments = await ShipmentOrder.findAll({
      include: [{
        model: SkuOrder,
        as: 'skuOrders',
      }]
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
    const { uid, ...updateData } = req.body;
    const shipment = await ShipmentOrder.findOne({ where: { uid } });
    if (!shipment) {
      return res.status(404).json({ error: 'Shipment not found' });
    }
    if(shipment?.dataValues?.currentAppointmentDate !== updateData.currentAppointmentDate){
      isLog = true;
    }
      const updatedShipment = await shipment.update(updateData);
    console.log("isLog: ",isLog);
      // console.log("Previous Shipment:", shipment);
    // console.log("Updated Shipment: ", updatedShipment);
    if(isLog){
      // console.log("Changing logs")
      const logRes = await createLog({
        shipmentId: shipment.uid,
        createdBy: req.user,
        change: `Appointment Date changed from ${shipment.currentAppointmentDate} to ${updatedShipment.currentAppointmentDate}`,
        remark: `Changes in appointmant date!!`
      })
      console.log(logRes);
    }
    return res.status(200).json({ msg: "Shipment updated successfully", shipment: updatedShipment });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}

async function updateSkusBySipment(req, res){
  const t = await sequelize.transaction();

  try {
    const {shipmentId, skus} = req.body;
    for (const item of skus) {
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
        return res.status(204).json({ errors: errs });
      }
      return res.status(200).json({ msg: "Shipments updated successfully" });
    }

    if(user.role === "admin"){
      for(const shipment of shipments) {
        const { uid, ...updateData } = shipment;
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

    // if(user.role === "warehouse"){
    //   return res.status(200).json({msg: "You are a warehoue"})
    // }

    // return res.status(200).json({msg:`You are a ${user.role}`});
    

  } catch (error) {
    await t.rollback();
    console.error("Error: ", error);
    return res.status(500).json({msg:"Something went wrong while updating Shipments!", error: error.message})
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
    getLogsByShipment
};

