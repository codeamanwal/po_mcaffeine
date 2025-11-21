import { DataTypes } from 'sequelize';
import { sequelize } from '../db/mysql.js';

const ChannelLocationMaster = sequelize.define('ChannelLocationMaster', {
    channelCategory: {
        type: DataTypes.STRING,
        allowNull: true
    },
    channel: {
        type: DataTypes.STRING,
        allowNull: true
    },
    channelLocation: {
        type: DataTypes.STRING,
        allowNull: true
    },
    dropLocation: {
        type: DataTypes.STRING,
        allowNull: true
    },
    apptChannel: {
        type: DataTypes.STRING,
        allowNull: true
    },
    apptChannelType: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: true,
    tableName: 'channel_location_masters'
});

export default ChannelLocationMaster;
