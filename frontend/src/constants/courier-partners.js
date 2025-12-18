export const courierPartners = [
  {
    name: "Rivigo - PTL",
    partner: "Rivigo",
    courierMode: "PTL",
    appointmentChargeYes: 700,
    appointmentChargeNo: 0,
    docketCharges: 80,
    type: "Type A",
    tat: 1,
  },
  {
    name: "Porter - Local",
    partner: "Porter",
    courierMode: "Local",
    appointmentChargeYes: 0,
    appointmentChargeNo: 0,
    docketCharges: 0,
    type: "Type C",
    tat: 1,
  },
  {
    name: "Tushar - Local",
    partner: "Tushar",
    courierMode: "Local",
    appointmentChargeYes: 0,
    appointmentChargeNo: 0,
    docketCharges: 0,
    type: "Type A",
    tat: 1,
  },
  {
    name: "Blue Dart - PTL",
    partner: "Blue Dart",
    courierMode: "PTL",
    appointmentChargeYes: 0,
    appointmentChargeNo: 0,
    docketCharges: 0,
    type: "Type A",
    tat: 1,
  },
  {
    name: "Om Logistics - PTL",
    partner: "Om Logistics",
    courierMode: "PTL",
    appointmentChargeYes: 0,
    appointmentChargeNo: 0,
    docketCharges: 0,
    type: "Type A",
    tat: 1,
  },
  {
    name: "Rocket Box - PTL",
    partner: "Rocket Box",
    courierMode: "PTL",
    appointmentChargeYes: 0,
    appointmentChargeNo: 0,
    docketCharges: 0,
    type: "Type A",
    tat: 1,
  },
  {
    name: "Dhanaji - Local",
    partner: "Dhanaji",
    courierMode: "Local",
    appointmentChargeYes: 0,
    appointmentChargeNo: 0,
    docketCharges: 0,
    type: "Type A",
    tat: 1,
  },
  {
    name: "Airtrans - Train",
    partner: "Airtrans",
    courierMode: "Train",
    appointmentChargeYes: 0,
    appointmentChargeNo: 0,
    docketCharges: 100,
    type: "Type A",
    tat: 1,
  },
  {
    name: "Airtrans - Air",
    partner: "Airtrans",
    courierMode: "Air",
    appointmentChargeYes: 0,
    appointmentChargeNo: 0,
    docketCharges: 100,
    type: "Type A",
    tat: 1,
  },
  {
    name: "Buraq Logistics - PTL",
    partner: "Buraq Logistics",
    courierMode: "PTL",
    appointmentChargeYes: 500,
    appointmentChargeNo: 0,
    docketCharges: 50,
    type: "Type A",
    tat: 1,
  },
  {
    name: "Buraq Logistics - FTL",
    partner: "Buraq Logistics",
    courierMode: "FTL",
    appointmentChargeYes: 0,
    appointmentChargeNo: 0,
    docketCharges: 50,
    type: "Type C",
    tat: 1,
  },
  {
    name: "Sitics Logistics - FTL",
    partner: "Sitics Logistics",
    courierMode: "FTL",
    appointmentChargeYes: 0,
    appointmentChargeNo: 0,
    docketCharges: 50,
    type: "Type C",
    tat: 1,
  },
  {
    name: "Sitics Logistics - PTL",
    partner: "Sitics Logistics",
    courierMode: "PTL",
    appointmentChargeYes: 450,
    appointmentChargeNo: 0,
    docketCharges: 50,
    type: "Type A",
    tat: 1,
  },
  {
    name: "Sitics Logistics - Train",
    partner: "Sitics Logistics",
    courierMode: "Train",
    appointmentChargeYes: 500,
    appointmentChargeNo: 500,
    docketCharges: 50,
    type: "Type A",
    tat: 1,
  },
  {
    name: "Sitics Logistics - Air",
    partner: "Sitics Logistics",
    courierMode: "Air",
    appointmentChargeYes: 0,
    appointmentChargeNo: 0,
    docketCharges: 50,
    type: "Type A",
    tat: 1,
  },
  {
    name: "Everest Logistics - PTL",
    partner: "Everest Logistics",
    courierMode: "PTL",
    appointmentChargeYes: 0,
    appointmentChargeNo: 0,
    docketCharges: 50,
    type: "Type B",
    tat: 1,
  },
  {
    name: "Everest Logistics - Train",
    partner: "Everest Logistics",
    courierMode: "Train",
    appointmentChargeYes: 0,
    appointmentChargeNo: 0,
    docketCharges: 50,
    type: "Type B",
    tat: 1,
  },
  {
    name: "Everest Logistics - Air",
    partner: "Everest Logistics",
    courierMode: "Air",
    appointmentChargeYes: 0,
    appointmentChargeNo: 0,
    docketCharges: 50,
    type: "Type B",
    tat: 1,
  },
  {
    name: "Shiprocket - PTL",
    partner: "Shiprocket",
    courierMode: "PTL",
    appointmentChargeYes: 500,
    appointmentChargeNo: 0,
    docketCharges: 75,
    type: "Type A",
    tat: 1,
  }
];

// returns array of all the option for corrier partner
export function getAllCourierPartners(){
    const options = courierPartners.map((option) => option.name);
    return options;
}

// returns docket chages of a courier partner
export function getDocketCharges(partnerName){
    if(!partnerName) return 0;
    const option = courierPartners.find(item => item.name === partnerName)
    return option?.docketCharges ?? null;
}

export function getCourierType(partnerName){
    if(!partnerName) return null;
    const option = courierPartners.find(item => item.name === partnerName);
    return option?.type ?? null;
}

export function getAppointmentCharges (partnerName,appointmentChannel) {
    if(!partnerName) return 0;
    const option = courierPartners.find(item => item.name === partnerName);
    
    if(appointmentChannel === "yes") return option?.appointmentChargeYes ?? 0;
    else return option?.appointmentChargeNo ?? 0;
}

export function getTAT (partnerName) {
  // console.log("Getting TAT for courier: ", partnerName);
  if(!partnerName || partnerName == "") return 0;
  const option = courierPartners.find(item => item.name === partnerName);
  return option?.tat ?? 0;
}

