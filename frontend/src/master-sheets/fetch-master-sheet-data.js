import api from "@/hooks/axios"

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

/********************** Function used for Create order Page *******************************/


/*
Returns unique channel options from Master Sheet
*/
export async function getMasterChannelOptions () {
    try {
        const res = await api.get(`${baseUrl}/api/v1/master/channel/search?attributes=channel`)
        const apiData = res.data
        const data = res.data.data
        const channelOptions = [... new Set(data.map(item => item.channel))] 
        return channelOptions
    } catch (error) {
        console.error("ERROR GETTING MASTER CHANNEL OPTIONS",error)
        return []
    }
}

/*
Returns unique location options for a channel from Master Sheet
*/
export async function getAllowedLocationsFromChannel (channelName) {
    if(!channelName || !channelName?.trim()){
        return []
    }
    try {
        const res = await api.get(`${baseUrl}/api/v1/master/channel/search?attributes=channel,channelLocation,dropLocation&channel=${channelName}`)
        const apiData = res.data
        const data = res.data.data
        const allowedLocations = [... new Set(data.map(item => `${item.channelLocation} - ${item.dropLocation}`))] 
        return allowedLocations
    } catch (error) {
        console.error("ERROR GETTING ALLOWED LOCATIONS FROM CHANNEL",error)
        return []
    }
}

/*
Returns sku options aloowed for a channel from Master Sheet
*/
export async function getAllowedSkusFromChannel (channelName) {
    if(!channelName || !channelName?.trim()){
        return []
    }
    try {
        const res = await api.get(`${baseUrl}/api/v1/master/sku/search?attributes=skuCode&channel=${channelName}`)
        const apiData = res.data
        const data = res.data.data
        const allowedSkus = [... new Set(data.map(item => item.skuCode))] 
        return allowedSkus
    } catch (error) {
        console.error("ERROR GETTING ALLOWED SKUS FROM CHANNEL",error)
        return []
    }
} 

/*
Returns sku details for a sku code and channel from Master Sheet
*/
export async function getSkuBySkuCodeAndChannel (skuCode,channelName) {
    if(!skuCode || !skuCode?.trim()){
        return []
    }
    try {
        const res = await api.get(`${baseUrl}/api/v1/master/sku/search?skuCode=${skuCode}&channel=${channelName}`)
        const apiData = res.data
        const data = res.data?.data
        const sku = data?.at(0);
        return sku
    } catch (error) {
        console.error("ERROR GETTING SKU BY SKU CODE",error)
        return []
    }
}

/********************** Function used for Create order Page *******************************/
