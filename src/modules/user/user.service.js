import { asyncHandler, successResponse } from "../../utils/response.js";
import { roleEnum, UserModel } from "../../DB/models/user.js";
import { decryptEncryption  , generateEncryption} from "../../utils/Security/encryption.js";
import * as ServicesDB from "../../DB/services.db.js"
import * as hash from "../../utils/Security/hash.js"
import RevokeToken from "../../DB/models/revokeToken.js";
import { createRevokeToken, logoutEnum } from "../../utils/Security/token.js";
import { deleteFolderByPrefix, destroyFile, uploadFile } from "../../utils/multer/Cloudinary.js";
import mongoose from "mongoose";



export const logout= asyncHandler (
    async (req,res,next) => {
        
        const {flag} = req.body
        let status = 200
        switch (flag) {
            case logoutEnum.signoutFromAll:
                await ServicesDB.updateOne({model:UserModel ,
                    filter:{_id:req.decoded._id},
                    data:{changeTokensTime:new Date()}
                })
                break;
        
            default:
                await createRevokeToken({req})
                status = 201
                break;
        }      
        return successResponse({res,status})
    }
)


export const getProfileForOthers = asyncHandler(
   async (req,res,next)=> {
    const {userId} = req.params
    const user = await ServicesDB.findOne({model:UserModel , 
        filter:{_id: userId ,confirmEmail:{$exists:true}} ,
    select:"username , firstName , lastName , gender , email , phone" , populate:[
        {path:"Messages"}
    ]})
    user.phone = await decryptEncryption({ciphertext: user.phone})
    return user ? successResponse({res, data:{user}}) : next(new Error ("User Not Found" , {cause:404}))
})



export const getProfile= asyncHandler (
    async (req,res,next) => {
        const user = await ServicesDB.findById({model:UserModel , id:req.user._id})
        if (!user) {
            return next(new Error ("User Not Found" , {cause:404}))
        }
        req.user.phone = await decryptEncryption({ciphertext: user.phone})
        return successResponse({res, data:{user:req.user}})
    }
)


export const updateProfile = asyncHandler (
    async (req,res,next) => {
        const {username} = req.body
        if (req.body.phone) {
            req.body.phone = await generateEncryption({plaintext:req.body.phone})
        }
        const checkUserName = await ServicesDB.findOne({model:UserModel,filter:{username}})
        if (checkUserName) {
            return next(new Error ("UserName Exist",{cause:409})) 
        }
        const user = await ServicesDB.findById({model:UserModel , id: req.user._id})
        if (!user) {
            return next(new Error("User Not Found",{cause:404}))
        }
        const updateData = await ServicesDB.findByIdAndUpdate({model:UserModel,id:req.user.id,data: req.body, options:{ new: true }})
         return successResponse({res,message:"User Updated Successfully",status:200 , data:{updateData}})

       
    }
)



export const updatePassword = asyncHandler (
    async (req,res,next) =>{
        const {oldpassword, newpassword,flag} = req.body
        let updateData = {}
        switch (flag) {
            case logoutEnum.signoutFromAll:
              updateData.changeTokensTime = new Date()
                break;
        case logoutEnum.signout:
          await createRevokeToken({req})
            default:
                break;
        }      
        const user = await ServicesDB.findById({ model: UserModel, id: req.user._id ,select:("+password")})
        const comparePassword = await hash.compareHash({plaintext:oldpassword,hashValue:user.password})
        if (!comparePassword) {
           return next(new Error ("Old Password Incorrect", {cause:400}))
        }
         const hashNewPassword = await hash.generateHash({plaintext:newpassword})
         const updateNewPassword = await ServicesDB.findOneAndUpdate({model:UserModel,filter:{_id:req.user._id},
            data:{password:hashNewPassword , userTokens:Date.now()},options:{ new: true }})
         return successResponse({res,message:"Password Updated Successfully",status:200,data:{updateNewPassword}})
    }
    
)


export const changeEmail = asyncHandler (
  async (req, res,next) =>{
      const {email , newEmail} = req.body
      const user = await ServicesDB.findOne({model:UserModel , filter :{email}})
      if (!user) {
        return next(new Error("Email already in use", { cause: 400 }))
      }
      if (!user.confirmNewEmail) {
        return next(new Error("Please Confirm Rest OTP")) 
      }
      const emailUpdate = await ServicesDB.findOneAndUpdate({model:UserModel ,filter:{_id:req.user._id},
        data:{confirmNewEmail:false , email:newEmail , userTokens:Date.now()}
      })
      return successResponse({res,message:"Email Updated Successfully",status:200 , data:{emailUpdate}})
})




export const deleteProfile = asyncHandler (
    async (req,res,next) => {
        const {userId} = req.params
        const user = await ServicesDB.findByIdAndDelete({model:UserModel , id:userId})
        if (!user) {
            return next(new Error("User Not Found",{cause:404}))
        }
        if (user.deletedCount) {
            return await deleteFolderByPrefix({prefix:`User/${userId}`})
        }
        return successResponse({res,message:"User deleted successfully",status:200})
    }
)


export const freeze = asyncHandler (
    async (req,res,next) => {
        const {userId} = req.params
        if (userId && user.role.id !== roleEnum.admin) {
            return next(new Error("Not Authorized",{cause:403}))
        }
        const user = await ServicesDB.findOneAndUpdate({model:UserModel , 
            filter:{_id:userId || req.user._id , deletedAt :{$exists:false}} , 
            data:{deletedBy : req.user._id , deletedAt:Date.now(),changeTokensTime:new Date() , $unset:{restoredBy:1 , restoredAt:1}}
        })
        return user ? successResponse({res, data:{user}}) 
            : next(new Error ("User Not Found" , {cause:404}))
    }
)


export const restore = asyncHandler (
    async (req,res,next) => {
        const adminid = req.user._id
        const {userId} = req.params
        const user = await ServicesDB.findOneAndUpdate({model:UserModel , 
            filter:{_id:userId, deletedAt :{$exists:true} ,deletedBy: { $ne: new mongoose.Types.ObjectId(adminid) } } , 
            data:{$unset:{deletedBy:1 , deletedAt:1} ,
             restoredBy: req.user._id , restoredAt:Date.now()}
        })
        return user ? successResponse({res, data:{user}}) 
            : next(new Error ("User Not Found" , {cause:404}))
    }
)


export const profileImg = asyncHandler (
    async (req,res,next) => {
        const user = await ServicesDB.findOneAndUpdate({
            model:UserModel , filter:{_id:req.user._id},
            data:{profilePicture : req.file.finalPath}
        })
        return successResponse({res,message:"Profile Picture Uploaded",status:201, data:{user}})
    }
)

export const coverImg = asyncHandler (
    async (req,res,next) => {
        const user = await ServicesDB.findOneAndUpdate({
            model:UserModel , filter:{_id:req.user._id},
            data:{CoverPicture : req.file.finalPath}
        })
        return successResponse({res,message:"Cover Picture Uploaded",status:201, data:{user}})
    }
)


export const cloudProfileImg = asyncHandler (
    async (req,res,next) => {
        const {secure_url , public_id} = await uploadFile({file:req.file ,path:`Users/${req.user._id}/Profile`})
        const user = await ServicesDB.findOneAndUpdate({
            model:UserModel , filter:{_id:req.user._id},
            data:{cloudProfilePicture : {secure_url , public_id}},
            options:{new:false}
        })
        if (user?.cloudProfilePicture?.public_id) {
            await destroyFile({public_id:user.cloudProfilePicture.public_id})
        }
        return successResponse({res,message:"Profile Picture Uploaded",status:201, data:{user}})
    }
)

export const cloudCoverImg = asyncHandler (
    async (req,res,next) => {
        const {secure_url , public_id} = await uploadFile({file:req.file ,path:`Users/${req.user._id}/Cover`})
        const user = await ServicesDB.findOneAndUpdate({
            model:UserModel , filter:{_id:req.user._id},
            data:{cloudCoverPicture : {secure_url , public_id}},
            options:{new:false}
        })
        if (user?.cloudCoverPicture?.public_id) {
            await destroyFile({public_id:user.cloudCoverPicture.public_id})
        }
        return successResponse({res,message:"Cover Picture Uploaded",status:201, data:{user}})
    }
)