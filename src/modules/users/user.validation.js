import joi from "joi";

export const signUpValidation ={
    body: joi.object({
        firstName: joi.string().alphanum().min(3).max(15).message({
            "any.required": "name is required",
            "string.min":"name is too short"
        }).required(),
        lastName: joi.string().alphanum().min(3).max(15).message({
            "any.required": "name is required",
            "string.min":"name is too short"
        }).required(),
        email: joi.string().email().message({
            "any.required":"email is required"
        }).required(),
        recoveryEmail: joi.string().email().message({
            "any.required":"email is required"
        }).required(),
        password: joi.string().pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)).required(),



    }).options({presence:"required"})
}

export const signInValidation ={
    body: joi.object({
        email: joi.string().email().required(),
        password: joi.string().pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)).required(),
    })
}