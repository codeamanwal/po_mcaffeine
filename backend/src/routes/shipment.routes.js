import {Router} from "express"
import { shipmentControllers } from "../controllers/shipment.controller.js"
import {getFilterOptions, getShipments, getSkus} from "../controllers/order-filter.controllers.js"
import { downloadSkuDataWithFiltersInCsvFile, downloadShipmentDataWithFiltersInCsvFile, getS3UploadUrl } from "../controllers/file.controllers.js"
import { SuperOrAdminMiddleware } from "../middleware/auth.middleware.js"

const router = Router()

/****************************** Order creation ***********/
router.post("/create-shipment-order", shipmentControllers.createShipment)
router.post("/create-bulk-shipments", shipmentControllers.createBulkShipment)

/****************************** Order fetching ***********/
router.post("/get-sku", getSkus)
router.post("/get-shipment", getShipments)
router.post("/get-skus-by-shipment", shipmentControllers.getSkusByShipment)

/****************************** Filter options ***********/
router.get('/get-filter-options', getFilterOptions)

/****************************** Order updates ***********/
router.post("/update-shipment", shipmentControllers.updateShipment)
router.post("/update-bulk-shipments", shipmentControllers.updateBulkShipment)
router.post("/update-skus-by-shipment", shipmentControllers.updateSkusBySipment)
router.post("/update-bulk-skus", shipmentControllers.updateBulkSku);

/****************************** Order deletion ***********/
router.post("/delete-sku", SuperOrAdminMiddleware, shipmentControllers.deleteSku);
router.post("/delete-shipment", SuperOrAdminMiddleware, shipmentControllers.deleteShipment);

/****************************** Log Routes ***********/
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

/****************************** File Routes ***********/
router.get('/get-upload-url', getS3UploadUrl)
router.post('/download-sku-data', downloadSkuDataWithFiltersInCsvFile)
router.post('/download-shipment-data', downloadShipmentDataWithFiltersInCsvFile)


export const shipmentRouter = router