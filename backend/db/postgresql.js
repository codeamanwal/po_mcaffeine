import { Sequelize } from 'sequelize';
import "dotenv/config"
const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING // Replace with your actual connection string


// export const sequelize = new Sequelize(DB_CONNECTION_STRING
//   dialect: 'postgres',
//   logging: false, // Set to true for SQL query logs
// );

export const sequelize = new Sequelize(DB_CONNECTION_STRING)

export async function connectToDatabase() {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL connection established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
}