'use strict';

export default {
  async up(queryInterface, Sequelize) {
    const dialect = queryInterface.sequelize.getDialect();

    let jsonType ;
    if (dialect === 'postgres') {
      jsonType = Sequelize.ARRAY(Sequelize.STRING);
    } else {
      // For MySQL 
      jsonType = Sequelize.JSON;
    }

    await queryInterface.addColumn('users', 'allotedFacilities', {
      type: jsonType,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'allotedFacilities');
  }
};
