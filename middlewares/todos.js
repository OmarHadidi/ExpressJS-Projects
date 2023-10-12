const { models } = require("../config");

module.exports = {
    checkTodoInGroup: () => async (req, res, next) => {
        // check this todo belongs to this Group
        const { todoId } = req.params;
        const todo = await models.Todo.findByPk(todoId, {
            include: [models.TodoGroup],
        });
        if (todo.TodoGroupId != groupId) return next(createHttpError[404]());
    },
};
