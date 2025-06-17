import User from "../models/user.model.js"
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

export const logisticController = {
    login,
    
}