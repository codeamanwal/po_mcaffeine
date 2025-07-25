import { DataTypes } from 'sequelize';
import { sequelize } from '../db/postgresql.js';

const ShipmentOrder = sequelize.define('ShipmentOrder', {
  uid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  entryDate: { type: DataTypes.STRING, allowNull: false },
  poDate: { type: DataTypes.STRING, allowNull: false },
  facility: { type: DataTypes.STRING },
  channel: { type: DataTypes.STRING },
  location: { type: DataTypes.STRING },
  poNumber: { type: DataTypes.STRING, allowNull: false },
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
  firstAppointmentDateCOPT: { type: DataTypes.STRING },
  noOfBoxes: { type: DataTypes.INTEGER },
  orderNo1: { type: DataTypes.STRING },
  orderNo2: { type: DataTypes.STRING },
  orderNo3: { type: DataTypes.STRING },
  pickListNo: { type: DataTypes.STRING },
  workingTypeWarehouse: { type: DataTypes.STRING },
  inventoryRemarksWarehouse: { type: DataTypes.TEXT },
  b2bWorkingTeamRemarks: { type: DataTypes.TEXT },
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
  physicalWeight: { type: DataTypes.FLOAT }
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