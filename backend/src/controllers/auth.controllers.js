import User from "../models/user.model";

async function loginUser( req, res ) {
    try {
       const {email, password} = req.body
        if(email === "", password === "") {
            return res.status(400).json({msg:"Please enter email and password", success: false, status: 400})
        }

        const user = await User.findOne({where: {email: email}})
        if(user && user.password === password) {

            /**************************************************/
            const {pasword, ...publicUser} = user.toJSON();
            /*************************************************/

            const token = generateToken(publicUser)
            res.cookie('token', token, {
                // httpOnly: true,
                // secure: process.env.NODE_ENV === 'production', // Only use secure in production
                sameSite: 'strict',
                maxAge: 3600 * 1000, // 1 hour
                path: '/',
            });
            res.header("Authorization", `Bearer ${token}`)
            return res.status(200).json({msg:"Login successful", user:publicUser, token:token, success: true, status: 200})
        }
        return res.status(404).json({msg:"Invalid email or password", success: false, status: 400}) 
    } catch (error) {
        console.log(error)
        return res.status(500).json({msg:"Something went wrong", success: false, status: 500})
    }
}
