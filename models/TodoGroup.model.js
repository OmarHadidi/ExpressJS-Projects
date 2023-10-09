const { Sequelize, DataTypes, Op } = require("sequelize");
const errors = require("../config/errors");

/**
 * @param {Sequelize} sequelize
 */
module.exports = function (sequelize) {
    return sequelize.define("TodoGroup", {
        title: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: { msg: errors.Missing("title") },
            },
        },
    });
};
