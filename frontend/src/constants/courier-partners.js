export const courierPartners = [
  {
    name: "Rivigo - PTL",
    partner: "Rivigo",
    courierMode: "PTL",
    appointmentChargeYes: 700,
    appointmentChargeNo: 0,
    docketCharges: 80,
    type: "Type A"
  },
  {
    name: "Porter - Local",
    partner: "Porter",
    courierMode: "Local",
    appointmentChargeYes: 0,
    appointmentChargeNo: 0,
    docketCharges: 0,
    type: "Type C"
  },
  {
    name: "Tushar - Local",
    partner: "Tushar",
    courierMode: "Local",
    appointmentChargeYes: 0,
    appointmentChargeNo: 0,
    docketCharges: 0,
    type: "Type A"
  },
  {
    name: "Blue Dart - PTL",
    partner: "Blue Dart",
    courierMode: "PTL",
    appointmentChargeYes: 0,
    appointmentChargeNo: 0,
    docketCharges: 0,
    type: "Type A"
  },
  {
    name: "Om Logistics - PTL",
    partner: "Om Logistics",
    courierMode: "PTL",
    appointmentChargeYes: 0,
    appointmentChargeNo: 0,
    docketCharges: 0,
    type: "Type A"
  },
  {
    name: "Rocket Box - PTL",
    partner: "Rocket Box",
    courierMode: "PTL",
    appointmentChargeYes: 0,
    appointmentChargeNo: 0,
    docketCharges: 0,
    type: "Type A"
  },
  {
    name: "Dhanaji - Local",
    partner: "Dhanaji",
    courierMode: "Local",
    appointmentChargeYes: 0,
    appointmentChargeNo: 0,
    docketCharges: 0,
    type: "Type A"
  },
  {
    name: "Airtrans - Train",
    partner: "Airtrans",
    courierMode: "Train",
    appointmentChargeYes: 0,
    appointmentChargeNo: 0,
    docketCharges: 100,
    type: "Type A"
  },
  {
    name: "Airtrans - Air",
    partner: "Airtrans",
    courierMode: "Air",
    appointmentChargeYes: 0,
    appointmentChargeNo: 0,
    docketCharges: 100,
    type: "Type A"
  },
  {
    name: "Buraq Logistics - PTL",
    partner: "Buraq Logistics",
    courierMode: "PTL",
    appointmentChargeYes: 500,
    appointmentChargeNo: 0,
    docketCharges: 50,
    type: "Type A"
  },
  {
    name: "Buraq Logistics - FTL",
    partner: "Buraq Logistics",
    courierMode: "FTL",
    appointmentChargeYes: 0,
    appointmentChargeNo: 0,
    docketCharges: 50,
    type: "Type C"
  },
  {
    name: "Sitics Logistics - FTL",
    partner: "Sitics Logistics",
    courierMode: "FTL",
    appointmentChargeYes: 0,
    appointmentChargeNo: 0,
    docketCharges: 50,
    type: "Type C"
  },
  {
    name: "Sitics Logistics - PTL",
    partner: "Sitics Logistics",
    courierMode: "PTL",
    appointmentChargeYes: 450,
    appointmentChargeNo: 0,
    docketCharges: 50,
    type: "Type A"
  },
  {
    name: "Sitics Logistics - Train",
    partner: "Sitics Logistics",
    courierMode: "Train",
    appointmentChargeYes: 500,
    appointmentChargeNo: 500,
    docketCharges: 50,
    type: "Type A"
  },
  {
    name: "Sitics Logistics - Air",
    partner: "Sitics Logistics",
    courierMode: "Air",
    appointmentChargeYes: 0,
    appointmentChargeNo: 0,
    docketCharges: 50,
    type: "Type A"
  },
  {
    name: "Everest Logistics - PTL",
    partner: "Everest Logistics",
    courierMode: "PTL",
    appointmentChargeYes: 0,
    appointmentChargeNo: 0,
    docketCharges: 50,
    type: "Type B"
  },
  {
    name: "Everest Logistics - Train",
    partner: "Everest Logistics",
    courierMode: "Train",
    appointmentChargeYes: 0,
    appointmentChargeNo: 0,
    docketCharges: 50,
    type: "Type B"
  },
  {
    name: "Everest Logistics - Air",
    partner: "Everest Logistics",
    courierMode: "Air",
    appointmentChargeYes: 0,
    appointmentChargeNo: 0,
    docketCharges: 50,
    type: "Type B"
  },
  {
    name: "Shiprocket - PTL",
    partner: "Shiprocket",
    courierMode: "PTL",
    appointmentChargeYes: 500,
    appointmentChargeNo: 0,
    docketCharges: 75,
    type: "Type A"
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
    return option.docketCharges;
}

export function getCourierType(partnerName){
    if(!partnerName) return null;
    const option = courierPartners.find(item => item.name === partnerName);
    return option.type;
}

export function getAppointmentCharges (partnerName,appointmentChannel) {
    if(!partnerName) return 0;
    const option = courierPartners.find(item => item.name === partnerName);
    
    if(appointmentChannel === "yes") return option.appointmentChargeYes;
    else return option.appointmentChargeNo;
}

