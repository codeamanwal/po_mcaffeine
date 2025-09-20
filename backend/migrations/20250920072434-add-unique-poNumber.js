'use strict';

export default {
  async up(queryInterface) {
    await queryInterface.addConstraint('shipment_orders', {
      fields: ['poNumber'],
      type: 'unique',
      name: 'unique_poNumber_constraint', 
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint('shipment_orders', 'unique_poNumber_constraint');
  },
}