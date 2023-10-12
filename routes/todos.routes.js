const { Router } = require("express");
const { models, errors, log } = require("../config");
const createHttpError = require("http-errors");

const router = Router();

router.post("/", (req, res) => res.send("Here, Routes"));
router.put("/:todoId", (req, res) => res.send("Here, Routes"));
router.delete("/:todoId", (req, res) => res.send("Here, Routes"));
router.delete("/", (req, res) => res.send("Here, Routes"));
// Actions
router.post("/:todoId/set-status", async (req, res, next) => {
    // get status, groupId, todoId
    const { status } = req.body;
    const { todoId } = req.params;
    const groupId = req.groupId;
    // check this todo belongs to this Group
    const todo = await models.Todo.findByPk(todoId, {
        include: [models.TodoGroup],
    });
    if (todo.TodoGroupId != groupId) return next(createHttpError[404]());
    // check req.user is the owner of this group
    if (todo.TodoGroup.OwnerId != req.user.id)
        return next(createHttpError[401](errors.NotOwner("group")));
    // set status of the todo
    todo.status = status;
    await todo.save();

    // TODO: check if req.user's role in this group allows
    res.sendStatus(204);
});

module.exports = router;
