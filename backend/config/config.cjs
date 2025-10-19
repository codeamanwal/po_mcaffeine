require('dotenv').config();

module.exports = {
  development: {
    url: process.env.DB_CONNECTION_STRING,
    dialect: "mysql",
    // dialectOptions: {
    //   ssl: {
    //     require: true,
    //     rejectUnauthorized: false
    //   }
    // }
  },
  test: {
    url: process.env.DB_CONNECTION_STRING,
    dialect: "mysql",
    // dialectOptions: {
      // ssl: {
        // require: true,
        // rejectUnauthorized: false
      // }
    // }
  },
  production: {
    url: process.env.DB_CONNECTION_STRING,
    dialect: "mysql",
    // dialectOptions: {
    //   ssl: {
    //     require: true,
    //     rejectUnauthorized: false
    //   }
    // }
  }
};
