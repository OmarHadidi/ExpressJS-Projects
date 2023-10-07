const ex = require("express");
const { log } = require("../config");
/**
 * Returns a middleware that:
 * - Sets `res.locals.flash` to `req.flash()`, so that you
 * don't need to render flash messages manually, you just
 * say `flash.something` in your view
 * - Sets `req.flashes` to the same value, so that if you need
 * flashes in the js code
 * @returns Middleware
 */
function setFlash() {
    return function (req, res, next) {
        res.locals.flash = req.flash();
        req.flashes = res.locals.flash;
        next();
    };
}

module.exports = setFlash;
