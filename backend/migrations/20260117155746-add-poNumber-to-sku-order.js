'use strict';

export default {
  async up(queryInterface, Sequelize) {
    // 1. Add poNumber column to sku_orders
    await queryInterface.addColumn('sku_orders', 'poNumber', {
      type: Sequelize.STRING,
      allowNull: true,
      comment: 'Synced from shipment_orders.poNumber'
    });

    // 2. Trigger AFTER INSERT on shipment_orders
    await queryInterface.sequelize.query(`
      CREATE TRIGGER trg_shipment_po_after_insert
      AFTER INSERT ON shipment_orders
      FOR EACH ROW
      BEGIN
        UPDATE sku_orders
        SET poNumber = NEW.poNumber
        WHERE shipmentOrderId = NEW.uid;
      END;
    `);

    // 3. Trigger AFTER UPDATE on shipment_orders.poNumber
    await queryInterface.sequelize.query(`
      CREATE TRIGGER trg_shipment_po_after_update
      AFTER UPDATE ON shipment_orders
      FOR EACH ROW
      BEGIN
        IF OLD.poNumber <> NEW.poNumber THEN
          UPDATE sku_orders
          SET poNumber = NEW.poNumber
          WHERE shipmentOrderId = NEW.uid;
        END IF;
      END;
    `);
  },

  async down(queryInterface) {
    // Drop triggers
    await queryInterface.sequelize.query(
      'DROP TRIGGER IF EXISTS trg_shipment_po_after_insert;'
    );
    await queryInterface.sequelize.query(
      'DROP TRIGGER IF EXISTS trg_shipment_po_after_update;'
    );

    // Remove column
    await queryInterface.removeColumn('sku_orders', 'poNumber');
  }
};
