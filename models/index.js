const chalk = require("chalk");
const { Sequelize, DataTypes, Op } = require("sequelize");
require("dotenv").config();

/**
 * get a list of special methods added to a Model for associations
 * @param {*} model
 */
function getSpecialFuncs(model) {
    console.log("model.associations :>> ", model.associations);
    for (let assoc of Object.keys(model.associations)) {
        for (let accessor of Object.keys(model.associations[assoc].accessors)) {
            console.log(
                chalk.redBright(
                    model.name +
                        "." +
                        model.associations[assoc].accessors[accessor] +
                        "()"
                )
            );
        }
    }
}

/**
 * Gets all Models from files, and Setup Relations between them, then return them in object
 * @param {*} sequelize
 * @returns all models in object
 */
function setupModels(sequelize) {
    const Todo = require("./Todo.model")(sequelize),
        TodoGroup = require("./TodoGroup.model")(sequelize),
        User_TodoGroup = require("./UserTodoGroup.model")(sequelize),
        User = require("./User.model")(sequelize),
        Role = require("./Role.model")(sequelize),
        UserCreds = require("./UserCreds.model")(sequelize);
    const models = {
        Todo,
        TodoGroup,
        User_TodoGroup,
        User,
        Role,
        UserCreds,
    };

    // Relations
    TodoGroup.hasMany(Todo);
    Todo.belongsTo(TodoGroup);

    TodoGroup.belongsToMany(User, {
        through: User_TodoGroup,
    });
    User.belongsToMany(TodoGroup, {
        through: User_TodoGroup,
    });

    User.hasMany(Role, { as: "definedRole" });
    Role.belongsTo(User);

    Role.hasMany(User_TodoGroup);
    User_TodoGroup.belongsTo(Role);

    User.hasOne(UserCreds);
    UserCreds.belongsTo(User);

    // getSpecialFuncs(User);

    return models;
}

/**
 * calls `sync()` after setting models and relations
 * @param {*} sequelize
 */
async function syncModels(sequelize) {
    setupModels(sequelize);
    await sequelize.sync();
}

// To run here
const sequelize = new Sequelize(process.env.DB_URI);
sequelize.authenticate().then(async () => {
    await syncModels(sequelize);
});

module.exports = {
    setupModels,
    syncModels,
};
