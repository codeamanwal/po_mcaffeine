import {Router} from "express"
import { shipmentControllers } from "../controllers/shipment.controller.js"

const router = Router()

router.post("/create-shipment-order", shipmentControllers.createShipment)
router.post("/create-bulk-shipments", shipmentControllers.createBulkShipment)
router.get("/get-all-shipments", shipmentControllers.getAllShipments)
router.post("/get-shipment-with-sku-orders", shipmentControllers.getShipmentWithSkuOrders)
router.get("/get-all-sku-orders", shipmentControllers.getAllSkuOrders)

router.post("/get-skus-by-shipment", shipmentControllers.getSkusByShipment)

router.get("/get-all-data", shipmentControllers.getAllData)

router.post("/update-shipment", shipmentControllers.updateShipment)
router.post("/update-bulk-shipments", shipmentControllers.updateBulkShipment)
router.post("/update-skus-by-shipment", shipmentControllers.updateSkusBySipment)

export const shipmentRouter = router