import express from "express";
import "dotenv/config"
import cors from "cors"
import { adminRouter } from "./routes/admin.routes.js";
import { warehouseRouter } from "./routes/warehouse.routes.js";
import { logisticRouter } from "./routes/logistic.routes.js";
import { connectToDatabase } from "./db/postgresql.js"; // Import DB connection

const app = express();

app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true, 
}));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

const port  = process.env.PORT || 8000;


app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/warehouse", warehouseRouter);
app.use("/api/v1/logistic", logisticRouter);


app.get("/", (req, res) => {
    res.send("Welcome to PO-CMS-Backend");
});

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
//     });