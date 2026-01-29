import api from "@/hooks/axios"
import axios from "axios";

export async function createShipmentOrder(data) {
    try {
        const res = await api.post("/api/v1/shipment/create-shipment-order", data);
        return res;
    } catch (error) {
        throw error;
    }
}

export async function createBulkShipment(data) {
    try {
        const res = await api.post("/api/v1/shipment/create-bulk-shipments", { data });
        return res;
    } catch (error) {
        throw error;
    }
}

export async function getShipmentWithSkuOrders(uid) {
    try {
        const res = await api.post("/api/v1/shipment/get-shipment-with-sku-orders", { uid });
        return res;
    } catch (error) {
        throw error;
    }
}

export async function getSkuOrdersByShipment(uid){
    try {
        const res = await api.post("/api/v1/shipment/get-skus-by-shipment", {uid});
        return res;
    } catch (error) {
        throw error
    }
}

export async function updateShipment(data) {
    try {
        const res = await api.post("/api/v1/shipment/update-shipment", data);
        return res;
    } catch (error) {
        throw error;
    }
}

export async function updateBulkShipment(data){
    try {
        const res = await api.post("/api/v1/shipment/update-bulk-shipments", data);
        return res;
    } catch (error) {
        throw error;
    }
}

export async function updateSkusByShipment(data) {
    try {
        const res = await api.post("/api/v1/shipment/update-skus-by-shipment", data);
        return res;
    } catch (error) {
        throw error
    }
}

export async function getPoFormatOrderList () {
    try {
        const res = await api.get("/api/v1/shipment/get-all-sku-orders");
        return res
    } catch (error) {
        throw error
    }
}

export async function getShipmentStatusList () {
    try {
        const res = await api.get(`/api/v1/shipment/get-all-shipments`);
        return res;
    } catch (error) {
        throw error;
    }
}

export async function updateBulkSkus(skus) {
    try {
        const res = await api.post("/api/v1/shipment/update-bulk-skus", skus);
        return res
    } catch (error) {
        throw error
    }
}

export async function deleteSku(id) {
    try {
        const res = await api.post("/api/v1/shipment/delete-sku", {id:id});
        return res;
    } catch (error) {
        throw error
    }
}

export async function deleteShipment(id) {
    try {
        const res = await api.post("/api/v1/shipment/delete-shipment", {uid:id});
        return res;
    } catch (error) {
        throw error
    }
}

export async function getLogsOfShipment(shipmentId){
    try {
        const res = await api.post("/api/v1/shipment/get-log", {shipmentId: shipmentId});
        return res;
    } catch (error) {
        throw error
    }
}

export async function getS3UploadUrl(fileName, fileType) {
    try {
        const res = await api.get(`/api/v1/shipment/get-upload-url?fileName=${fileName}&fileType=${fileType}`)
        return res;
    } catch (error) {
        throw error
    }
}

export async function uploadFileToS3(file, s3UploadUrl){
    if(!file || !s3UploadUrl){
        throw new Error("Provide both the file and s3 upload url!")
    }
    try {
        const res = await axios.put(s3UploadUrl, file, {
            headers: {
                "Content-Type": file?.type
            }
        })
        return res
    } catch (error) {
        throw error
    }
}

export async function sendForgotPasswordEmail (email) {
    try {
        const res = await api.post("/api/v1/forgot-password", {email})
        return res;
    } catch (error) {
        throw error
    }
}