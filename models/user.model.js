const { Sequelize, DataTypes, Op } = require("sequelize");
const errors = require("../config/errors");

/**
 * @param {Sequelize} sequelize
 */
module.exports = function (sequelize) {
    return sequelize.define("User", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isAlpha: { msg: errors.AlphaOnly("name") },
                notEmpty: { msg: errors.Missing("name") },
            },
            set(name) {
                const preparedName = name.trim().toLowerCase();
                this.setDataValue("name", preparedName);
            },
        },
        email: {
            type: DataTypes.STRING,
            // allowNull:false,
            unique: { msg: errors.AlreadyExists("email") },
            validate: {
                isEmail: { msg: errors.NotEmail("email") },
            },
        },
    });
};
