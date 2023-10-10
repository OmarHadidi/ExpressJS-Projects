const { Router } = require("express");
const passport = require("passport");
const bcrypt = require("bcrypt");
const { Sequelize, Transaction } = require("sequelize");
const sqlz = require("sequelize");
const { errors, log, sequelize, models, constants } = require("../config");
const joiSchemas = require("../validation/joi");
const Joi = require("joi");
const UserServices = require("../services/User.services");
const TodoGroupServices = require("../services/TodoGroup.services");
const { UserCreds, User } = require("../config").models;

const router = Router();

router.get("/login", (req, res, next) => {
    res.render("login");
});
router.post(
    "/login",
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/auth/login",
        failureFlash: true,
    })
);
router.get("/signup", (req, res, next) => {
    log.dump("flash", req.flashes);
    log.dump("locals", res.locals);
    res.render("signup");
});
router.post("/signup", async (req, res, next) => {
    try {
        const { name, email, username, password } = req.body;
        // validate form
        await joiSchemas.signupSchema.validateAsync(req.body);
        // store user and user creds in DB
        const user = await UserServices.registerUser(sequelize, {
            name,
            email,
            username,
            password,
        });
        // create Main todo group
        const mainTdGrp = await TodoGroupServices.createMainTodoGroup(user);
        // log user in
        req.logIn(user, (err) => {
            if (err) return next(err);
            res.redirect("/");
        });
    } catch (err) {
        if (err instanceof sqlz.Error) log.error(err.errors);
        else log.error(err);
        if (err instanceof sqlz.ValidationError) {
            err.errors.map((e) => {
                req.flash("error", e.message);
            });
            req.flash("formData", req.body);
            return res.redirect("/auth/signup");
        } else if (err instanceof Joi.ValidationError) {
            req.flash("error", err.details[0].message);
            req.flash("formData", req.body);
            return res.redirect("/auth/signup");
        }
        next(err);
    }
});

router.post("/logout", (req, res, next) => {
    req.logOut();
    res.redirect("/");
})

module.exports = router;
