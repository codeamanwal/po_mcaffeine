'use strict';

import { DataTypes } from 'sequelize';

export async function up(queryInterface, Sequelize) {
  const tableName = 'shipment_orders';

  const table = await queryInterface.describeTable(tableName);

  if (!table.firstAppointmentDate) {
    await queryInterface.addColumn(tableName, 'firstAppointmentDate', {
      type: DataTypes.STRING,
      allowNull: true,
    });
  }

  if (!table.secondAppointmentDate) {
    await queryInterface.addColumn(tableName, 'secondAppointmentDate', {
      type: DataTypes.STRING,
      allowNull: true,
    });
  }

  if (!table.thirdAppointmentDate) {
    await queryInterface.addColumn(tableName, 'thirdAppointmentDate', {
      type: DataTypes.STRING,
      allowNull: true,
    });
  }

  if (!table.remarkAp1) {
    await queryInterface.addColumn(tableName, 'remarkAp1', {
      type: DataTypes.TEXT,
      allowNull: true,
    });
  }

  if (!table.remarkAp2) {
    await queryInterface.addColumn(tableName, 'remarkAp2', {
      type: DataTypes.TEXT,
      allowNull: true,
    });
  }

  if (!table.remarkAp3) {
    await queryInterface.addColumn(tableName, 'remarkAp3', {
      type: DataTypes.TEXT,
      allowNull: true,
    });
  }
}

export async function down(queryInterface, Sequelize) {
  const tableName = 'shipment_orders';

  await Promise.all([
    queryInterface.removeColumn(tableName, 'firstAppointmentDate'),
    queryInterface.removeColumn(tableName, 'secondAppointmentDate'),
    queryInterface.removeColumn(tableName, 'thirdAppointmentDate'),
    queryInterface.removeColumn(tableName, 'remarkAp1'),
    queryInterface.removeColumn(tableName, 'remarkAp2'),
    queryInterface.removeColumn(tableName, 'remarkAp3'),
  ]);
}
