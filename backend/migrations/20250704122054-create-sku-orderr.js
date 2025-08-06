'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sku_orders', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      srNo: { type: Sequelize.STRING },
      skuName: { type: Sequelize.STRING },
      skuCode: { type: Sequelize.STRING },
      channelSkuCode: { type: Sequelize.STRING },
      qty: { type: Sequelize.INTEGER },
      gmv: { type: Sequelize.FLOAT },
      poValue: { type: Sequelize.FLOAT },
      accountsWorking: { type: Sequelize.STRING },
      channelInwardingQuantity: { type: Sequelize.INTEGER },
      actualWeight: { type: Sequelize.FLOAT },
      shipmentOrderId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'shipment_orders',
          key: 'uid'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('sku_orders');
  }
};
