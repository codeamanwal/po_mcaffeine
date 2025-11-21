import { DataTypes } from 'sequelize';
import { sequelize } from '../db/mysql.js';

const CourierPartnerMaster = sequelize.define('CourierPartnerMaster', {
    courierPartnerMode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    courierPartner: {
        type: DataTypes.STRING,
        allowNull: true
    },
    courierMode: {
        type: DataTypes.STRING,
        allowNull: true
    },
    appointmentChargeYes: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    appointmentChargeNo: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    docketCharges: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    courierType: {
        type: DataTypes.FLOAT,
        allowNull: true
    }
}, {
    timestamps: true,
    tableName: 'courier_partner_masters'
});

export default CourierPartnerMaster;
