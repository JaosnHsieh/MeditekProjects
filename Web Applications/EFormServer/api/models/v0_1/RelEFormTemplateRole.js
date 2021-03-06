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
        EFormTemplateID: {
            type: Sequelize.BIGINT(20),
            allowNull: true,
            validate: {
                isInt: {
                    msg: 'Must be an integer!'
                }
            },
            references: {
                model: 'EFormTemplate',
                key: 'ID'
            }
        },
        RoleID: {
            type: Sequelize.BIGINT(20),
            allowNull: true,
            validate: {
                isInt: {
                    msg: 'Must be an integer!'
                }
            },
            references: {
                model: 'Role',
                key: 'ID'
            }
        },
        View: {
            type: Sequelize.STRING
        },
        Edit: {
            type: Sequelize.STRING
        },
        Print: {
            type: Sequelize.STRING
        }
    },
    associations: function() {},
    options: {
        tableName: 'RelEFormTemplateRole',
        timestamps: false,
        hooks: {}
    }
};
