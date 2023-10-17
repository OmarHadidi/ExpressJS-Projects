const { Router } = require("express");
const mw = require("../middlewares");

const todosController = require("../controllers/todos.controller");
const tdGroupsAllController = require("../controllers/todogroups-all.controller");
const { models, log } = require("../config");
const todosRouter = require("./todos.routes");

// Each group level
const groupRouter = Router();
groupRouter.get("/", async (req, res, next) => {
    try {
        // NOTE: Must set `res.locals.data.groupId` first [Done in setGroupId mw's]
        log.dump("res.locals.data.groupId", res.locals.data.groupId);
        const tdGroup = await models.TodoGroup.findByPk(res.locals.data.groupId, {
            include: [
                {
                    model: models.Todo,
                    attributes: { exclude: ["TodoGroupId", "deletedAt"] },
                },
            ],
            attributes: {
                exclude: ["id", "OwnerId"],
            },
        });
        res.json(tdGroup);
    } catch (err) {
        next(err);
    }
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
