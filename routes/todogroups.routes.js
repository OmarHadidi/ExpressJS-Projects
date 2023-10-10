const { Router } = require("express");
const mw = require("../middlewares");

const todosController = require("../controllers/todos.controller");
const tdGroupsAllController = require("../controllers/todogroups-all.controller");
const { models, log } = require("../config");

// Each group level

const groupRouter = Router();

groupRouter.get("/", async (req, res, next) => {
    // NOTE: Must set `req.groupId` first
    const tdGroup = await models.TodoGroup.findByPk(req.groupId, {
        include: models.Todo,
        attributes: {
            exclude: ["id", "ownerId"],
        },
    });
    res.json(tdGroup);
});
groupRouter.post("/todos", (req, res) => res.send("Here, Routes"));
groupRouter.put("/todos/:todoId", (req, res) => res.send("Here, Routes"));
groupRouter.delete("/todos/:todoId", (req, res) => res.send("Here, Routes"));
groupRouter.delete("/todos", (req, res) => res.send("Here, Routes"));

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
