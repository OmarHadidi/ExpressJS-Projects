const chalk = require("chalk");
const log = require("../config/log");
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

    // User.hasOne(TodoGroup, {
    //     as: "MainTodoGroup",
    //     foreignKey: "MainUserId",
    // });
    // TodoGroup.belongsTo(User, {
    //     foreignKey: "MainUserId",
    // });

    User.hasMany(TodoGroup, { foreignKey: "ownerId" });
    TodoGroup.belongsTo(User, { as: "owner", foreignKey: "ownerId" });

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

    getSpecialFuncs(TodoGroup);
    getSpecialFuncs(User);

    return models;
}

/**
 * calls `sync()` after setting models and relations
 * @param {*} sequelize
 */
async function syncModels(sequelize) {
    const models = setupModels(sequelize);
    await sequelize.sync({ force: true, logging: log.sequelize });
    return models;
}

// To run here
const sequelize = new Sequelize(process.env.DB_URI);
sequelize.authenticate().then(async () => {
    const models = await syncModels(sequelize);
    // const user = await models.User.create({
    //     name: "OmarX",
    //     email: "omar2@omar2.com",
    // });
    // const MTodoGrp = await user.createMainTodoGroup({
    //     title: "Second Group",
    // });
    // const user2 = await todoGrp.createUser({
    //     name: "Ahmad",
    //     email: "ahmad@ahmad.com",
    // });
    // console.log(MTodoGrp);
});

module.exports = {
    setupModels,
    syncModels,
};
