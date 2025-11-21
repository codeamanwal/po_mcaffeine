import { DataTypes } from 'sequelize';
import { sequelize } from '../db/mysql.js';

const StatusMaster = sequelize.define('StatusMaster', {
    statusPlanning: {
        type: DataTypes.STRING,
        allowNull: true
    },
    statusWarehouse: {
        type: DataTypes.STRING,
        allowNull: true
    },
    statusLogistics: {
        type: DataTypes.STRING,
        allowNull: true
    },
    statusFinal: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: true,
    tableName: 'status_masters'
});

export default StatusMaster;
