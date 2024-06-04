const Joi = require("joi")

const validation = {
    signUpSchema: Joi.object({
        userName: Joi.string()
            .required()
        ,
        email: Joi.string()
            .email()
            .required()
            .lowercase(true)
        ,
        Gmail_Acc: Joi.string()
            .email()
            .required()
            .lowercase(true)
        ,
        password: Joi.string()
            .pattern(new RegExp(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,30}$/))
            .message("Password in signUp must be at least 8 characters long and include a mix of uppercase, lowercase, numbers.")
            .required()
            .min(8)
        ,
        role: Joi.string()
        ,
        Country: Joi.string()
        ,
        cityOrTwon: Joi.string()
        ,
        details: Joi.string()
        ,
        phone: Joi.string()
        ,
        age: Joi.number()
        ,
    }),
    loginSchema: Joi.object({
        email: Joi.string()
            .email()
            .required()
        ,
        password: Joi.string()
            .pattern(new RegExp(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,30}$/))
            .message("Password in login must be at least 8 characters long and include a mix of uppercase, lowercase, numbers.")
            .required()
            .min(8)
        ,
    }),
    updatePassword: Joi.object({
        oldPassword: Joi.string()
            .pattern(new RegExp(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,30}$/))
            .message("Password must be at least 8 characters long and include a mix of uppercase, lowercase, numbers.")
            .required()
            .min(8)
        ,
        newPassword: Joi.string()
            .pattern(new RegExp(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,30}$/))
            .message("Password must be at least 8 characters long and include a mix of uppercase, lowercase, numbers.")
            .required()
            .min(8)
        ,
    })
}
module.exports = validation
