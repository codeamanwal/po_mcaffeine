import { DataTypes } from 'sequelize';
import { sequelize } from '../db/postgresql.js';
// import { sequelize } from '../db/mysql.js';


const ShipmentOrder = sequelize.define('ShipmentOrder', {
  uid: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  entryDate: { type: DataTypes.STRING, allowNull: false },
  poDate: { type: DataTypes.STRING, allowNull: false },
  facility: { type: DataTypes.STRING },
  channel: { type: DataTypes.STRING },
  location: { type: DataTypes.STRING },
  poNumber: { type: DataTypes.STRING, allowNull: false, unique:true },
  totalUnits: { type: DataTypes.INTEGER },
  brandName: { type: DataTypes.STRING },
  remarksPlanning: { type: DataTypes.TEXT },
  specialRemarksCOPT: { type: DataTypes.TEXT },
  newShipmentReference: { type: DataTypes.STRING },
  statusActive: { type: DataTypes.STRING, defaultValue: "Active" },
  statusPlanning: { type: DataTypes.STRING },
  statusWarehouse: { type: DataTypes.STRING },
  statusLogistics: { type: DataTypes.STRING },
  channelInwardingRemarks: { type: DataTypes.TEXT },
  dispatchRemarksLogistics: { type: DataTypes.TEXT },
  dispatchRemarksWarehouse: { type: DataTypes.TEXT },
  dispatchDateTentative: { type: DataTypes.STRING },
  workingDatePlanner: { type: DataTypes.STRING },
  rtsDate: { type: DataTypes.STRING },
  dispatchDate: { type: DataTypes.STRING },
  currentAppointmentDate: { type: DataTypes.STRING },
  firstAppointmentDate: { type: DataTypes.STRING },
  secondAppointmentDate: { type: DataTypes.STRING },
  thirdAppointmentDate: { type: DataTypes.STRING },
  remarkAp1:{type: DataTypes.TEXT},
  remarkAp2:{type: DataTypes.TEXT},
  remarkAp3:{type: DataTypes.TEXT},
  firstAppointmentDateCOPT: { type: DataTypes.STRING },
  noOfBoxes: { type: DataTypes.INTEGER },
  orderNo1: { type: DataTypes.STRING },
  orderNo2: { type: DataTypes.STRING },
  orderNo3: { type: DataTypes.STRING },
  pickListNo: { type: DataTypes.STRING },
  workingTypeWarehouse: { type: DataTypes.STRING },
  inventoryRemarksWarehouse: { type: DataTypes.TEXT },
  b2bWorkingTeamRemarks: { type: DataTypes.TEXT },
  // common come from sku order and will also update similarly
  actualWeight: { type: DataTypes.FLOAT },
  
  volumetricWeight: { type: DataTypes.FLOAT },
  channelType: { type: DataTypes.STRING },
  firstTransporter: { type: DataTypes.STRING },
  firstDocketNo: { type: DataTypes.STRING },
  secondTransporter: { type: DataTypes.STRING },
  secondDocketNo: { type: DataTypes.STRING },
  thirdTransporter: { type: DataTypes.STRING },
  thirdDocketNo: { type: DataTypes.STRING },
  appointmentLetter: { type: DataTypes.STRING },
  labelsLink: { type: DataTypes.STRING },
  invoiceDate: { type: DataTypes.STRING },
  invoiceLink: { type: DataTypes.STRING },
  cnLink: { type: DataTypes.STRING },
  ewayLink: { type: DataTypes.STRING },
  invoiceValue: { type: DataTypes.FLOAT },
  remarksAccountsTeam: { type: DataTypes.TEXT },
  invoiceChallanNumber: { type: DataTypes.STRING },
  invoiceCheckedBy: { type: DataTypes.STRING },
  tallyCustomerName: { type: DataTypes.STRING },
  customerCode: { type: DataTypes.STRING },
  poEntryCount: { type: DataTypes.INTEGER },
  temp: { type: DataTypes.BOOLEAN },
  deliveryDate: { type: DataTypes.STRING },
  rescheduleLag: { type: DataTypes.INTEGER },
  finalRemarks: { type: DataTypes.TEXT },
  updatedGmv: { type: DataTypes.FLOAT },
  physicalWeight: { type: DataTypes.FLOAT },
  deliveryCharges: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  halting: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  unloadingCharges: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  dedicatedVehicle: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  otherCharges: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  document: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  proofOfDispatch: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  proofOfDelivery: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  rpk: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },

  // apointment dates
  allAppointmentDate: {type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true},
  appointmentRemarks: {type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true},
  // old po numbers
  poNumbers: {type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true},
  // delivery type
  deliveryType: {type: DataTypes.STRING, allowNull: true},
}, {
  timestamps: true,
  tableName: 'shipment_orders'
});

ShipmentOrder.associate = models => {
    ShipmentOrder.hasMany(models.SkuOrder, {
      foreignKey: 'shipmentOrderId',
      as: 'skuOrders'
    });
};

export default ShipmentOrder;