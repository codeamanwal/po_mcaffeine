
import { sequelize } from "../db/postgresql.js";
import {ShipmentOrder} from "../models/index.js";
import {SkuOrder} from "../models/index.js";

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

export const shipmentControllers = {
    createShipment,
    getAllShipments,
    getAllSkuOrders,
    getAllData,
};

