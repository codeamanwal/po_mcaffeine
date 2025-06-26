import User from "../models/user.model.js"
import Order from "../models/order.model.js";
import { generateToken, verifyToken } from "../utils/jwt.js"

async function login(req,res) {
    try {
        const body = req.body
        const email = body?.email
        const password = body?.password
        if(!email || !password) {
            return res.status(400).json({msg:"Please enter email and password", success: false, status: 400})
        }

        const user = await User.findOne({where: {email: email}})
        if(user && user.password === password) {
            if(user.role !== "logistic") {
                return res.status(400).json({msg:"You are not authorized to login", success: false, status: 400})
            }
            const token = generateToken(user)
            res.header("Authorization", `Bearer ${token}`)
            return res.status(200).json({msg:"Login successful", token:token, success: true, status: 200})
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({msg:"Something went wrong!", success: false, error, status: 500})
    }
}

async function updateLogisticStatus(req, res) {
    try {
        const { orderId, statusLogistics } = req.body;
        if (!orderId || !statusLogistics) {
            return res.json({ msg: "Order ID and statusLogistics are required", success: false, status: 400 });
        }
        const order = await Order.findByPk(orderId);
        if (!order) {
            return res.json({ msg: "Order not found", success: false, status: 404 });
        }
        order.statusLogistics = statusLogistics;
        await order.save();
        return res.json({ msg: "Logistics status updated", order, success: true, status: 200 });
    } catch (error) {
        return res.json({ msg: "Failed to update logistics status", success: false, error: error.message, status: 500 });
    }
}

export const logisticController = {
    login,
    updateLogisticStatus,
}