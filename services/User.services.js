const {User, UserCreds} = require('../config').models;

class UserServices {
    /**
     * Creates `User` and his `UserCreds` in DB
     * @param {*} sequelize 
     * @param {*} param1 
     * @returns 
     */
    static async registerUser(sequelize, {name, email, username, hashedPwd}){
        let userCreds;
        await sequelize.transaction(async (t) => {
            const user = await User.create({ name, email }, { transaction: t });
            userCreds = await user.createUserCred(
                { username, password: hashedPwd },
                { transaction: t }
            );
        });
        return userCreds;
    }
}

module.exports = UserServices;
