'use strict';

export default {
  async up(queryInterface, Sequelize) {
    // Step 0: Describe table (idempotent)
    const table = await queryInterface.describeTable('shipment_orders');

    // Step 1: Add column if it doesn't exist
    if (!table.poNumberInwardCWH) {
      await queryInterface.addColumn('shipment_orders', 'poNumberInwardCWH', {
        type: Sequelize.STRING(255),
        allowNull: true,
        defaultValue: null,
        // unique: true,
        comment: 'Unique inward CWH PO number, can be null'
      });
    }

    // Step 2: Optional backfill from existing column
    // await queryInterface.sequelize.query(`
    //   UPDATE shipment_orders
    //   SET poNumberInwardCWH = poNumber
    //   WHERE poNumberInwardCWH IS NULL
    // `);
  },

  async down(queryInterface) {
    const table = await queryInterface.describeTable('shipment_orders');

    if (table.poNumberInwardCWH) {
      // Remove unique index first
      // await queryInterface.removeIndex('shipment_orders', 'uniq_poNumberInwardCWH');

      // Remove column
      await queryInterface.removeColumn('shipment_orders', 'poNumberInwardCWH');
    }
  }
};
