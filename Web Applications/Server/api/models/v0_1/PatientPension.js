module.exports = {
    attributes: {
        ID: {
            type: Sequelize.BIGINT(20),
            autoIncrement: true,
            allowNull: false,
            validate: {
                isInt: {
                    msg: 'Must be an integer!'
                }
            },
            primaryKey: true
        },
        PatientID: {
            type: Sequelize.BIGINT(20),
            allowNull: true,
            validate: {
                isInt: {
                    msg: 'Must be an integer!'
                }
            }
        },
        HCCPensionNumber: {
            type: Sequelize.STRING(45),
            allowNull: true,
            validate: {
                len: {
                    args: [0, 45],
                    msg: 'Too long!'
                }
            }
        },
        ExpiryDate: {
            type: Sequelize.DATE,
            allowNull: true,
            validate: {
                isDate: {
                    msg: 'Invalid!'
                }
            }
        }
    },
    associations: function() {},
    options: {
        tableName: 'PatientPension',
        timestamps: false,
        hooks: {
            // beforeCreate: function(module, options, callback) {
            //     module.CreatedDate = new Date();
            //     callback();
            // },
            // beforeBulkCreate: function(modules, options, callback) {
            //     modules.forEach(function(module, index) {
            //         modules[index].CreatedDate = new Date();
            //     });
            //     callback();
            // },
            // beforeBulkUpdate: function(module, callback) {
            //     module.fields.push('ModifiedDate');
            //     module.attributes.ModifiedDate = new Date();
            //     callback();
            // }
        }
    }
};
