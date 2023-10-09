const { User, UserCreds } = require("../config").models;
const bcrypt = require("bcrypt");

class UserServices {
    /**
     * Creates `User` and his `UserCreds` in DB, with hashing password
     * @param {*} sequelize
     * @param {*} param1
     * @returns
     */
    static async registerUser(sequelize, { name, email, username, password }) {
        const hashedPwd = await bcrypt.hash(password, await bcrypt.genSalt(4));
        let user;
        await sequelize.transaction(async (t) => {
            user = await User.create({ name, email }, { transaction: t });
            await user.createUserCred(
                { username, password: hashedPwd },
                { transaction: t }
            );
        });
        return user;
    }
}

module.exports = UserServices;
