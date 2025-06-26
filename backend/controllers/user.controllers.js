import { User } from "../models/user.model.js";

export async function createUser(req, res) {
    try {
        const body = req.body;
        if(!body) {
            return res.status(400).json({msg:"Please enter the details", success: false, status: 400})
        }

        const {name, email, password, role} = body
        if(!name || !email || !password) {
            return res.status(400).json({msg:"Please enter name, email, password & role", success: false, status: 400})
        }

        if(name?.trim() === "" || email?.trim() === "" || password?.trim() === "" || role?.trim() === "") {
            return res.status(400).json({msg:"Please enter name, email, password & role", success: false, status: 400})
        }

        const existingUser = await User.findOne({where: {email: email}})
        if(existingUser) {
            return res.status(400).json({msg:"User already exists", success: false, status: 400})
        }

        if(role === "admin"){
            if(req.user.role !== "superadmin") {
                return res.status(400).json({msg:"You are not authorized to create admin", success: false, status: 400})
            }
        }

        if(role === "logistic" || role === "warehouse") {
            if(req.user.role !== "admin" || req.user.role !== "superadmin") {
                return res.status(400).json({msg:"You are not authorized to create logistic", success: false, status: 400})
            }
        }

        const newUser = await User.create({
            name:name,
            email:email,
            password:password,
            role:role
        })

        let user = {};
        {
            let {password, ...publicUser} = newUser.toJSON();
            user = publicUser;
        }
        return res.status(201).json({msg:"User created successfully", user:user, success: true, status: 201})

    } catch (error) {
       return res.status(500).json({msg:"Something went wrong", success: false, status: 500}) 
    }
}