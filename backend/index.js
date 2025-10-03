import express from "express";
import "dotenv/config"
import cors from "cors"
import { adminRouter } from "./src/routes/admin.routes.js";
import { warehouseRouter } from "./src/routes/warehouse.routes.js";
import { logisticRouter } from "./src/routes/logistic.routes.js";
// import { connectToDatabase } from "./src/db/postgresql.js"; // Import DB connection
import { connectToDatabase } from "./src/db/mysql.js";
import { AuthMiddleware, WarehouseMiddleware } from "./src/middleware/auth.middleware.js";
import User from "./src/models/user.model.js";
import { generateToken } from "./src/utils/jwt.js";
import { orderRouter } from "./src/routes/order.routes.js";
import { getPublicUser } from "./src/utils/user.js";
import { userRouter } from "./src/routes/user.routes.js";
import { shipmentRouter } from "./src/routes/shipment.routes.js";

const app = express();

app.use(cors({
  origin: '*', 
  credentials: true, 
}));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

const port  = process.env.PORT || 8000;


app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/warehouse", AuthMiddleware ,warehouseRouter);
app.use("/api/v1/logistic",AuthMiddleware, logisticRouter);

app.use("/api/v1/order", AuthMiddleware, orderRouter);
app.use("/api/v1/user", AuthMiddleware, userRouter);

app.use("/api/v1/shipment", AuthMiddleware, shipmentRouter);




app.get("/", (req, res) => {
    res.send("Welcome to PO-CMS-Backend");
});

app.post("/api/v1/auth/login" ,async (req,res) => {

    try {
       const {email, password} = req.body
        if(email === "", password === "") {
            return res.status(400).json({msg:"Please enter email and password", success: false, status: 400})
        }

        const user = await User.findOne({where: {email: email}})
        if(user && user.password === password) {

            /**************************************************/
            // const {pasword, ...publicUser} = user.toJSON();
            /*************************************************/

            const publicUser = getPublicUser(user.toJSON());

            console.log("publicUser: ", publicUser);

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
    
})

// Connect to DB first, then start server
connectToDatabase().then((res) => {
    console.log(res);
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}).catch((error) => {
    console.error("Failed to start server due to DB connection error:", error);
});

// app.listen(port, () => {
//         console.log(process.env.PORT)
//         console.log(`Server is running on port ${port}`);
// });