const { Sequelize, DataTypes, Op } = require("sequelize");
const errors = require("../config/errors");

/**
 * @param {Sequelize} sequelize
 */
module.exports = function (sequelize) {
    const User = require("./User.model")(sequelize);

    return sequelize.define("UserCreds", {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: { msg: errors.AlreadyExists("username") },
            validate: {
                notEmpty: { msg: errors.Missing("username") },
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: { msg: errors.Missing("password") },
            },
        },
        UserId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: "id",
            },
            primaryKey: true,
        },
    });
};
