'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    // await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    await queryInterface.createTable('shipment_orders', {
      uid: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      entryDate: { type: Sequelize.STRING, allowNull: false },
      poDate: { type: Sequelize.STRING, allowNull: false },
      facility: { type: Sequelize.STRING },
      channel: { type: Sequelize.STRING },
      location: { type: Sequelize.STRING },
      poNumber: { type: Sequelize.STRING, allowNull: false},
      totalUnits: { type: Sequelize.INTEGER },
      brandName: { type: Sequelize.STRING },
      remarksPlanning: { type: Sequelize.TEXT },
      specialRemarksCOPT: { type: Sequelize.TEXT },
      newShipmentReference: { type: Sequelize.STRING },
      statusActive: { type: Sequelize.STRING, defaultValue: "Active" },
      statusPlanning: { type: Sequelize.STRING },
      statusWarehouse: { type: Sequelize.STRING },
      statusLogistics: { type: Sequelize.STRING },
      channelInwardingRemarks: { type: Sequelize.TEXT },
      dispatchRemarksLogistics: { type: Sequelize.TEXT },
      dispatchRemarksWarehouse: { type: Sequelize.TEXT },
      dispatchDateTentative: { type: Sequelize.STRING },
      workingDatePlanner: { type: Sequelize.STRING },
      rtsDate: { type: Sequelize.STRING },
      dispatchDate: { type: Sequelize.STRING },
      currentAppointmentDate: { type: Sequelize.STRING },
      firstAppointmentDateCOPT: { type: Sequelize.STRING },
      noOfBoxes: { type: Sequelize.INTEGER },
      orderNo1: { type: Sequelize.STRING },
      orderNo2: { type: Sequelize.STRING },
      orderNo3: { type: Sequelize.STRING },
      pickListNo: { type: Sequelize.STRING },
      workingTypeWarehouse: { type: Sequelize.STRING },
      inventoryRemarksWarehouse: { type: Sequelize.TEXT },
      b2bWorkingTeamRemarks: { type: Sequelize.TEXT },
      actualWeight: { type: Sequelize.FLOAT },
      volumetricWeight: { type: Sequelize.FLOAT },
      channelType: { type: Sequelize.STRING },
      firstTransporter: { type: Sequelize.STRING },
      firstDocketNo: { type: Sequelize.STRING },
      secondTransporter: { type: Sequelize.STRING },
      secondDocketNo: { type: Sequelize.STRING },
      thirdTransporter: { type: Sequelize.STRING },
      thirdDocketNo: { type: Sequelize.STRING },
      appointmentLetter: { type: Sequelize.STRING },
      labelsLink: { type: Sequelize.STRING },
      invoiceDate: { type: Sequelize.STRING },
      invoiceLink: { type: Sequelize.STRING },
      cnLink: { type: Sequelize.STRING },
      ewayLink: { type: Sequelize.STRING },
      invoiceValue: { type: Sequelize.FLOAT },
      remarksAccountsTeam: { type: Sequelize.TEXT },
      invoiceChallanNumber: { type: Sequelize.STRING },
      invoiceCheckedBy: { type: Sequelize.STRING },
      tallyCustomerName: { type: Sequelize.STRING },
      customerCode: { type: Sequelize.STRING },
      poEntryCount: { type: Sequelize.INTEGER },
      temp: { type: Sequelize.BOOLEAN },
      deliveryDate: { type: Sequelize.STRING },
      rescheduleLag: { type: Sequelize.INTEGER },
      finalRemarks: { type: Sequelize.TEXT },
      updatedGmv: { type: Sequelize.FLOAT },
      physicalWeight: { type: Sequelize.FLOAT },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('DROP EXTENSION IF EXISTS "uuid-ossp";');
    await queryInterface.dropTable('shipment_orders');
  }
};
