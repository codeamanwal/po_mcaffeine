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

export async function getMasterCourierPartnerOptions () {
    try{
        const res = await api.get(`${baseUrl}/api/v1/master/courier-partner/search?attributes=courierPartnerMode`)
        const apiData = res.data
        const data = res.data.data
        const options = [... new Set(data.map(item => item.courierPartnerMode))]
        return options
    } catch (error) {
        console.error("ERROR GETTING COURIER PARTNER OPTIONS",error)
        return []
    }
}

/********************************************** Courier partner options ***************************/
// const courierPartners = [
//   {
//     name: "Rivigo - PTL",
//     partner: "Rivigo",
//     courierMode: "PTL",
//     appointmentChargeYes: 700,
//     appointmentChargeNo: 0,
//     docketCharges: 80,
//     type: "Type A",
//     tat: 1,
//   },
// ];

// returns array of all the option for corrier partner
/*
Substitute of getAllCourierPartners from constant/courier-partners.js
*/
export async function getAllMasterCourierPartners(){
    try {
        const res = await api.get(`${baseUrl}/api/v1/master/courier-partner/`)
        const apiData = res.data
        const data = res.data.data
        // console.log(data)
        return data
    } catch (error) {
        throw error
    }
}

export async function getPickupLocationFromFacilityMaster(facility){
    try {
        const res = await api.get(`${baseUrl}/api/v1/master/facility/search?facility=${facility}`)
        const data = res.data.data
        console.log(data)
        return data
    } catch (error) {
        throw error
    }
}

export async function getAllMasterCourierPartnerOptions(){
    try {
        const res = await api.get(`${baseUrl}/api/v1/master/courier-partner/search?attributes=courierPartnerMode`)
        const apiData = res.data
        const data = res.data.data
        const options = [... new Set(data.map(item => item?.courierPartnerMode ?? null))]
        return options
    } catch (error) {
        throw error
    }
}

// returns docket chages of a courier partner
/*
Substitute of getDocketCharges from constant/courier-partners.js
*/
export async function getMasterDocketCharges(partnerName=null){
     try {
        const res = await api.get(`${baseUrl}/api/v1/master/courier-partner/search?courierPartnerMode=${partnerName}`)
        const apiData = res.data
        const data = res.data.data
        let docketCharge = 0;
        for(let i=0; i<data.length; i++){
            if(docketCharge >= data[i].docketCharges){
                continue
            }else {
                docketCharge = data[i].docketCharges
            }
        }
        // console.log(`for partner ${partnerName} the docket charge is ${docketCharge}`)
        return docketCharge
    } catch (error) {
        console.log(error)
        throw error
    }
    // if(!partnerName) return 0;
    // const option = courierPartners.find(item => item.name === partnerName)
    // return option?.docketCharges ?? null;
}

/*
Substitute of getCourierType from constant/courier-partners.js
*/
export async function getMasterCourierType(partnerName){
    try {
        const res = await api.get(`${baseUrl}/api/v1/master/courier-partner/search?courierPartnerMode=${partnerName}`)
        const apiData = res.data
        const data = res.data.data
        console.log("partners: ", data)
        let type = data?.at(0)?.courierType ?? null
        // console.log(`for partner ${partnerName} the courier type is ${type}`)
        return type
    } catch (error) {
        console.log(error)
        throw error
    }
}

/*
Substitute of getRates from constant/rates-per-kg.js
*/
export async function getMasterRPKAndTAT(partner, pickupLoc, dropLoc){
    try {
        const res = await api.get(`${baseUrl}/api/v1/master/courier-rates/search?courierPartner=${partner}&pickupLocation=${pickupLoc}&dropLocation=${dropLoc}`)
        const apiData = res.data
        const data = res.data.data
        console.log("rates data: ", data)
        // let type = data[0]?.type ?? null
        // console.log(`for partner ${partner}, pickup location ${pickupLoc} & drop location ${dropLoc} the rates & tat are ${data[0]}`)
        return data?.at(0) ?? {}
    } catch (error) {
        console.log(error)
        throw error
    }
}
/*
return appointment channel type either yes or no
*/
export async function getMasterApptChannel(channel){
    try {
        const res = await api.get(`${baseUrl}/api/v1/master/channel/search?channelCategory=${channel}&channel=${channel}`)
        const apiData = res.data
        const data = res.data.data
        console.log("appt channel type data: ", data)
        // let type = data[0]?.type ?? null
        
        return data.at(0)?.apptChannel ?? null
    } catch (error) {
        console.log(error)
        throw error
    }
}

/*
Substitute of getAppointmentCharges from constant/courier-partners.js
*/
export async function getMasterAppointmentCharges (partnerName,appointmentChannelType) {
    try {
        const res = await api.get(`${baseUrl}/api/v1/master/courier-partner/search?courierPartnerMode=${partnerName}`)
        const apiData = res.data
        const data = res.data.data
        console.log("appt charges data: ", data)
        // let type = data[0]?.type ?? null
        const partnerData = data?.at(0);
        let apptCharge = 0;
        if(appointmentChannelType === "yes"){
            apptCharge = partnerData?.appointmentChargeYes
        }
        else if(appointmentChannelType === "no"){
            apptCharge = partnerData?.appointmentChargeNo
        }

        return apptCharge ?? 0
    } catch (error) {
        console.log(error)
        throw error
    }
    // if(!partnerName) return 0;
    // const option = courierPartners.find(item => item.name === partnerName);
    
    // if(appointmentChannel === "yes") return option?.appointmentChargeYes ?? 0;
    // else return option?.appointmentChargeNo ?? 0;
}

/*
Substitute of getTat from constant/courier-partners.js
*/
export function getMasterTAT (partnerName) {
  // console.log("Getting TAT for courier: ", partnerName);
  if(!partnerName || partnerName == "") return 0;
  const option = courierPartners.find(item => item.name === partnerName);
  return option?.tat ?? 0;
}
