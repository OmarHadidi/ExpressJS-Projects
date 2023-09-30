const { Sequelize, DataTypes, Op } = require("sequelize");

/**
 * @param {Sequelize} sequelize
 */
module.exports = function (sequelize) {
    return sequelize.define(
        "Todo",
        {
            task: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: true,
                },
            },
        },
        { paranoid: true }
    );
};
