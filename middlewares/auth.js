const { log, models } = require("../config");

module.exports = {
    /**
     * Checks if req.user is authenticated, otherwise it will redirect to login page
     * @param {*} enabled `enabled` : If set to `false`, it will not check, it will only `next()`
     * `userId` : If provided, And If req.user is not authenticated, it logs in with the given userId
     * @returns
     */
    checkAuth:
        ({ enabled, userId }) =>
        async (req, res, next) => {
            log.dump("req.user from checkAuth", req.user);
            if (enabled === false) return next();
            if (req.user && req.isAuthenticated()) return next();
            if (userId) {
                const user = await models.User.findByPk(userId);
                return req.logIn(user, (err) => next());
            }
            res.redirect("/auth/login");
        },
};
