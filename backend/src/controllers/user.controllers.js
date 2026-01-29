import User  from "../models/user.model.js";

async function createUser(req, res) {
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

        // Role base Protection
        if(role === "admin" || role === "superadmin") {
            if(req.user.role !== "superadmin") {
                return res.status(400).json({msg:"You are not authorized to create admin", success: false, status: 400})
            }
        }

        if(role === "logistic" || role === "warehouse") {
            if(req.user.role !== "admin" && req.user.role !== "superadmin") {
                return res.status(400).json({msg:"You are not authorized to create user", success: false, status: 400})
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

async function deleteUser(req, res) {
    try {
        const body = req.body;
        if(!body) {
            return res.status(400).json({msg:"Please enter the details", success: false, status: 400})
        }

        const {id} = body
        if(!id) {
            return res.status(400).json({msg:"Please enter name, email, password & role", success: false, status: 400})
        }

        const existingUser = await User.findOne({where: {id: id}})
        if(!existingUser) {
            return res.status(400).json({msg:"User does not exist", success: false, status: 400})
        }

        if(existingUser.id === req.user.id) {
            return res.status(400).json({msg:"You cannot delete yourself", success: false, status: 400})
        }

        if(existingUser.role === "superadmin" && req.user.role !== "superadmin") {
            return res.status(400).json({msg:"You cannot delete superadmin", success: false, status: 400})
        }

        if(existingUser.role === "admin") {
            if(req.user.role !== "superadmin") {
                return res.status(400).json({msg:"You are not authorized to delete admin", success: false, status: 400})
            }
        }

        if(existingUser.role === "logistic" || existingUser.role === "warehouse") {
            if(req.user.role !== "admin" && req.user.role !== "superadmin") {
                return res.status(400).json({msg:"You are not authorized to delete user", success: false, status: 400})
            }
        }

        const deletedUser = await User.destroy({ where: {id: id}})
        return res.status(200).json({msg:"User deleted successfully", deletedUser:deletedUser, success: true, status: 200})
    } catch (error) {
        console.log(error)
        return res.status(500).json({msg:"Something went wrong while deleting user", success: false, status: 500})
    }
}

async function changeYourPassword(req, res) {
    try {
        const body = req.body;
        if(!body) {
            return res.status(400).json({msg:"Please enter the details", success: false, status: 400})
        }

        const {currentPassword, newPassword} = body
        if(!currentPassword || !newPassword) {
            return res.status(400).json({msg:"Please enter current password and new password", success: false, status: 400})
        }

        const existingUser = await User.findOne({where: {id: req.user.id}})
        if(!existingUser) {
            return res.status(400).json({msg:"User does not exist", success: false, status: 400})
        }

        if(existingUser.password !== currentPassword) {
            return res.status(400).json({msg:"Current password is incorrect", success: false, status: 400})
        }

        if(existingUser.password === newPassword) {
            return res.status(400).json({msg:"New password cannot be same as current password", success: false, status: 400})
        }

        const updatedUser = await User.update({password: newPassword}, {where: {id: req.user.id}})
        return res.status(200).json({msg:"Password changed successfully", success: true, status: 200})
    } catch (error) {
        console.log(error);
        return res.status(500).json({msg:"Something went wrong!", success: false, error, status: 500})
    }
}

async function getAllUsers(req, res){
    try {
        let users = await User.findAll();
        // remove password from all the users
        const usersWithoutPass = users.map(u => {
            return { 
                ...u.toJSON(),
                // password: "..."
            }
        })
        return res.status(200).json({msg:"Data fetched successfully", users: usersWithoutPass, success: true, status: 200})
    } catch (error) {
        return res.status(500).json({msg:"Something went wrong While fetcing data!", success: false, error, status: 500})
    }
}

async function getUser(req, res) {
    try {
        const user = req.user;
        const {password, ...publicUser} = user.toJSON();
        return res.status(200).json({msg:"Data fetched successfully", user: publicUser, success: true, status: 200})
    } catch (error) {
        return res.status(500).json({msg:"Something went wrong While fetcing data!", success: false, error, status: 500})
    }
}

async function updateUser(req, res) {
    try {
        const loggedInUser = req.user;
        if(!(loggedInUser.role === "superadmin" || loggedInUser.role === "admin")){
            return res.status(400).json({msg: "User do not have perission to make these changes!"})
        }

        const body = req.body;
        if(!body) {
            return res.status(400).json({msg:"Please enter the details", success: false, status: 400})
        }

        const {name, email, role, allotedFacilities, id} = body
        if(!id){
            return res.status(400).json({msg:"Please enter the details", success: false, status: 400})
        }

        const existingUser = await User.findByPk(id);
        if(!existingUser) {
            return res.status(404).json({msg:"No such user exist"})
        }

        const updatedData = {
            name: name ?? existingUser.name,
            email: email ?? existingUser.email,
            role: role ?? existingUser.role,
            allotedFacilities: allotedFacilities?.length > 0 ? allotedFacilities : existingUser.allotedFacilities,
        }

        // check if user is trying to change role to superadmin
        if(updatedData.role === "superadmin" && loggedInUser.role !== "superadmin") {
            return res.status(400).json({msg: "You are not authorized to change role to superadmin"})
        }
        if(updatedData.role === "admin" && loggedInUser.role !== "superadmin") {
            return res.status(400).json({msg: "You are not authorized to change role to admin"})
        }

        const updatedUser = await existingUser.update(updatedData)
        const {password, ...publicUser} = updatedUser.toJSON();

        return res.status(200).json({msg:"User updated successfully", updatedUser: publicUser, success: true, status: 200})
    } catch (error) {
        return res.status(500).json({msg:"Something went wrong while updating data", success: false, error, status: 500})
    }
}

export const userControllers = {
    createUser,
    deleteUser, 
    changeYourPassword, 
    getAllUsers,
    getUser,
    updateUser
}