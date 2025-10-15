import { Sequelize } from 'sequelize';
import pg from 'pg';
import "dotenv/config";

const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING;

export const sequelize = new Sequelize(DB_CONNECTION_STRING, {
  dialect: 'postgres',
  dialectModule: pg,
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production' ? {
      require: true,
      rejectUnauthorized: false
    } : false
  },
  pool: {
    max: 2,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  logging: false
});

export async function connectToDatabase() {
  try {
    const res = await sequelize.authenticate();
    // console.log(res);
    console.log('PostgreSQL connection established successfully.');
    return res;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
}