module.exports = {
    /**
     * @returns Returns middleware that just defines `res.locals.data` as empty object to use between middlewares
     */
    setLocalsData: () => (req, res, next) => {
        res.locals.data = {};
        next();
    },
    setFlash: require("./flash-messages"),
    tdGrps: require("./todo-groups"),
    auth: require("./auth"),
    todos: require("./todos"),
};
