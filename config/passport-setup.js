const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { UserCreds, User } = require("./models-setup").models;
const bcrypt = require("bcrypt");
const errors = require("./errors");

const verifyUser = async (username, password, done) => {
    try {
        const incorrectFlash = {
            message: errors.UsernamePasswordIncorrect(),
        };
        const userCreds = await UserCreds.findOne({
            where: { username },
        });
        if (!userCreds) return done(null, false, incorrectFlash);
        const isMatch = await bcrypt.compare(password, userCreds.password);
        if (isMatch) return done(null, { id: userCreds.UserId });
        done(null, false, incorrectFlash);
    } catch (err) {
        done(err, false);
    }
};

const localStrategy = new LocalStrategy({}, verifyUser);

const setupPassport = () => {
    passport.use(localStrategy);
    passport.serializeUser((user, done) => {
        const { id } = user;
        done(null, id);
    });
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findByPk(id);
            done(null, user);
        } catch (err) {
            done(err, false);
        }
    });
};

module.exports = {
    setupPassport,
    localStrategy,
};
