var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");
const cors = require("cors");
require("dotenv").config();

const config = require("./config");
const mw = require("./middlewares");
const routes = require("./routes");
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(flash());
// app.set('trust proxy', 1);
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        saveUninitialized: false,
        resave: false,
        cookie: {
            sameSite: "lax",
            httpOnly: true,
            // secure: true,
        },
        store: config.sequelizeSessionStore,
        // proxy: true,
    })
);
app.use(passport.initialize());
app.use(passport.session());
config.passport.setupPassport();

config.log.system("I am Here");
// My middlewares
app.use(mw.setFlash());

// Routes
app.use("/", routes.index);
app.use("/auth", routes.auth);
app.use("/groups", routes.todoGroups.groups);
app.use("/my", mw.tdGrps.setMyGroupId(), routes.todoGroups.oneGroup);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    config.log.error(err);
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
