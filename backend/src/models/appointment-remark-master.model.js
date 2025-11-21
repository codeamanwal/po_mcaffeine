import { DataTypes } from 'sequelize';
import { sequelize } from '../db/mysql.js';

const AppointmentRemarkMaster = sequelize.define('AppointmentRemarkMaster', {
    remark: {
        type: DataTypes.STRING,
        allowNull: true
    },
    category: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: true,
    tableName: 'appointment_remark_masters'
});

export default AppointmentRemarkMaster;
