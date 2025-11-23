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

/********************** Function used for Edit shipment modal *******************************/

export async function getMasterFacilityOptions () {
    try {
        const res = await api.get(`${baseUrl}/api/v1/master/facility/search?attributes=facility`)
        const apiData = res.data
        const data = res.data.data
        const facilityOptions = [... new Set(data.map(item => item.facility))]
        return facilityOptions
    } catch (error) {
        console.error("ERROR GETTING MASTER FACILITY OPTIONS",error)
        return []
    }
}

export async function getMasterStatusPlanningOptions () {
    try {
        const res = await api.get(`${baseUrl}/api/v1/master/status/search?attributes=status`)
        const apiData = res.data
        const data = res.data.data
        const statusPlanningOptions = [... new Set(data.map(item => item.status))]
        return statusPlanningOptions
    } catch (error) {
        console.error("ERROR GETTING MASTER STATUS PLANNING OPTIONS",error)
        return []
    }
}

export async function getMasterFinalStatus (statusPlanning, statusWarehouse, statusLogistics) {
    try{
        const res = await api.get(`${baseUrl}/api/v1/master/status/search?statusPlanning=${statusPlanning}&statusWarehouse=${statusWarehouse}&statusLogistics=${statusLogistics}`)
        const apiData = res.data
        const data = res.data.data
        const finalStatus = [... new Set(data.map(item => item.finalStatus))]
        return finalStatus
    } catch (error) {
        console.error("ERROR GETTING MASTER FINAL STATUS",error)
        return []
    }
}