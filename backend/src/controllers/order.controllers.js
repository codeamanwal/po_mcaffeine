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

export const orderControllers = {
    createSingleOrder,
    createBulkOrders,
    getAllOrders, 
}