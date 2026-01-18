'use strict';

export default {
  async up(queryInterface, Sequelize) {
    /**
     * MySQL requires dropping FK before changing column
     */

    // Drop foreign key
    await queryInterface.removeConstraint('logs', 'logs_ibfk_2');

    // Remove UNIQUE constraint
    await queryInterface.changeColumn('logs', 'shipmentOrderId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: false,
    });

    // Re-add foreign key
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
    /**
     * Rollback (not recommended but safe)
     */

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
