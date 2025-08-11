import joi from "joi"
import { genralFields } from "../../middleware/Validation.js"


export  const signup = {
    body:joi.object().keys({
        firstName:genralFields.name.required(),
        lastName:genralFields.name.required(),
        username:genralFields.userName.required(),
        email:genralFields.email.required(),
        password:genralFields.password.required(),
        confirmPassword:genralFields.confirmPassword.required(),
        phone:genralFields.phone.required()
    }).required()

}

export  const login = {
    body:joi.object().keys({
        email:genralFields.email.required(),
        password:genralFields.password.required(),
    }).required()
}

export  const getOTP = {
    body:joi.object().keys({
        email:genralFields.email.required(),
        type:joi.string().valid('email','forgetpasword','newemail').required()
    }).required()
}
 
export  const verfiyOTP = {
    body:joi.object().keys({
        email:genralFields.email.required(),
        otp:genralFields.otp.required(),
        type:joi.string().valid('email','forgetpasword','newemail').required()
    }).required()
}

export  const gmail = {
    body:joi.object().keys({
        idToken:joi.string().required(),
    }).required()
}


export const forgetPassword = {
    body:joi.object().keys({
        email:genralFields.email.required(),
        newPassword:genralFields.password.required()
    }).required()
}