module.exports = {
    /**
     * Returns middleware that
     * Sets `req.groupId` to requested `:groupId` in `req.params`
     */
    setGroupId: () => (req, res, next) => {
        req.groupId = req.params.groupId;
        next();
    },
    /**
     * Returns middleware that
     * Sets `req.groupId` to `req.user`'s "Main" todo group id
     */
    setMyGroupId: () => (req, res, next) => {
        // TODO: Here I need MainTodoGroupId
        req.groupId = 1;
        next();
    },
};
