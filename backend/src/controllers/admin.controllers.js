import { generateToken, verifyToken } from "../utils/jwt.js"
import User from "../models/user.model.js";
import Order from "../models/order.model.js";
import csv from "csv-parser";
import fs from "fs";


async function createAdmin (req, res) {
    try {
        // console.log(req.body);
        const {name, email, password} = req.body;
        if(!name || !email || !password) {
            return res.status(400).json({msg:"Please enter name, email and password", success: false, status: 400})
        }
        if(name?.trim() === "" || email?.trim() === "" || password?.trim() === "") {
            return res.status(400).json({msg:"Please enter name, email and password", success: false, status: 400})
        }

        const existingUser = await User.findOne({where: {email: email}})
        if(existingUser) {
            return res.status(400).json({msg:"Admin already exists", success: false, status: 400})
        }

        const newUser = await User.create({
            name:name,
            email:email,
            password:password,
            role: "admin",
            permissions: ["all"]
        })

        return res.status(201).json({
            msg: "Admin created successfully",
            user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }, 
            success: true, 
            status: 201 
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({msg:"Admin creation failed", success: false, error, status: 500})
    }
}
async function login(req, res) {
    try {

        const {email, password} = req.body
        if(email === "", password === "") {
            return res.status(400).json({msg:"Please enter email and password", success: false, status: 400})
        }

        if(email === "admin@email.com" && password === "admin@123") {
            const user = {name:"admin", email: "admin@email.com", role: "admin"}
            const publicUser = {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
            const token = generateToken(publicUser)
            // console.log(token)
            if(!token){
                return res.status(500).json({msg:"Something went wrong while setting token!", success: false, status: 500})
            }
            res.cookie('token', token, {
                // httpOnly: true,
                // secure: process.env.NODE_ENV === 'production', // Only use secure in production
                sameSite: 'strict',
                maxAge: 3600 * 1000, // 1 hour
                path: '/',
            });
            res.header("Authorization", `Bearer ${token}`)
            
            return res.status(200).json({msg:"Login successful", token:token, success: true, status: 200}, 200)
        }

        const user = await User.findOne({where: {email: email}})
        if(user && user.password === password) {
            const publicUser = {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
            const token = generateToken(publicUser)
            res.cookie('token', token, {
                // httpOnly: true,
                // secure: process.env.NODE_ENV === 'production', // Only use secure in production
                sameSite: 'strict',
                maxAge: 3600 * 1000, // 1 hour
                path: '/',
            });
            res.header("Authorization", `Bearer ${token}`)
            return res.status(200).json({msg:"Login successful", token:token, success: true, status: 200})
        }

        return res.status(404).json({msg:"Invalid email or password", success: false, status: 400})
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({msg:"", success: false, error, status: 500})
    }
}

async function createWareHouse(req,res) {
    try {
        const jwttoken = req.headers.authorization
        // const {token}  = req.body
        const token = jwttoken.split(" ")[1]
        console.log(jwttoken);
        console.log(token);

        const decodedToken = verifyToken(token);
        console.log(decodedToken); 

        if (decodedToken.user.role !== "admin") {
            return res.json({msg:"You are not authorized to create warehouse", success: false, status: 400})
        }

        const {name, email, password} = req.body
        if(!name || !email || !password) {
            return res.status(400).json({msg:"Please enter name, email and password", success: false, status: 400})
        }
        if(name?.trim() === "" || email?.trim() === "" || password?.trim() === "") {
            return res.status(400).json({msg:"Please enter name, email and password", success: false, status: 400})
        }

        const existingUser = await User.findOne({where: {email: email}})
        if(existingUser) {
            return res.status(400).json({msg:"Admin already exists", success: false, status: 400})
        }

        const newUser = await User.create({
            name:name,
            email:email,
            password:password,
            role: "warehouse",
        })

        return res.status(201).json({
            msg: "Warehouse created successfully",
            user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }, 
            success: true, 
            status: 201 
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({msg:"", success: false, error, status: 500})
    }
}

async function createLogistic(req,res) {
    try {
        const jwttoken = req.headers.authorization
        // const {token}  = req.body
        const token = jwttoken.split(" ")[1]
        console.log(jwttoken);
        console.log(token);

        const decodedToken = verifyToken(token);
        console.log(decodedToken); 

        if (decodedToken.user.role !== "admin" && decodedToken.user.role !== "warehouse") {
            return res.status(401).json({msg:"You are not authorized to create warehouse", success: false, status: 400})
        }

        const {name, email, password} = req.body
        if(!name || !email || !password) {
            return res.status(400).json({msg:"Please enter name, email and password", success: false, status: 400})
        }
        if(name?.trim() === "" || email?.trim() === "" || password?.trim() === "") {
            return res.status(400).json({msg:"Please enter name, email and password", success: false, status: 400})
        }

        const existingUser = await User.findOne({where: {email: email}})
        if(existingUser) {
            return res.status(400).json({msg:"Admin already exists", success: false, status: 400})
        }

        const newUser = await User.create({
            name:name,
            email:email,
            password:password,
            role: "logistic",
        })

        return res.status(201).json({
            msg: "Logistic channel created successfully",
            user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }, 
            success: true, 
            status: 201 
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({msg:"", success: false, error, status: 500})
    }
}

async function getAllWareHouses(req, res){
    try {
        const token = req.headers?.authorization?.split(" ")[1];

        if(!token){
            return res.status(401).json({msg:"Unauthorized", success: false, status: 401})
        }

        const decodedToken = verifyToken(token);
        if (decodedToken.user.role !== "admin") {
            return res.status(401).json({msg:"You are not authorized for this action!", success: false, status: 401})
        }

        const warehouses = await User.findAll({where: {role: "warehouse"}})
        return res.status(200).json({msg:"Data fetched successfully", warehouses, success: true, status: 200})

    } catch (error) {
        console.log(error);
        return res.status(500).json({msg:"Something went wrong While fetcing data!", success: false, error, status: 500})
    }
}

async function getAllLogistics(req,res) {
    try {
        
        const token = req.headers?.authorization?.split(" ")[1];

        if(!token){
            return res.status(401).json({msg:"Unauthorized", success: false, status: 401})
        }

        const decodedToken = verifyToken(token);
        if (decodedToken.user.role !== "admin" || decodedToken.user.role !== "warehouse") {
            return res.status(401).json({msg:"You are not authorized for this action!", success: false, status: 401})
        }

        const logistics = await User.findAll({where: {role: "logistic"}})
        return res.status(200).json({msg:"Data fetched successfully", logistics, success: true, status: 200})

    } catch (error) {
        console.log(error);
        return res.status(500).json({msg:"Something went wrong While fetcing data!", success: false, error, status: 500})
    }
}


// Create a single order
export async function createOrder(req, res) {
    try {
        const orderData = req.body;
        const newOrder = await Order.create(orderData);
        return res.json({
            msg: "Order created successfully",
            order: newOrder,
            success: true,
            status: 201
        });
    } catch (error) {
        return res.json({
            msg: "Order creation failed",
            success: false,
            error: error.message,
            status: 500
        });
    }
}

// Bulk order creation from CSV file
export async function bulkCreateOrders(req, res) {
    try {
        if (!req.file) {
            return res.json({ msg: "CSV file is required", success: false, status: 400 });
        }

        const orders = [];
        fs.createReadStream(req.file.path)
            .pipe(csv())
            .on("data", (row) => {
                // Map CSV columns to Order fields as needed
                orders.push({
                    entryDate: row['Entry Date'],
                    brand: row['Brand'],
                    channel: row['Channel'],
                    location: row['Location'],
                    poDate: row['PO Date'],
                    poNumber: row['PO Number'],
                    srNo: row['Sr/ No'],
                    skuName: row['SKU Name'],
                    skuCode: row['SKU Code'],
                    channelSkuCode: row['Channel SKU Code'],
                    qty: row['Qty'],
                    gmv: row['GMV'],
                    poValue: row['PO Value'],
                    actualPoNumber: row['Actual PO Number'],
                    updatedQty: row['Updated Qty'],
                    updatedGmv: row['Updated GMV'],
                    updatedPoValue: row['Updated PO Value'],
                    facility: row['Facility'],
                    accountsWorking: row['Accounts Working'],
                    channelInwardingQuantity: row['Channel Inwarding Quantity'],
                    workingDate: row['Working Date'],
                    dispatchDate: row['Dispatch Date'],
                    currentAppointmentDate: row['Current Appointment Date'],
                    statusPlanning: row['Status (Planning)'],
                    statusWarehouse: row['Status (Warehouse)'],
                    statusLogistics: row['Status (Logistics)'],
                    orderNumbers: row['Order No 1|Order No 2|Order No 3'],
                    poNumberInwardCWH: row['PO Number (Inward - CWH)'],
                    invoiceLink: row['Invoice Link'],
                    cnLink: row['CN Link'],
                    maxPoEntryCount: row['Max. PO Entry Count'],
                    poCheck: row['PO Check'],
                    temp: row['Temp'],
                    inwardPos: row['Inward Pos'],
                    sku: row['SKU'],
                    uidDb: row['UID_DB'],
                    channelType: row['Channel Type'],
                    actualWeight: row['Actual Weight'],
                    check: row['Check']
                });
            })
            .on("end", async () => {
                try {
                    const createdOrders = await Order.bulkCreate(orders);
                    return res.json({
                        msg: "Bulk orders created successfully",
                        count: createdOrders.length,
                        success: true,
                        status: 201
                    });
                } catch (err) {
                    return res.json({
                        msg: "Bulk order creation failed",
                        success: false,
                        error: err.message,
                        status: 500
                    });
                }
            })
            .on("error", (err) => {
                return res.json({
                    msg: "Error reading CSV file",
                    success: false,
                    error: err.message,
                    status: 500
                });
            });
    } catch (error) {
        return res.json({
            msg: "Bulk order creation failed",
            success: false,
            error: error.message,
            status: 500
        });
    }
}


export const adminController = {
    createAdmin,
    login,
    createWareHouse,
    createLogistic,

    getAllWareHouses,
    getAllLogistics,

    createOrder,
    bulkCreateOrders
}