const createHttpError = require("http-errors");
const { errors } = require("../config");
const hlp = require("../helpers");
module.exports = {
    /**
     * 
     * @param {*} excludeFilter 
     * @returns Returns middleware that filters `req.body` from 
     * unwanted properties using `helpers.exclude`, and sends a 
     * BadRequest if there are unwanted fields sent
     * 
     * **NOTE:** It sets `res.locals.data.cleanChanges` to filtered changes from unwanted things
     */
    filterPATCHChanges:
        (excludeFilter = { exclude, onlyInclude }) =>
        (req, res, next) => {
            // filter changes from unwanted fields (id, deletedAt, ..etc)
            const changes = req.body;
            const { filtered: cleanChanges, excluded } = hlp.exclude(
                changes,
                excludeFilter
            );
            // if unwanted fields found, BadRequest
            if (excluded.length)
                return next(
                    createHttpError.BadRequest(errors.UnwantedFields(excluded))
                );
            res.locals.data.cleanChanges = cleanChanges;
            next();
        },
};
