'use strict';

export default {
  async up(queryInterface, Sequelize) {

    await queryInterface.removeConstraint('logs', 'logs_ibfk_2');


    await queryInterface.changeColumn('logs', 'shipmentOrderId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: true,
    });

    await queryInterface.addConstraint('logs', {
      fields: ['shipmentOrderId'],
      type: 'foreign key',
      name: 'logs_ibfk_2', 
      references: {
        table: 'shipment_orders', 
        field: 'uid',        
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },

  async down(queryInterface, Sequelize) {
    // Reverse: drop FK → revert column → re-add FK

    await queryInterface.removeConstraint('logs', 'logs_ibfk_2');

    await queryInterface.changeColumn('logs', 'shipmentOrderId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: false,
    });

    await queryInterface.addConstraint('logs', {
      fields: ['shipmentOrderId'],
      type: 'foreign key',
      name: 'logs_ibfk_2',
      references: {
        table: 'shipment_orders', 
        field: 'uid', 
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },
};
