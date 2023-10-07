// let a = {
//         1: 11,
//         2: 22,
//     },
//     b = {
//         3: 33,
//         4: 44,
//     },
//     c = {
//         5: 55,
//         6: 66,
//     };
// let o = { a, b, c };

// a[10] = 1010;

// console.log(o);

const sqlz = require("sequelize");
require('dotenv').config();
// const v = new sqlz.ValidationError();
// const e = new sqlz.Error();

// const o = {};
// function isClass(obj) {
//     const isCtorClass =
//         obj.constructor &&
//         obj.constructor.toString().substring(0, 5) === "class";
//     if (obj.prototype === undefined) {
//         return isCtorClass;
//     }
//     const isPrototypeCtorClass =
//         obj.prototype.constructor &&
//         obj.prototype.constructor.toString &&
//         obj.prototype.constructor.toString().substring(0, 5) === "class";
//     return isCtorClass || isPrototypeCtorClass;
// }
// for (const x in sqlz) {
//     const exclude = [sqlz.ExclusionConstraintError, sqlz.ForeignKeyConstraintError, sqlz.OptimisticLockError, sqlz.UniqueConstraintError, sqlz.UnknownConstraintError]
//     if (isClass(sqlz[x]) && RegExp("Error").test(x) && !exclude.includes(sqlz[x])) {
//         // console.log(`${x} : ${v instanceof sqlz[x]}`);
//         o[x] = [];
//         // console.log(x);
//         const insx = new sqlz[x]("sth");
//         for (const y in sqlz) {
//             if (
//                 isClass(sqlz[y]) &&
//                 RegExp("Error").test(y) &&
//                 insx instanceof sqlz[y]
//             ) {
//                 o[x].push(y);
//             }
//         }
//     }
// }

// console.log(o);


const sequelize = new sqlz.Sequelize(process.env.DB_URI);
const models = require('./models');
(async function(){
    await sequelize.authenticate();
    const {UserCreds, User} = models.setupModels();
    
    
})()
