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

    TodoGroup.hasOne(User, {
        foreignKey: "MainTodoGroupId",
    });
    User.belongsTo(TodoGroup, {
        as: "MainTodoGroup",
        foreignKey: "MainTodoGroupId",
    });

    User.hasMany(TodoGroup, { foreignKey: "OwnerId" });
    TodoGroup.belongsTo(User, { as: "Owner", foreignKey: "OwnerId" });

    TodoGroup.belongsToMany(User, {
        through: User_TodoGroup,
    });
    User.belongsToMany(TodoGroup, {
        through: User_TodoGroup,
    });

    User.hasMany(Role, { as: "DefinedRole" });
    Role.belongsTo(User);

    Role.hasMany(User_TodoGroup);
    User_TodoGroup.belongsTo(Role);

    User.hasOne(UserCreds);
    UserCreds.belongsTo(User);

    getSpecialFuncs(Todo);
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
    await sequelize.sync({ logging: log.sequelize });
    return models;
}

// To run here
const sequelize = new Sequelize(process.env.DB_URI);
sequelize.authenticate().then(async () => {
    const models = await syncModels(sequelize);
    // await models.User.sync({ alter:true });

    // const user = await models.User.findByPk(1, {
    //     include: [{ model: models.TodoGroup, as: "MainTodoGroup", include: models.Todo }],
    // });
    // log.dump("user", user.toJSON());
    // await user.MainTodoGroup.createTodo({
    //     task: 'Do Homework'
    // })
});

module.exports = {
    setupModels,
    syncModels,
};
