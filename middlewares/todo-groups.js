const { log } = require("../config");

module.exports = {
    /**
     * Returns middleware that
     * Sets `res.locals.data.groupId` to requested `:groupId` in `req.params`
     */
    setGroupId: () => (req, res, next) => {
        res.locals.data.groupId = req.params.groupId;
        next();
    },
    /**
     * @param {Number | undefined} customId if set, it is
     * provided as user's main group id instead of the actual
     * one in the DB. Useful for skipping Auth processes while testing
     * @returns Returns middleware that
     * Sets `res.locals.data.groupId` to `req.user`'s "Main" todo group id
     */
    setMyGroupId: (customId) => (req, res, next) => {
        log.dump('req.user', req.user)
        res.locals.data.groupId =
            customId || req.user ? req.user.MainTodoGroupId : undefined;
        next();
    },
};
