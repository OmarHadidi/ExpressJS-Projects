const { Router } = require("express");
const { models, errors, log } = require("../config");
const createHttpError = require("http-errors");
const mw = require("../middlewares");
const hlp = require("../helpers");
const { Op } = require("sequelize");

const router = Router();

router.post("/", mw.todos.checkUserIsGroupOwner(), async (req, res, next) => {
    const { task, status } = req.body;
    const { todoGroup } = res.locals.data;
    const todo = await todoGroup.createTodo({
        task,
        status,
    });
    // hide unwanted fields
    const todoData = todo.toJSON();
    const exclude = ["id", "TodoGroupId", "deletedAt"];
    exclude.forEach((ex) => delete todoData[ex]);

    res.json(todoData);
});
router.patch(
    "/:todoId",
    mw.todos.checkTodoInGroup(),
    mw.todos.checkUserIsGroupOwner(),
    mw.general.filterPATCHChanges({ onlyInclude: ["task", "status"] }),
    async (req, res, next) => {
        try {
            const todo = res.locals.data.todo;
            const { cleanChanges } = res.locals.data;
            await todo.update(cleanChanges);
            res.sendStatus(204);
        } catch (err) {
            next(err);
        }
    }
);
router.delete(
    "/:todoId",
    mw.todos.checkTodoInGroup(),
    mw.todos.checkUserIsGroupOwner(),
    async (req, res, next) => {
        const { todo } = res.locals.data;
        await todo.destroy();
        res.sendStatus(204);
    }
);
router.post(
    "/deletes",
    mw.todos.checkUserIsGroupOwner(),
    async (req, res, next) => {
        try {
            // TODO: Take many id's, validate, delete, respond with {fail, succ}
            const { requests } = req.body;
            const requestedIds = [];
            for (const rq of requests) requestedIds.push(rq.id);
            // Compare requested ids to available ids
            // NOTE: if one fails, all fail
            const availableToDel = await models.Todo.findAll({
                where: {
                    id: { [Op.in]: requestedIds },
                    TodoGroupId: res.locals.data.groupId,
                },
                attributes: ["id"],
            });
            const availableIds = availableToDel.map(({ id }) => id);
            const unavailableIds = requestedIds.filter(
                (reqId) => !availableIds.includes(reqId)
            );
            // delete availableIds
            await models.Todo.destroy({
                where: { id: { [Op.in]: availableIds } },
            });
            // TODO: why each one is unavailable? already deleted, non-existing, ..etc?
            res.json({
                succeeded: availableIds,
                unavailable: unavailableIds,
            });
        } catch (err) {
            next(err);
        }
    }
);

// Actions
router.post(
    "/:todoId/set-status",
    mw.todos.checkTodoInGroup(),
    mw.todos.checkUserIsGroupOwner(),
    async (req, res, next) => {
        const { status } = req.body;
        // got todo by id from previous middlewares
        const { todo } = res.locals.data;
        todo.status = status;
        await todo.save();

        // TODO: check if req.user's role in this group allows
        res.sendStatus(204);
    }
);

module.exports = router;
