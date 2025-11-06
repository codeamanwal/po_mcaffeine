import jwt from "jsonwebtoken";

export function generateToken(user) {
    try {
        if(!user){
            throw new Error("Please provide user details!")
        }
        return jwt.sign({user}, process.env.JWT_SECRET, {expiresIn: "12d"});
    } catch (error) {
        console.log(error);
        throw error
    }
    
}

export function verifyToken(token) {
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        return decodedToken
    } catch (error) {
        throw error
    }
}