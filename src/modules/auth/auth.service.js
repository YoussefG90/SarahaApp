import {providerEnum, roleEnum, UserModel} from "../../DB/models/user.js"
import * as hash from "../../utils/Security/hash.js"
import * as encrypt from '../../utils/Security/encryption.js'
import { asyncHandler, successResponse } from "../../utils/response.js";
import * as ServicesDB from "../../DB/services.db.js"
import * as tokens from "../../utils/Security/token.js"
import {emailEvent} from "../../utils/events/email.js"
import {OAuth2Client} from 'google-auth-library'

export const generateRandomOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

async function verify(idToken) {
    const client = new OAuth2Client();
    const ticket = await client.verifyIdToken({ 
          idToken,
          audience: process.env.WEB_CLIENT_ID,                                                                        
    });
        const payload = ticket.getPayload();
        return payload                                                                
} 

export const signupWithGmail = asyncHandler(
    async (req,res,next) =>{
       const {idToken} = req.body
       const {email_verified , name , picture , email} = await verify(idToken)
       if (!email_verified) {
            return next(new Error ("Email Not Verified"))
       }
        const user = await ServicesDB.findOne({model:UserModel , filter:{email}})
       if (user) {
            if (user.provider === providerEnum.google) {
                return loginWithGmail(req,res,next)
            }
            return next(new Error ("Email Exist" , {cause: 409}))
        }
        const newUser = await ServicesDB.create({model:UserModel , 
            data:[{confirmEmail:true , fullName:name , email, provider:providerEnum.google}]
        })
        const Tokens = await tokens.generateNewTokens({user:newUser})
        return successResponse({res,status:201 ,data:{Tokens}}) 
}) 

export const signup = asyncHandler(
    async (req,res,next) => {
        const {firstName , lastName ,username ,email,password,phone,gender} = req.body
        if (await ServicesDB.findOne({model:UserModel , filter:{email}})) {
            return next(new Error ("Email Exist" , {cause: 409}))
        }
        const otp = generateRandomOTP()
        const encryptOTP = await encrypt.generateEncryption({ plaintext: otp })
        const encryptPhone = await encrypt.generateEncryption({plaintext:phone})
        const hashedPassword = await hash.generateHash({plaintext:password})
        const [user] = await ServicesDB.create({model:UserModel,
        data:[{firstName,lastName, username , email ,password:hashedPassword ,
             phone:encryptPhone , gender, emailOTP: encryptOTP,
             emailOTPExpires: Date.now() + 300000}]})
             await emailEvent.emit("Confirm Email" ,{to:email , otp:otp})
        return successResponse({res, message: "Account Created Check your Email To Confirm Account",
             status:201 , data:{user}})
    }
    
)


export const login = asyncHandler (
    async (req,res,next) =>{
        const {email , password} = req.body
        const user = await ServicesDB.findOne({model:UserModel , 
            filter:{email , deletedAt: {$exists:false}}, select: "+password"})
        if (!user) {
            return next(new Error("User Not Found", {cause:404}))
        }    
        const checkPassword = await hash.compareHash({plaintext:password , hashValue: user.password})
        const checkOtp = await ServicesDB.findOne({model:UserModel , 
            filter:{ _id: user._id, confirmEmail:true}})
        if (!checkOtp) {
            return next(new Error ("Email Not Confirmed", {cause:400}))
        }
        if (!user || !checkPassword) {
            return next(new Error("Invalid Login Data", {cause:400}))
        }
        const Tokens = await tokens.generateNewTokens({user})
        return successResponse({res, message:"Login Successfully" ,status:200 , data:{Tokens}}) 

    }
)


export const loginWithGmail = asyncHandler (
    async (req,res,next) =>{
        const {idToken} = req.body
        const {email , email_verified} = await verify(idToken)
        if (!email_verified) {
            return next(new Error ("Email Not Confirmed", {cause:400}))
        }
        const user = await ServicesDB.findOne({model:UserModel , filter:{email , provider: providerEnum.google}, select: "+password"})
        if (!user) {
            return next(new Error("Invalid Login Data OR Provider", {cause:400}))
        }
        const Tokens = await tokens.generateNewTokens({user})
        return successResponse({res, message:"Login Successfully" ,status:200 , data:{Tokens}}) 
})


export const forgetPassword = asyncHandler (
    async (req,res,next) => {
        const {email , newPassword} = req.body
        const user = await ServicesDB.findOne({model:UserModel , filter:{email}})
        if (!user) {
            return next(new Error("User Not Found",{cause:404}))
        }
        if (!user.passwordRest) {
            return next(new Error("Please Confirm Rest OTP"))
        }
        const hashedPassword = await hash.generateHash({plaintext:newPassword})
        const userData = await ServicesDB.findOneAndUpdate({model:UserModel , filter:{_id:user._id}, 
            data:{password:hashedPassword , passwordRest:false , userTokens:Date.now() , 
                changeTokensTime:new Date()
            }})
        return successResponse({res,message:"Password Updated Successfully",status:200 , data:{userData}})   
})




export const getRefreshToken = asyncHandler (
    async (req,res,next) => {  
    const Tokens = await tokens.generateNewTokens({user: req.user})
    return successResponse({res, message:"Done" ,status:200 , data:{Tokens}})
})
