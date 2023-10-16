const { Sequelize, DataTypes, Op } = require("sequelize");
const errors = require("../config/errors");

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
                    notEmpty: { msg: errors.Missing("task") },
                },
            },
            status: {
                // false = not done | true = done
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
        },
        { paranoid: true }
    );
};
