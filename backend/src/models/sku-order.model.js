import { DataTypes } from 'sequelize';
import { sequelize } from '../db/postgresql.js';
// import { sequelize } from '../db/mysql.js';


const SkuOrder = sequelize.define('SkuOrder', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  srNo: { type: DataTypes.STRING },
  skuName: { type: DataTypes.STRING },
  skuCode: { type: DataTypes.STRING },
  channelSkuCode: { type: DataTypes.STRING },
  brandName: {type: DataTypes.STRING, allowNull: false},
  qty: { type: DataTypes.INTEGER },
  gmv: { type: DataTypes.FLOAT },
  poValue: { type: DataTypes.FLOAT },
  // updated datafields
  updatedQty: { type: DataTypes.INTEGER },
  updatedGmv: { type: DataTypes.FLOAT },
  updatedPoValue: { type: DataTypes.FLOAT },

  accountsWorking: { type: DataTypes.STRING },
  channelInwardingQuantity: { type: DataTypes.INTEGER },
  actualWeight: { type: DataTypes.FLOAT },
}, {
  timestamps: true,
  tableName: 'sku_orders'
});

SkuOrder.associate = models => {
    SkuOrder.belongsTo(models.ShipmentOrder, {
      foreignKey: 'shipmentOrderId',
      as: 'shipmentOrder'
    });
};

export default SkuOrder;