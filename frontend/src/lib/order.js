import { getAllOrdersUrl, updateSingleOrderUrl, createShipmentOrderUrl, getShipmentOrderListUrl, getAllSkuOrdersUrl, getShipmentWithSkuOrdersUrl } from "@/constants/urls"
import api from "@/hooks/axios"

export async function createShipmentOrder(data) {
    try {
        const res = await api.post(createShipmentOrderUrl, data);
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
        const res = await api.post(getShipmentWithSkuOrdersUrl, { uid });
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
        const res = await api.get(getAllSkuOrdersUrl);
        return res
    } catch (error) {
        throw error
    }
}

export async function getShipmentStatusList () {
    try {
        const res = await api.get(getShipmentOrderListUrl);
        return res;
    } catch (error) {
        throw error;
    }
}

export async function updateSinglePoOrder (data){
    try {
        const res = await api.post(updateSingleOrderUrl, data);
        return res
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