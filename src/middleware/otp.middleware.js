import { asyncHandler, successResponse } from "../utils/response.js";
import * as servicesDB from "../DB/services.db.js"
import { UserModel } from "../DB/models/user.js";
import {generateRandomOTP} from "../modules/auth/auth.service.js"
import { decryptEncryption, generateEncryption } from "../utils/Security/encryption.js";
import {emailEvent} from "../utils/events/email.js"

export const typeEnum = {email : "email" , forgetPassword : "forgetpasword" , newEmail : "newemail"}


export const getOtp = () => {
  return asyncHandler (
  async (req,res,next) =>{
    const { email  , type} = req.body;
    const user = await servicesDB.findOne({model:UserModel, filter: { email }});
    if (!user) {
      return next(new Error ("User Not Found" , {cause: 404}))
    }
      switch (type) {
        case typeEnum.email: 
            const newOtp = generateRandomOTP()
            const encryptOtp = await generateEncryption({plaintext:newOtp})
            await servicesDB.findByIdAndUpdate({model:UserModel , id: user._id 
             ,data:{emailOTP:encryptOtp , emailOTPExpires:Date.now()+300000}})
            await emailEvent.emit("Confirm Email" ,{to:email , otp:newOtp})
            return successResponse({res,message:"OTP Send To Email"});
        case typeEnum.forgetPassword:
              const passwordOtp = generateRandomOTP()
            const encryptPasswordOtp = await generateEncryption({plaintext:passwordOtp})
            await servicesDB.findByIdAndUpdate({model:UserModel , id: user._id 
             ,data:{passwordOTP:encryptPasswordOtp , passwordOTPExpires:Date.now()+300000}})
            await emailEvent.emit("Confirm Email" ,{to:email , otp:passwordOtp})
            return successResponse({res,message:"OTP Send To Email"});
        default:
           return next(new Error("Invalid verification type"));
        case typeEnum.newEmail:
            const { newEmail } = req.body;
            if (!newEmail) {
              return next(new Error("New email is required", { cause: 400 }));
            }  
            const emailOtp = generateRandomOTP()
            const encryptEmailOtp = await generateEncryption({plaintext:emailOtp})
            await servicesDB.findByIdAndUpdate({model:UserModel , id: user._id 
             ,data:{emailOTP:encryptEmailOtp , emailOTPExpires:Date.now()+300000 , tempEmail:newEmail}})
            await emailEvent.emit("Confirm Email" ,{to:email , otp:emailOtp})
            return successResponse({res,message:"OTP Send To Email"}); 
      } 
})}




// const otpRequestTracker = new Map();
// export const limitOtp = (req, res, next) => {
//   const key = req.body.email;
//   if (!key)  
//    return successResponse({res,message:"Email is Required"}) 
//   const now = Date.now();
//   const tracker = otpRequestTracker.get(key);
//   if (!tracker) {
//     otpRequestTracker.set(key, {
//       count: 1,
//       lastRequest: now,
//       blockedUntil: null,
//     });
//     return next();
//   }
//   const { count, lastRequest, blockedUntil } = tracker;
//   if (blockedUntil && now < blockedUntil) {
//     const waitMinutes = Math.ceil((blockedUntil - now) / (60 * 1000));
//     return successResponse({res,message:`You are blocked. Try again in ${waitMinutes} minutes`,status:429})
//   }
//   if (blockedUntil && now >= blockedUntil) {
//     otpRequestTracker.set(key, {
//       count: 1,
//       lastRequest: now,
//       blockedUntil: null,
//     });
//     return next();
//   }
//   const twoMinutes = 2 * 60 * 1000;
//   if (now - lastRequest < twoMinutes) {
//     const waitMinutes = Math.ceil((twoMinutes - (now - lastRequest)) / (60 * 1000));
//     return successResponse({res,message:`Please wait ${waitMinutes} more minutes before requesting a new OTP`,status:429})
//   }
//   const newCount = count + 1;
//   if (newCount > 5) {
//     otpRequestTracker.set(key, {
//       count: 0,
//       lastRequest: now,
//       blockedUntil: now + 5 * 60 * 1000, 
//     })
//     return successResponse({res,message:"Too many OTP requests. You are blocked for 5 minutes",status:429})
//   }
//   otpRequestTracker.set(key, {
//     count: newCount,
//     lastRequest: now,
//     blockedUntil: null,
//   })
//   return next()
// }


export const limitOtp = async (req, res, next) => {
  const email = req.body.email;
  if (!email) 
    return successResponse({ res, message: "Email is Required", status: 400 });

  const now = new Date();
  const user = await servicesDB.findOne({model:UserModel, filter:{email} });

  if (!user) 
    return successResponse({ res, message: "User not found", status: 404 });

  if (user.bannedUntil && user.bannedUntil > now) {
    const waitMs = user.bannedUntil - now; 
    const waitMinutes = Math.floor(waitMs / 60000);
    const waitSeconds = Math.floor((waitMs % 60000) / 1000);
    return successResponse({
      res,
      message: `You are blocked. Try again in ${waitMinutes}m ${waitSeconds}s`,
      status: 429,
    });
  }

  if (user.bannedUntil && user.bannedUntil <= now) {
    user.failattempts = 1; 
    user.lastRequestAt = now;
    user.bannedUntil = null;
    await user.save();
    return next();
  }

  if (user.lastRequestAt && now - user.lastRequestAt < 2 * 60 * 1000) {
    const waitMs = 2 * 60 * 1000 - (now - user.lastRequestAt);
    const waitMinutes = Math.floor(waitMs / 60000);
    const waitSeconds = Math.floor((waitMs % 60000) / 1000);
    return successResponse({
      res,
      message: `Please wait ${waitMinutes}m ${waitSeconds}s before requesting a new OTP`,
      status: 429,
    });
  }

  user.failattempts = (user.failattempts || 0) + 1;

  if (user.failattempts > 5) {
    user.failattempts = 0;
    user.bannedUntil = new Date(now.getTime() + 5 * 60 * 1000);
    await user.save();
    return successResponse({
      res,
      message: "Too many OTP requests. You are blocked for 5 minutes",
      status: 429,
    });
  }

  user.lastRequestAt = now;
  await user.save();

  return next();
};




export const verfiy = () => {
  return asyncHandler (
    async (req,res,next) => {
        const {email , otp , type} = req.body
        const user = await servicesDB.findOne({model:UserModel, filter:{email}})
        if (!user) {
          return next(new Error ("User Not Found" , {cause:404}))
        }
        switch (type) {
          case typeEnum.email:
              const decoded = await decryptEncryption({ciphertext:user.emailOTP})
              if (otp !== decoded) {
                return next(new Error ("Invaild OTP"))
              }
              if (Date.now() > user.emailOTPExpires) {
                return next(new Error("OTP has Expired"))
              }
              await servicesDB.findByIdAndUpdate({model:UserModel,id:user.id ,
              data:{confirmEmail:true , emailOTP:undefined, emailOTPExpires: undefined}})
              return successResponse({res,message:"Email confirmed successfully" , status:200});

          case typeEnum.forgetPassword:   
              const decodedPassword = await decryptEncryption({ciphertext:user.passwordOTP})
              if (otp !== decodedPassword) {
                return next(new Error ("Invaild OTP"))
              }
              if (Date.now() > user.passwordOTPExpires) {
                return next(new Error("OTP has Expired"))
              }
              await servicesDB.findByIdAndUpdate({model:UserModel,id:user.id ,
              data:{passwordOTP:undefined, passwordOTPExpires: undefined , passwordRest:true}})
              return successResponse({res,message:"Password OTP confirmed successfully" , status:200});

          case typeEnum.newEmail:   
              const decodedEmail = await decryptEncryption({ciphertext:user.emailOTP})
              if (otp !== decodedEmail) {
                return next(new Error ("Invaild OTP"))
              }
              if (Date.now() > user.emailOTPExpires) {
                return next(new Error("OTP has Expired"))
              }
              await servicesDB.findByIdAndUpdate({model:UserModel,id:user.id ,
              data:{confirmNewEmail:true , emailOTP:undefined, emailOTPExpires: undefined}})
              return successResponse({res,message:"Email confirmed successfully" , status:200});     
          default:
             return next(new Error("Invalid verification type"));
            
        }
        
        
    }
  )
}