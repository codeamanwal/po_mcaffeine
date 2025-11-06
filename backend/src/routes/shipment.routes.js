import {Router} from "express"
import { shipmentControllers } from "../controllers/shipment.controller.js"
import {getFilterOptions, getShipments, getSkus} from "../controllers/order-filter.controllers.js"

const router = Router()

router.post("/create-shipment-order", shipmentControllers.createShipment)
router.post("/create-bulk-shipments", shipmentControllers.createBulkShipment)
router.get("/get-all-shipments", shipmentControllers.getAllShipments)
router.post("/get-shipment-with-sku-orders", shipmentControllers.getShipmentWithSkuOrders)
router.get("/get-all-sku-orders", shipmentControllers.getAllSkuOrders)

//paginated sku and shipent order fetch
router.get("/get-sku-orders", shipmentControllers.getPaginatedSkus);
router.get("/get-shipment-orders", shipmentControllers.getPaginatedShipments);

// paginated filtered order fetching
router.post("/get-sku", getSkus)
router.post("/get-shipment", getShipments)
// filter options
router.get('/get-filter-options', getFilterOptions)

router.post("/get-skus-by-shipment", shipmentControllers.getSkusByShipment)

router.get("/get-all-data", shipmentControllers.getAllData)

router.post("/update-shipment", shipmentControllers.updateShipment)
router.post("/update-bulk-shipments", shipmentControllers.updateBulkShipment)
router.post("/update-skus-by-shipment", shipmentControllers.updateSkusBySipment)

router.post("/update-bulk-skus", shipmentControllers.updateBulkSku);

router.post("/delete-sku", shipmentControllers.deleteSku);
router.post("/delete-shipment", shipmentControllers.deleteShipment);

router.post('/get-log', async (req, res) => {
    try {
        const {shipmentId} = req.body;
        if(!shipmentId)
            return res.status(400).json({msg: "No shipment Id is provided!"}); 
        const logs = await shipmentControllers.getLogsByShipment({shipmentId})
        return res.status(200).json({msg: "Logs fetched successfully", logs});
    } catch (error) {
        return res.status(500).json({msg:"Something went wrong while fetching logs!", error});
    }
})

export const shipmentRouter = router