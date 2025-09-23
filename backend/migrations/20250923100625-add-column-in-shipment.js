'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    const tableName = 'shipment_orders';

    await queryInterface.addColumn(tableName, 'deliveryCharges', {
      type: Sequelize.FLOAT,
      allowNull: true,
    });

    await queryInterface.addColumn(tableName, 'halting', {
      type: Sequelize.FLOAT,
      allowNull: true,
    });

    await queryInterface.addColumn(tableName, 'unloadingCharges', {
      type: Sequelize.FLOAT,
      allowNull: true,
    });

    await queryInterface.addColumn(tableName, 'dedicatedVehicle', {
      type: Sequelize.FLOAT,
      allowNull: true,
    });

    await queryInterface.addColumn(tableName, 'otherCharges', {
      type: Sequelize.FLOAT,
      allowNull: true,
    });

    await queryInterface.addColumn(tableName, 'document', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn(tableName, 'proofOfDispatch', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn(tableName, 'proofOfDelivery', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    
  },

  async down(queryInterface, Sequelize) {
    const tableName = 'shipment_orders';
    await queryInterface.removeColumn(tableName, 'deliveryCharges');
    await queryInterface.removeColumn(tableName, 'halting');
    await queryInterface.removeColumn(tableName, 'unloadingCharges');
    await queryInterface.removeColumn(tableName, 'dedicatedVehicle');
    await queryInterface.removeColumn(tableName, 'otherCharges');
    
    await queryInterface.removeColumn(tableName, 'document');
    await queryInterface.removeColumn(tableName, 'proofOfDispatch');
    await queryInterface.removeColumn(tableName, 'proofOfDelivery');
  }
};