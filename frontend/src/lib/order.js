import { getAllOrdersUrl, updateSingleOrderUrl, createShipmentOrderUrl, getShipmentOrderListUrl, getAllSkuOrdersUrl } from "@/constants/urls"
import api from "@/hooks/axios"

export async function createShipmentOrder(data) {
    try {
        const res = await api.post(createShipmentOrderUrl, data);
        return res;
    } catch (error) {
        throw error;
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