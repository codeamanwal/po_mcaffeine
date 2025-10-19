import { DataTypes } from 'sequelize';
import { sequelize } from '../db/postgresql.js'; 
// import { sequelize } from '../db/mysql.js';

const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false
    },
    permissions: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true
    },
    location: {
        type: DataTypes.STRING,
        allowNull: true
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true  
    },
    allotedFacilities: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
    },
}, {
  timestamps: true,
  tableName: 'users'
});

export default User;