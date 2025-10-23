import Order from "../models/order.model.js";

function validateOrder ( order ) {
    const non_null_fields = [
        "entryDate",
        "brand",
        "channel",
        "location",
        "poDate",
        "poNumber",
        "srNo",
        "skuName",
        "skuCode",
        "channelSkuCode",
        "qty", 
        "gmv",
        "poValue",
    ]
    for (const field of non_null_fields) {
        if(!order[field]) {
            return false
        }
    }
    return true
}

function formatDateToISO (dateString) {
    // yyyy-MM-dd to Date
    if(!dateString) {
        return null;
    }
    const date = dateString?.split("-");
    if(date.length !== 3) {
        throw new Error("Invalid date format. Please use yyyy-mm-dd.");
    }
    const day = parseInt(date[2], 10);
    const month = parseInt(date[1], 10) - 1; // Months are 0-based in JavaScript
    const year = parseInt(date[0], 10);
    const parsedDate = new Date(year, month, day);
    return parsedDate.toISOString();
}

async function createSingleOrder (req, res) {
    try {
        const body = req.body;
        if(!body) {
            return res.status(400).json({msg:"Please enter the details", success: false, status: 400})
        }

        const isValid = validateOrder(body);
        if(!isValid) {
            return res.status(400).json({msg:"Please enter all the required fields", success: false, status: 400})
        }
        
        const order = {
            entryDate: body.entryDate,
            brand: body.brand,
            channel: body.channel,
            location: body.location,
            poDate: body.poDate,
            poNumber: body.poNumber,
            srNo: body.srNo,
            skuName: body.skuName,
            skuCode: body.skuCode,
            channelSkuCode: body.channelSkuCode,
            qty: body.qty,
            gmv: body.gmv,
            poValue: body.poValue,
        }
        const createdOrder = await Order.create(order);
        
        return res.status(200).json({msg:"Order created successfully", order: createdOrder, success: true, status: 200})

    } catch (error) {
        return res.status(500).json({msg:"Something went wrong", success: false, error, status: 500})
    }
}

async function updateSingleOrder (req, res) {
    try {
        const body = req.body;
        if(!body) {
            return res.status(400).json({msg:"Please enter the details", success: false, status: 400})
        }

        const isValid = validateOrder(body);
        if(!isValid) {
            return res.status(400).json({msg:"Please enter all the required fields", success: false, status: 400})
        }

        const orderId = body.id;
        const order = await Order.findByPk(orderId);
        if(!order) {
            return res.status(404).json({msg:"Order not found", success: false, status: 404})
        }

        // update order
        const updatedOrder = await order.update({
            entryDate: formatDateToISO(body.entryDate),
            brand: body.brand,
            channel: body.channel,
            location: body.location,
            poDate: formatDateToISO(body.poDate),
            poNumber: body.poNumber,
            srNo: body.srNo,
            skuName: body.skuName,
            skuCode: body.skuCode,
            channelSkuCode: body.channelSkuCode,
            qty: body.qty,
            gmv: body.gmv,
            poValue: body.poValue,
            actualPoNumber: body.actualPoNumber,
            updatedQty: body.updatedQty,
            updatedGmv: body.updatedGmv,
            updatedPoValue: body.updatedPoValue,
            facility: body.facility,
            accountsWorking: body.accountsWorking,
            channelInwardingQuantity: body.channelInwardingQuantity,
            workingDate: formatDateToISO(body.workingDate),
            dispatchDate: formatDateToISO(body.dispatchDate),
            currentAppointmentDate: formatDateToISO(body.currentAppointmentDate),
            statusPlanning: body.statusPlanning,
            statusWarehouse: body.statusWarehouse,
            statusLogistics: body.statusLogistics,
            orderNumbers: body.orderNumbers,
            poNumberInwardCWH: body.poNumberInwardCWH,
            maxPoEntryCount: body.maxPoEntryCount,
            poCheck: body.poCheck,
            temp: body.temp,
            inwardPos: body.inwardPos,
            sku: body.sku,
            uidDb: body.uidDb,
            channelType: body.channelType,
            actualWeight: body.actualWeight,
            check: body.check
        });
        if(!updatedOrder) {
            return res.status(500).json({msg:"Something went wrong while updating the order", success: false, status: 500})
        }

        return res.status(200).json({msg:"Order updated successfully", order: updatedOrder, success: true, status: 200})
    } catch (error) {
        console.log(error)
        return res.status(500).json({msg:"Something went wrong while updating the order", success: false, error, status: 500})
    }
}

async function createBulkOrders (req, res) {
    try {
        const body = req.body;
        if(!body) {
            return res.status(400).json({msg:"Please enter the details", success: false, status: 400})
        }

        const recievedOrders = body.orders;
        if(!recievedOrders || recievedOrders.length === 0) {
            return res.status(400).json({msg:"Please enter the orders", success: false, status: 400})
        }

        let isValidOrders = true;
        for (const order of recievedOrders) {
            const isValid = validateOrder(order);
            if(!isValid) {
                isValidOrders = false;
                break;
            }
        }

        if(!isValidOrders){
            return res.status(400).json({msg:"Please enter all the required fields", success: false, status: 400})
        }

        // remove extra fields
        const orders = recievedOrders.map(order => {
            return {
                entryDate: order.entryDate,
                brand: order.brand,
                channel: order.channel,
                location: order.location,
                poDate: order.poDate,
                poNumber: order.poNumber,
                srNo: order.srNo,
                skuName: order.skuName,
                skuCode: order.skuCode,
                channelSkuCode: order.channelSkuCode,
                qty: order.qty,
                gmv: order.gmv,
                poValue: order.poValue,
            }
        })

        // console.log(orders)

        const createdOrders = await Order.bulkCreate(orders);
        
        return res.status(200).json({msg:"Orders created successfully", orders: createdOrders, success: true, status: 200})

    } catch (error) {
        return res.status(500).json({msg:"Something went wrong", success: false, error, status: 500})   
    }
}

async function getAllOrders(req, res){
    try {
        const orders = await Order.findAll();
        return res.status(200).json({msg:"Data fetched successfully", orders, success: true, status: 200})
    } catch (error) {
        return res.status(500).json({msg:"Something went wrong While fetcing data!", success: false, error, status: 500})
    }
}

async function getAllShipments(req, res){
    try {
        const orders = await Order.findAll();
        return res.status(200).json({msg:"Data fetched successfully", orders, success: true, status: 200})
    } catch (error) {
        return res.status(500).json({msg:"Something went wrong While fetcing data!", success: false, error, status: 500})
    }
}

export const orderControllers = {
    createSingleOrder,
    updateSingleOrder,
    createBulkOrders,
    getAllOrders, 
}