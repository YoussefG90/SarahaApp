import { Types } from "mongoose"
import { genderEnum } from "../DB/models/user.js"
import { asyncHandler } from "../utils/response.js"
import joi from "joi"


export const genralFields = {
    name:joi.string().min(2).max(20).pattern(new RegExp(/[A-Z][a-zA-Z][^#&<>\"~;$^%{}?]{1,20}$/)),
    userName:joi.string().min(2).max(30).pattern(new RegExp(/^[a-zA-Z\u0621-\u064Aء-ئ][^#&<>\"~;$^%{}?]{1,20}$/)),
    email:joi.string().email({minDomainSegments:2,maxDomainSegments:3,tlds:{allow:['com', 'net' ,'edu']}}),
    password:joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)),
    confirmPassword:joi.string().valid(joi.ref("password")),
    phone:joi.string().pattern(new RegExp(/^(002|\+2)?01[0125][0-9]{8}$/)),
    gender:joi.string().valid(...Object.values(genderEnum)),
    otp:joi.string().pattern(new RegExp(/^\d{6}$/)),
    id:joi.string().custom((value,helper)=>{
        return Types.ObjectId.isValid(value) || helper.message("In-Valid ObjectId")
    }),
    file:{
        fieldname:joi.string().required(),
        originalname:joi.string().required(),
        encoding:joi.string().required(),
        mimetype:joi.string().required(),
        finalPath:joi.string().required(),
        destination:joi.string().required(),
        filename:joi.string().required(),
        path:joi.string().required(),
        size:joi.number().positive().required()
    }
}



export const validation = (schema) => {
    return asyncHandler (
        async(req,res,next) => {
            const validationErrors = []
            for (const key of Object.keys(schema)) { 
                const validationResult = schema[key].validate(req[key] ,{abortEarly:false})
            if (validationResult.error) {
                validationErrors.push(validationResult.error?.details)
                 }
            }
            if (validationErrors.length) {
                return res.status(400).json({err_message:"Validation Error",error:validationErrors})
            }
            return next()
    })
}