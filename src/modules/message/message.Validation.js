import joi from "joi"
import { genralFields } from "../../middleware/Validation.js"
import { fileValidation } from "../../utils/multer/Cloud.js"


export const idCheck = {
    params:joi.object().keys({
        id:genralFields.id.required()
    }).required()
}



export const createMessage = {
    params:joi.object().keys({
            id:genralFields.id.required()
    }).required(),
    body:joi.object().keys({
            content:joi.string().min(2).max(20000).required()
    }),
    file:joi.array().items(
        joi.object().keys({
            fieldname:genralFields.file.fieldname.valid("attachment"),
            originalname:genralFields.file.originalname,
            encoding:genralFields.file.encoding,
            mimetype:genralFields.file.mimetype.valid(...Object.values(fileValidation.image)),
            destination:genralFields.file.destination,
            filename:genralFields.file.filename,
            path:genralFields.file.path,
            size:genralFields.file.size
        }).required()
    ).max(2)
}
