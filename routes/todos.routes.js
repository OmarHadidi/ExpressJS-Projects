const { Router } = require("express");
const { models, errors, log } = require("../config");
const createHttpError = require("http-errors");
const mw = require("../middlewares");
const hlp = require("../helpers");

const router = Router();

router.post("/", mw.todos.checkUserIsGroupOwner({}), async (req, res, next) => {
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
            const todo =
                res.locals.data.todo ||
                (await models.Todo.findByPk(req.params.todoId));
            const { cleanChanges } = res.locals.data;
            await todo.update(cleanChanges);
            res.sendStatus(204);
        } catch (err) {
            next(err);
        }
        /*
id=1
{
    "status": false,
    "lux": "adsas",
    "id": 2
}


*/
    }
);
router.put("/:todoId", (req, res) => res.send("Here, Routes"));
router.delete("/:todoId", (req, res) => res.send("Here, Routes"));
router.delete("/", (req, res) => res.send("Here, Routes"));
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
