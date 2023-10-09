const { constants } = require("../config");

class TodoGroupServices{
    static async createMainTodoGroup(user){
        const mainTdGrp = await user.createTodoGroup({
            title: constants.models.TodoGroups.MAIN_GROUP_TITLE
        });
        await mainTdGrp.addUser(user);
        return mainTdGrp;
    }
}

module.exports = TodoGroupServices