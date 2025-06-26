import { DataTypes } from 'sequelize';
import { sequelize } from '../db/postgresql.js';

const Order = sequelize.define('Order', {
  entryDate: { type: DataTypes.DATE, allowNull: true },
  brand: { type: DataTypes.STRING, allowNull: true },
  channel: { type: DataTypes.STRING, allowNull: true },
  location: { type: DataTypes.STRING, allowNull: true },
  poDate: { type: DataTypes.DATE, allowNull: true },
  poNumber: { type: DataTypes.STRING, allowNull: true },
  srNo: { type: DataTypes.STRING, allowNull: true },
  skuName: { type: DataTypes.STRING, allowNull: true },
  skuCode: { type: DataTypes.STRING, allowNull: true },
  channelSkuCode: { type: DataTypes.STRING, allowNull: true },
  qty: { type: DataTypes.INTEGER, allowNull: true },
  gmv: { type: DataTypes.FLOAT, allowNull: true },
  poValue: { type: DataTypes.FLOAT, allowNull: true },
  actualPoNumber: { type: DataTypes.STRING, allowNull: true },
  updatedQty: { type: DataTypes.INTEGER, allowNull: true },
  updatedGmv: { type: DataTypes.FLOAT, allowNull: true },
  updatedPoValue: { type: DataTypes.FLOAT, allowNull: true },
  facility: { type: DataTypes.STRING, allowNull: true },  // warehouse
  accountsWorking: { type: DataTypes.STRING, allowNull: true },
  channelInwardingQuantity: { type: DataTypes.INTEGER, allowNull: true },
  workingDate: { type: DataTypes.DATE, allowNull: true },
  dispatchDate: { type: DataTypes.DATE, allowNull: true },
  currentAppointmentDate: { type: DataTypes.DATE, allowNull: true },
  statusPlanning: { type: DataTypes.STRING, allowNull: true },
  statusWarehouse: { type: DataTypes.STRING, allowNull: true },
  statusLogistics: { type: DataTypes.STRING, allowNull: true },
  orderNumbers: { type: DataTypes.STRING, allowNull: true }, // Order No 1|Order No 2|Order No 3
  poNumberInwardCWH: { type: DataTypes.STRING, allowNull: true },
  invoiceLink: { type: DataTypes.STRING, allowNull: true },
  cnLink: { type: DataTypes.STRING, allowNull: true },
  maxPoEntryCount: { type: DataTypes.INTEGER, allowNull: true },
  poCheck: { type: DataTypes.STRING, allowNull: true },
  temp: { type: DataTypes.STRING, allowNull: true },
  inwardPos: { type: DataTypes.STRING, allowNull: true },
  sku: { type: DataTypes.STRING, allowNull: true },
  uidDb: { type: DataTypes.STRING, allowNull: true },
  channelType: { type: DataTypes.STRING, allowNull: true },
  actualWeight: {type: DataTypes.STRING, allowNull: true},	
  check: {type: DataTypes.STRING, allowNull: true},
}, {
  timestamps: true,
  tableName: 'orders'
});

export default Order;