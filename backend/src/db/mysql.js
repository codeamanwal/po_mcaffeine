import { Sequelize } from 'sequelize';
import "dotenv/config";

const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING;


export const sequelize = new Sequelize(DB_CONNECTION_STRING, {
  dialect: 'mysql',
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
    await sequelize.authenticate();
    console.log('MySQL connection established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
}
