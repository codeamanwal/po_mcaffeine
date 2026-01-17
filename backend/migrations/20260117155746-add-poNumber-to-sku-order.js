'use strict';

export default {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('sku_orders');

    // 1. Add column ONLY if it does not exist
    if (!table.poNumber) {
      await queryInterface.addColumn('sku_orders', 'poNumber', {
        type: Sequelize.STRING,
        allowNull: true
      });
    }

    // 2. Backfill existing data
    await queryInterface.sequelize.query(`
      UPDATE sku_orders so
      JOIN shipment_orders sh
        ON sh.uid = so.shipmentOrderId
      SET so.poNumber = sh.poNumber
      WHERE so.poNumber IS NULL;
    `);
  },

  async down(queryInterface) {
    const table = await queryInterface.describeTable('sku_orders');

    if (table.poNumber) {
      await queryInterface.removeColumn('sku_orders', 'poNumber');
    }
  }
};
