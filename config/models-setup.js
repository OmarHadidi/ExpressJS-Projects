const { Sequelize } = require("sequelize");
const { setupModels } = require("../models");

const sequelize = new Sequelize(process.env.DB_URI);

module.exports = {
    sequelize,
    models: setupModels(sequelize),
};
