'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
     const dialect = queryInterface.sequelize.getDialect()
    let jsonType ;
    if (dialect === 'postgres') {
      jsonType = Sequelize.ARRAY(Sequelize.STRING);
    } else {
      // For MySQL 
      jsonType = Sequelize.JSON;
    }

    await queryInterface.createTable('logs', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      messages: {
        type: jsonType,
        allowNull: false,
        defaultValue: [],
      },
      createdBy: {
        type: Sequelize.INTEGER,
        references: {
          model:'users',
          key:'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      shipmentOrderId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'shipment_orders',
          key: 'uid'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('logs');
  }
};
