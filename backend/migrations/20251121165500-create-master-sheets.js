'use strict';

export default {
    async up(queryInterface, Sequelize) {
        // Facility Master
        await queryInterface.createTable('facility_masters', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            facility: {
                type: Sequelize.STRING,
                allowNull: true
            },
            pickupLocation: {
                type: Sequelize.STRING,
                allowNull: true
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });

        // Courier Partner Master
        await queryInterface.createTable('courier_partner_masters', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            courierPartnerMode: {
                type: Sequelize.STRING,
                allowNull: true
            },
            courierPartner: {
                type: Sequelize.STRING,
                allowNull: true
            },
            courierMode: {
                type: Sequelize.STRING,
                allowNull: true
            },
            appointmentChargeYes: {
                type: Sequelize.FLOAT,
                allowNull: true
            },
            appointmentChargeNo: {
                type: Sequelize.FLOAT,
                allowNull: true
            },
            docketCharges: {
                type: Sequelize.FLOAT,
                allowNull: true
            },
            courierType: {
                type: Sequelize.FLOAT,
                allowNull: true
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });

        // Status Master
        await queryInterface.createTable('status_masters', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            statusPlanning: {
                type: Sequelize.STRING,
                allowNull: true
            },
            statusWarehouse: {
                type: Sequelize.STRING,
                allowNull: true
            },
            statusLogistics: {
                type: Sequelize.STRING,
                allowNull: true
            },
            statusFinal: {
                type: Sequelize.STRING,
                allowNull: true
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });

        // Courier Rate Master
        await queryInterface.createTable('courier_rate_masters', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            courierPartner: {
                type: Sequelize.STRING,
                allowNull: true
            },
            pickupLocation: {
                type: Sequelize.STRING,
                allowNull: true
            },
            dropLocation: {
                type: Sequelize.STRING,
                allowNull: true
            },
            ratesPerKg: {
                type: Sequelize.FLOAT,
                allowNull: true
            },
            tat: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });

        // Channel Location Master
        await queryInterface.createTable('channel_location_masters', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            channelCategory: {
                type: Sequelize.STRING,
                allowNull: true
            },
            channel: {
                type: Sequelize.STRING,
                allowNull: true
            },
            channelLocation: {
                type: Sequelize.STRING,
                allowNull: true
            },
            dropLocation: {
                type: Sequelize.STRING,
                allowNull: true
            },
            apptChannel: {
                type: Sequelize.STRING,
                allowNull: true
            },
            apptChannelType: {
                type: Sequelize.STRING,
                allowNull: true
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });

        // Appointment Remark Master
        await queryInterface.createTable('appointment_remark_masters', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            remark: {
                type: Sequelize.STRING,
                allowNull: true
            },
            category: {
                type: Sequelize.STRING,
                allowNull: true
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });

        // SKU Channel brand Master
        await queryInterface.createTable('sku_masters', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            channel: {
                type: Sequelize.STRING,
                allowNull: true
            },
            skuCode: {
                type: Sequelize.STRING,
                allowNull: true
            },
            skuName: {
                type: Sequelize.STRING,
                allowNull: true
            },
            channelSkuCode: {
                type: Sequelize.STRING,
                allowNull: true
            },
            brand: {
                type: Sequelize.STRING,
                allowNull: true
            },
            mrp: {
                type: Sequelize.FLOAT,
                allowNull: true
            },
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
        await queryInterface.dropTable('sku_masters');
        await queryInterface.dropTable('appointment_remark_masters');
        await queryInterface.dropTable('channel_location_masters');
        await queryInterface.dropTable('courier_rate_masters');
        await queryInterface.dropTable('status_masters');
        await queryInterface.dropTable('courier_partner_masters');
        await queryInterface.dropTable('facility_masters');
    }
};
