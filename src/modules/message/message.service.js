import MessageModel from "../../DB/models/message.js"
import { asyncHandler, successResponse } from "../../utils/response.js"
import * as ServicesDB from "../../DB/services.db.js"
import { UserModel } from "../../DB/models/user.js";
import { uploadFiles } from "../../utils/multer/Cloudinary.js";



export const createMessage = asyncHandler(async (req, res, next) => {
    const { content } = req.body;
    const userId = req.params.id;
    const user = await ServicesDB.findOne({model:UserModel ,
        filter:{_id:userId , deletedAt:{$exists:false} , confirmEmail:true}})
    if (!user) {
        return next(new Error("User not found", { cause: 404 }));
    }
    let attachment = []
    if (req.files?.length) {
        attachment = await uploadFiles({files:req.files , path:`message/${userId}`})
    }
    let messageData;
    if (req.user && req.user._id) {
        messageData = {content ,attachment , isAnonymous: false, senderId: req.user._id,userId: userId}
    } else {messageData = {content,attachment,isAnonymous: true, userId: userId , senderId:undefined}
}
    const createdMessage = await ServicesDB.create({model: MessageModel ,data:[messageData]})
    return successResponse({res,status: 201,data:{message: createdMessage }})
})




export const getAllMessages = asyncHandler(
    async(req,res,next)=>{
        const user = await ServicesDB.findById({model:UserModel,id:req.user._id})
        if (!user) {
            return next(new Error ("User Not Found" , {cause:404}))
        }
        const allData = await ServicesDB.findAll({model:MessageModel,
             filter : {userId: req.user._id},select:"content , -_id"})
        return successResponse({res,status:200,data:{allData}})
})



export const getMessage = asyncHandler (
    async(req,res,next) =>{
        const messageId = req.params.id
        const user = await ServicesDB.findById({model:UserModel,id:req.user._id})
        if (!user) {
            return next(new Error ("User Not Found" , {cause:404}))
        }
        const message = await ServicesDB.findOne({model:MessageModel,filter:{_id:messageId}})
        if (!message) {
            return next(new Error ("Message Not Found" , {cause:404}))
        }
        if (message.userId.toString() !== req.user._id.toString()) {
            return next(new Error("Not Authorized to Get this message", { cause: 403 }));
        }
            return successResponse({res,status:200,data:{message}})
})



export const deleteAllMessages = asyncHandler (
    async (req,res,next) =>{
        const user = await ServicesDB.findById({model:UserModel,id:req.user._id})
        if (!user) {
            return next(new Error ("User Not Found" , {cause:404}))
        }
        await ServicesDB.deleteMany({model:MessageModel,filter:{userId: user._id}})
        return successResponse({res,message:"All Messages Deleted Successfully",status:200})
})




export const deleteMessage = asyncHandler(
    async (req,res,next) =>{
        const messageId = req.params.id
        const user = await ServicesDB.findById({model:UserModel,id: req.user._id})
        if (!user) {
            return next(new Error ("User Not Found" , {cause:404}))
        }
        const message = await ServicesDB.findOne({model:MessageModel, filter:{_id:messageId}})
        if (!message) {
            return next(new Error ("Message Not Found" , {cause:404}))
        }
        if (message.userId.toString() !== req.user._id.toString()) {
            return next(new Error("Not Authorized to delete this message", { cause: 403 }));
        }
        await ServicesDB.findByIdAndDelete({model:MessageModel, id:messageId})
            return successResponse({res,message:"Message Deleted Successfully",status:200})
    }
)