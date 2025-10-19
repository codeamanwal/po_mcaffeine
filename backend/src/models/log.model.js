import { ARRAY, DataTypes } from 'sequelize';
import { sequelize } from '../db/postgresql.js';
// import { sequelize } from '../db/mysql.js';

import ShipmentOrder from './shipment-order.model.js';

const Log = sequelize.define('Log', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  createdBy: {
    type:DataTypes.INTEGER,
    allowNull: false,
  },
  messages: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: [],
  },
  shipmentOrderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  }
}, {
  timestamps: true,
  tableName: 'logs'
});

export default Log;