'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGERw
      },
      entryDate: { type: Sequelize.DATE, allowNull: true },
      brand: { type: Sequelize.STRING, allowNull: true },
      channel: { type: Sequelize.STRING, allowNull: true },
      location: { type: Sequelize.STRING, allowNull: true },
      poDate: { type: Sequelize.DATE, allowNull: true },
      poNumber: { type: Sequelize.STRING, allowNull: true },
      srNo: { type: Sequelize.STRING, allowNull: true },
      skuName: { type: Sequelize.STRING, allowNull: true },
      skuCode: { type: Sequelize.STRING, allowNull: true },
      channelSkuCode: { type: Sequelize.STRING, allowNull: true },
      qty: { type: Sequelize.INTEGER, allowNull: true },
      gmv: { type: Sequelize.FLOAT, allowNull: true },
      poValue: { type: Sequelize.FLOAT, allowNull: true },
      actualPoNumber: { type: Sequelize.STRING, allowNull: true },
      updatedQty: { type: Sequelize.INTEGER, allowNull: true },
      updatedGmv: { type: Sequelize.FLOAT, allowNull: true },
      updatedPoValue: { type: Sequelize.FLOAT, allowNull: true },
      facility: { type: Sequelize.STRING, allowNull: true },
      accountsWorking: { type: Sequelize.STRING, allowNull: true },
      channelInwardingQuantity: { type: Sequelize.INTEGER, allowNull: true },
      workingDate: { type: Sequelize.DATE, allowNull: true },
      dispatchDate: { type: Sequelize.DATE, allowNull: true },
      currentAppointmentDate: { type: Sequelize.DATE, allowNull: true },
      statusPlanning: { type: Sequelize.STRING, allowNull: true },
      statusWarehouse: { type: Sequelize.STRING, allowNull: true },
      statusLogistics: { type: Sequelize.STRING, allowNull: true },
      orderNumbers: { type: Sequelize.STRING, allowNull: true },
      poNumberInwardCWH: { type: Sequelize.STRING, allowNull: true },
      invoiceLink: { type: Sequelize.STRING, allowNull: true },
      cnLink: { type: Sequelize.STRING, allowNull: true },
      maxPoEntryCount: { type: Sequelize.INTEGER, allowNull: true },
      poCheck: { type: Sequelize.STRING, allowNull: true },
      temp: { type: Sequelize.STRING, allowNull: true },
      inwardPos: { type: Sequelize.STRING, allowNull: true },
      sku: { type: Sequelize.STRING, allowNull: true },
      uidDb: { type: Sequelize.STRING, allowNull: true },
      channelType: { type: Sequelize.STRING, allowNull: true },
      actualWeight: { type: Sequelize.STRING, allowNull: true },
      check: { type: Sequelize.STRING, allowNull: true },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('orders');
  }
};