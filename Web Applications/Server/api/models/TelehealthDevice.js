module.exports = {
    attributes: {
        ID: {
            type: Sequelize.BIGINT(20),
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        UID: {
            type: Sequelize.STRING(255),
            allowNull: false
        },
        TelehealthUserID: {
            type: Sequelize.BIGINT(20),
            allowNull: true,
            references: {
                model: TelehealthUser,
                key: 'ID'
            }
        },
        DeviceToken: {
            type: Sequelize.TEXT
        },
        Type: {
            type: Sequelize.STRING(45),
            allowNull: true
        },
        CreationDate: {
            type: Sequelize.DATE,
            allowNull: true
        },
        CreatedBy: {
            type: Sequelize.BIGINT(20),
            allowNull: true
        },
        ModifiedDate: {
            type: Sequelize.DATE,
            allowNull: true
        },
        ModifiedBy: {
            type: Sequelize.BIGINT(20),
            allowNull: true
        },
        DeviceID: {
            type: Sequelize.TEXT
        }
    },
    associations: function() {},
    options: {
        tableName: 'TelehealthDevice',
        timestamps: false
    }
};
