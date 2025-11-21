import { DataTypes } from 'sequelize';
import { sequelize } from '../db/mysql.js';

const SkuMaster = sequelize.define('SkuMaster', {
    channel: {
        type: DataTypes.STRING,
        allowNull: true
    },
    skuCode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    skuName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    channelSkuCode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    brand: {
        type: DataTypes.STRING,
        allowNull: true
    },
    mrp: {
        type: DataTypes.FLOAT,
        allowNull: true
    }
}, {
    timestamps: true,
    tableName: 'sku_masters'
});

export default SkuMaster;
