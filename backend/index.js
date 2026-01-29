import express from "express";
import "dotenv/config"
import cors from "cors"
import { connectToDatabase } from "./src/db/mysql.js";
import { AuthMiddleware } from "./src/middleware/auth.middleware.js";
import { userRouter } from "./src/routes/user.routes.js";
import { shipmentRouter } from "./src/routes/shipment.routes.js";
import { masterRouter } from "./src/routes/master.routes.js";
import { sendForgotPasswordMail } from "./src/controllers/mail.controllers.js";
import { authController } from "./src/controllers/auth.controllers.js";

const app = express();

// middleware
app.use(cors({
    origin: '*',
    credentials: true,
}));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const port = process.env.PORT || 8000;

// api routes
app.use("/api/v1/user", AuthMiddleware, userRouter);
app.use("/api/v1/shipment", AuthMiddleware, shipmentRouter);
app.use("/api/v1/master", AuthMiddleware, masterRouter);

// custom routes
app.get("/", (req, res) => {
    res.send("Welcome to PO-CMS-Backend");
});

app.post("/api/v1/auth/login", authController.loginUser)
app.post("/api/v1/forgot-password", sendForgotPasswordMail);


// Connect to DB first, then start server
connectToDatabase().then((res) => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}).catch((error) => {
    console.error("Failed to start server due to DB connection error:", error);
    process.exit(1)
});