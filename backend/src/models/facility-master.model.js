import { DataTypes } from 'sequelize';
import { sequelize } from '../db/mysql.js';

const FacilityMaster = sequelize.define('FacilityMaster', {
    facility: {
        type: DataTypes.STRING,
        allowNull: true
    },
    pickupLocation: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: true,
    tableName: 'facility_masters'
});

export default FacilityMaster;
