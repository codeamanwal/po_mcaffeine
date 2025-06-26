import { getAllOrdersUrl } from "@/constants/urls"
import api from "@/hooks/axios"

export async function getPoFormatOrderList () {
    try {
        const res = await api.get(getAllOrdersUrl);
        return res
    } catch (error) {
        throw error
    }
}