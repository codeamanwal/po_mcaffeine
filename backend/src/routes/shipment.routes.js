import {Router} from "express"
import { shipmentControllers } from "../controllers/shipment.controller.js"

const router = Router()

router.post("/create-shipment-order", shipmentControllers.createShipment)
router.get("/get-all-shipments", shipmentControllers.getAllShipments)

router.get("/get-all-sku-orders", shipmentControllers.getAllSkuOrders)

router.get("/get-all-data", shipmentControllers.getAllData)

export const shipmentRouter = router