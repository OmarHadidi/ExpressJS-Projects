const { Router } = require("express");
const mw = require("../middlewares");

const tdGroup1Controller = require("../controllers/todogroup-1.controller");
const tdGroupsAllController = require("../controllers/todogroups-all.controller");

// Each group level

const groupRouter = Router();

groupRouter.get("/", (req, res) => {
    res.send(`Here, Todo Group #${req.groupId}`);
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
