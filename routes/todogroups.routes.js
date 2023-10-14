const { Router } = require("express");
const mw = require("../middlewares");

const todosController = require("../controllers/todos.controller");
const tdGroupsAllController = require("../controllers/todogroups-all.controller");
const { models, log } = require("../config");
const todosRouter = require("./todos.routes");

// Each group level

const groupRouter = Router();

// TODO: Use checkAuth in mw's that need it (PATCH for ex)(before checkUserIsGroupOwner)

groupRouter.get("/", async (req, res, next) => {
    // NOTE: Must set `res.locals.data.groupId` first [Done in setGroupId mw's]
    log.dump("res.locals.data.groupId", res.locals.data.groupId);
    const tdGroup = await models.TodoGroup.findByPk(res.locals.data.groupId, {
        include: [
            {
                model: models.Todo,
                attributes: { exclude: ["id", "TodoGroupId", "deletedAt"] },
            },
        ],
        attributes: {
            exclude: ["id", "OwnerId"],
        },
    });
    res.json(tdGroup);
});
groupRouter.use("/todos", mw.auth.checkAuth({}), todosRouter);

// All groups level

const allGroupsRouter = Router();

allGroupsRouter.get("/", (req, res) => {
    res.send("Here, Routes");
});
allGroupsRouter.use("/:groupId", mw.tdGrps.setGroupId(), groupRouter);

module.exports = {
    groups: allGroupsRouter,
    oneGroup: groupRouter,
};
