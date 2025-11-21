import { DataTypes } from 'sequelize';
import { sequelize } from '../db/mysql.js';

const CourierRateMaster = sequelize.define('CourierRateMaster', {
    courierPartner: {
        type: DataTypes.STRING,
        allowNull: true
    },
    pickupLocation: {
        type: DataTypes.STRING,
        allowNull: true
    },
    dropLocation: {
        type: DataTypes.STRING,
        allowNull: true
    },
    ratesPerKg: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    tat: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    timestamps: true,
    tableName: 'courier_rate_masters'
});

export default CourierRateMaster;
