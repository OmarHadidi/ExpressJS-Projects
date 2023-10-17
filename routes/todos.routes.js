const { Router } = require("express");
const { models, errors, log } = require("../config");
const createHttpError = require("http-errors");
const mw = require("../middlewares");
const hlp = require("../helpers");
const { Op } = require("sequelize");
const joiSchemas = require("../validation/joi");

const router = Router();

router.post("/", mw.todos.checkUserIsGroupOwner(), async (req, res, next) => {
    try {
        const { task, status } = req.body;
        const { todoGroup } = res.locals.data;
        await joiSchemas.createTodoSchema.validateAsync({
            task,
            status,
        });
        const todo = await todoGroup.createTodo({
            task,
            status,
        });
        // hide unwanted fields
        const todoData = todo.toJSON();
        const exclude = ["id", "TodoGroupId", "deletedAt"];
        exclude.forEach((ex) => delete todoData[ex]);

        res.json(todoData);
    } catch (err) {
        next(err);
    }
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
        try {
            const { todo } = res.locals.data;
            await todo.destroy();
            res.sendStatus(204);
        } catch (err) {
            next(err);
        }
    }
);
router.post(
    "/deletes",
    mw.todos.checkUserIsGroupOwner(),
    async function filterRequestedIds(req, res, next) {
        try {
            const { requests } = req.body;
            const requestedIds = [];
            for (const rq of requests) requestedIds.push(rq.id);
            // get available requested ids from DB in this group
            const availableToDel = await models.Todo.findAll({
                where: {
                    id: { [Op.in]: requestedIds },
                    TodoGroupId: res.locals.data.groupId,
                },
                attributes: ["id"],
            });
            // get unavailable requested ids
            const availableIds = availableToDel.map(({ id }) => id);
            const unavailableIds = requestedIds.filter(
                (reqId) => !availableIds.includes(reqId)
            );
            res.locals.data.availableIds = availableIds;
            res.locals.data.unavailableIds = unavailableIds;
            next();
        } catch (err) {
            next(err);
        }
    },
    async (req, res, next) => {
        try {
            const { availableIds, unavailableIds } = res.locals.data;
            // delete availableIds
            // NOTE: if one fails, all fail
            await models.Todo.destroy({
                where: { id: { [Op.in]: availableIds } },
            });
            res.json({
                succeeded: availableIds,
                unavailable: unavailableIds,
            });
        } catch (err) {
            next(err);
        }
    }
);
router.get(
    "/deletes",
    mw.todos.checkUserIsGroupOwner(),
    async (req, res, next) => {
        try {
            const { groupId } = res.locals.data;
            const deletedTodos = await models.Todo.findAll({
                where: { TodoGroupId: groupId, deletedAt: { [Op.not]: null } },
                paranoid: false,
                attributes: { exclude: ["TodoGroupId"] },
            });
            res.json(deletedTodos);
        } catch (err) {
            next(err);
        }
    }
);
router.post(
    "/:todoId/restore",
    mw.todos.checkTodoInGroup(true),
    mw.todos.checkUserIsGroupOwner(),
    async (req, res, next) => {
        try {
            const { todo } = res.locals.data;
            await todo.restore();
            const { filtered: cleanTodo } = hlp.exclude(todo.toJSON(), {
                onlyInclude: ["status", "task", "id"],
            });
            res.json(cleanTodo);
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
        try {
            const { status } = req.body;
            // got todo by id from previous middlewares
            const { todo } = res.locals.data;
            todo.status = status;
            await todo.save();

            // TODO: check if req.user's role in this group allows
            res.sendStatus(204);
        } catch (err) {
            next(err);
        }
    }
);

module.exports = router;
