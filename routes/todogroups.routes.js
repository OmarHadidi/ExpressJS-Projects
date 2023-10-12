const { Router } = require("express");
const mw = require("../middlewares");

const todosController = require("../controllers/todos.controller");
const tdGroupsAllController = require("../controllers/todogroups-all.controller");
const { models, log } = require("../config");
const todosRouter = require("./todos.routes");

// Each group level

const groupRouter = Router();

groupRouter.get("/", async (req, res, next) => {
    // NOTE: Must set `req.groupId` first [Done in setGroupId mw's]
    log.dump("req.groupId", req.groupId);
    const tdGroup = await models.TodoGroup.findByPk(req.groupId, {
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
groupRouter.use("/todos", todosRouter);

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
