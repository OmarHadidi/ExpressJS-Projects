const Joi = require("joi");

module.exports.signupSchema = Joi.object({
    name: Joi.string().alphanum().min(1).max(50).required(),
    email: Joi.string().email().required(),
    username: Joi.string().alphanum().min(1).max(50),
    password: Joi.string().min(6).required(),
});

module.exports.createTodoSchema = Joi.object({
    task: Joi.string().required(),
    status: Joi.boolean().default(false),
});
