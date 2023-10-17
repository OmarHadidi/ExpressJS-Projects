const { Sequelize } = require("sequelize");
const { setupModels } = require("../models");
const log = require("./log");

const sequelize = new Sequelize(process.env.DB_URI, { logging: log.sequelize });

module.exports = {
    sequelize,
    models: setupModels(sequelize),
};
