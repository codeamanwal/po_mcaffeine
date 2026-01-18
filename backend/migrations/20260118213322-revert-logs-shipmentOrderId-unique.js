'use strict';

export default {
  async up(queryInterface, Sequelize) {
    // Remove FK first
    await queryInterface.removeConstraint('logs', 'logs_ibfk_2');

    // Remove UNIQUE constraint
    await queryInterface.changeColumn('logs', 'shipmentOrderId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: false,
    });

    // Re-add FK
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
    // Re-apply UNIQUE if rollback needed
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
  }
};
