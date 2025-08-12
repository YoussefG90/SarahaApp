import joi from "joi"
import { genralFields } from "../../middleware/Validation.js"
import { logoutEnum } from "../../utils/Security/token.js"
import { fileValidation } from "../../utils/multer/local.js"

export const logout = {
    body:joi.object().keys({
        flag:joi.string().valid(...Object.values(logoutEnum)).default(logoutEnum.stayLoggedIn)
    }).required()
}
export const shareProfile = {
    params:joi.object().keys({
        userId:genralFields.id.required()
    }).required()
}


export const updatePassword = {
    body:logout.body.append({
        oldpassword:genralFields.password.required(),
        newpassword:genralFields.password.not(joi.ref("oldpassword")).required(),
        confirmpassword:genralFields.confirmPassword.required()
    }).required()

}

export const updateBasicData = {
    body:joi.object().keys({
        firstName:genralFields.name,
        lastName:genralFields.name,
        username:genralFields.userName,
        phone:genralFields.phone,
        gender:genralFields.gender
    }).required()

}

export const freeze = {
    params:joi.object().keys({
        userId:genralFields.id
    })
}


export const restore = {
    params:joi.object().keys({
        userId:genralFields.id.required()
    })
}


export const profileImg = {
    file:joi.object().keys({
                 fieldname:genralFields.file.fieldname.valid("image"),
                 originalname:genralFields.file.originalname,
                 encoding:genralFields.file.encoding,
                 mimetype:genralFields.file.mimetype.valid(...Object.values(fileValidation.image)),
                 finalPath:genralFields.file.finalPath,
                 destination:genralFields.file.destination,
                 filename:genralFields.file.filename,
                 path:genralFields.file.path,
                 size:genralFields.file.size
        }).required()
    
}


export const coverImg = {
    file:joi.object().keys({
                 fieldname:genralFields.file.fieldname.valid("cover"),
                 originalname:genralFields.file.originalname,
                 encoding:genralFields.file.encoding,
                 mimetype:genralFields.file.mimetype.valid(...Object.values(fileValidation.image)),
                 finalPath:genralFields.file.finalPath,
                 destination:genralFields.file.destination,
                 filename:genralFields.file.filename,
                 path:genralFields.file.path,
                 size:genralFields.file.size
        }).required()
    
}



export const cloudprofileImg = {
    file:joi.object().keys({
                 fieldname:genralFields.file.fieldname.valid("image"),
                 originalname:genralFields.file.originalname,
                 encoding:genralFields.file.encoding,
                 mimetype:genralFields.file.mimetype.valid(...Object.values(fileValidation.image)),
                 destination:genralFields.file.destination,
                 filename:genralFields.file.filename,
                 path:genralFields.file.path,
                 size:genralFields.file.size
        }).required()
    
}


export const cloudcoverImg = {
    file:joi.object().keys({
                 fieldname:genralFields.file.fieldname.valid("cover"),
                 originalname:genralFields.file.originalname,
                 encoding:genralFields.file.encoding,
                 mimetype:genralFields.file.mimetype.valid(...Object.values(fileValidation.image)),
                 destination:genralFields.file.destination,
                 filename:genralFields.file.filename,
                 path:genralFields.file.path,
                 size:genralFields.file.size
        }).required()
    
}


export const updateEmail = {
    body:joi.object().keys({
       email:genralFields.email.required(),
       newEmail:genralFields.email.not(joi.ref("email")).required()
    }).required()
}

export const deleteUser = {
    params:joi.object().keys({
        userId:genralFields.id.required()
    }).required()
}
