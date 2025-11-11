'use strict';

import { DataTypes } from 'sequelize';

export async function up(queryInterface, Sequelize) {
  const tableName = 'shipment_orders';

  const table = await queryInterface.describeTable(tableName);

  if (!table.appointmentShootedDate) {
    await queryInterface.addColumn(tableName, 'appointmentShootedDate', {
      type: DataTypes.STRING,
      allowNull: true,
    });
  }

  if (!table.appointmentRequestedDate) {
    await queryInterface.addColumn(tableName, 'appointmentRequestedDate', {
      type: DataTypes.STRING,
      allowNull: true,
    });
  }

  if (!table.remarksWarehouse) {
    await queryInterface.addColumn(tableName, 'remarksWarehouse', {
      type: DataTypes.STRING,
      allowNull: true,
    });
  }

}

export async function down(queryInterface, Sequelize) {
  const tableName = 'shipment_orders';

  await Promise.all([
    queryInterface.removeColumn(tableName, 'appointmentShootedDate'),
    queryInterface.removeColumn(tableName, 'appointmentRequestedDate'),
    queryInterface.removeColumn(tableName, 'remarksWarehouse'),
  ]);
}
