const createHttpError = require("http-errors");
const { models, errors, log } = require("../config");

module.exports = {
    /**
     * @param {*} softDeleted if `false`, which is the default,
     * only non-deleted will be returned, if `true`, deleted
     * and non-deleted will be returned
     * @returns returns a middleware that checks that todo with id in request params belongs to the todo group in request params
     * 
     * **Note**: It sets `res.locals.data.todo`
     */
    checkTodoInGroup: (softDeleted=false) => async (req, res, next) => {
        const { todoId } = req.params;
        const { groupId } = res.locals.data;
        // TODO: Dont load twice
        const todo =
            res.locals.data.todo ||
            (await models.Todo.findByPk(todoId, {
                include: [models.TodoGroup],
                paranoid: !softDeleted
            }));
        if (todo.TodoGroupId != groupId) return next(createHttpError[404]());
        res.locals.data.todo = todo;
        next();
    },
    /**
     * @returns Returns Middleware that checks req.user is the owner of this group
     * 
     * **Note**: If no `res.locals.data.todo` is set, it sets `res.locals.data.todoGroup`
     */
    checkUserIsGroupOwner: () => async (req, res, next) => {
        // if todo was already loaded (for todoId), use it
        let todo = res.locals.data.todo;
        if (todo && todo.TodoGroup && todo.TodoGroup.OwnerId != req.user.id)
            return next(createHttpError[401](errors.NotOwner("group")));

        // otherwise get it from `groupId`
        const { groupId } = res.locals.data;
        todoGroup = await models.TodoGroup.findByPk(groupId);
        res.locals.data.todoGroup = todoGroup;
        if (todoGroup.OwnerId != req.user.id)
            return next(createHttpError[401](errors.NotOwner("group")));
        next();
    },
};
