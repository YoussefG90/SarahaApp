import jwt from 'jsonwebtoken';
import * as servicesDB from "../../DB/services.db.js"
import { UserModel } from "../../DB/models/user.js"
import RevokeToken from "../../DB/models/revokeToken.js";
import {roleEnum} from "../../DB/models/user.js"
import { nanoid } from 'nanoid';

export const signatureTypeEnum = {system : "system" , bearer : "Bearer"}
export const tokenTypeEnum = {refresh : "refresh" , access : "access"}
export const logoutEnum = {signoutFromAll : "signoutFromAll" , signout : "signout" , stayLoggedIn:"stayLoggedIn"}

export const generateToken = async ({payload={} ,signature = process.env.ACCESS_TOKEN_USER_SECRET ,
    options = { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION }} = {}) => {
    return jwt.sign(payload,signature,options)
}

export const generateRefreshToken = async ({payload={} ,signature = process.env.REFRESH_TOKEN_USER_SECRET ,
    options = {expiresIn : process.env.REFRESH_TOKEN_EXPIRATION}} = {}) => {
    return jwt.sign(payload,signature,options)
}

export const verfiyToken = async ({token="" ,signature = process.env.ACCESS_TOKEN_USER_SECRET } = {}) => {
    return jwt.verify(token , signature)
}


export const getSignature = async ({
    signatureEnum = signatureTypeEnum.bearer
} = {}) => {
    let signatures = {access : undefined , refresh : undefined}
    switch (signatureEnum) {
        case signatureTypeEnum.system:
            signatures.access = process.env.ACCESS_TOKEN_ADMIN_SECRET
            signatures.refresh = process.env.REFRESH_TOKEN_ADMIN_SECRET
            break;
    
        default:
            signatures.access = process.env.ACCESS_TOKEN_USER_SECRET
            signatures.refresh = process.env.REFRESH_TOKEN_USER_SECRET
            break;
    }

    return signatures
}


export const decodedToken = async ({authorization = "" , tokenType = tokenTypeEnum.access , next} = {}) => {
    const [bearer , token] = authorization?.split(" ")||[]
    if (!token || !bearer) 
    return next(new Error("Unauthorized" , {cause:401}))
    let signature = await getSignature({signatureEnum:bearer , tokenType})
    const decoded = await verfiyToken({token, signature:
         tokenType === tokenTypeEnum.access ? signature.access : signature.refresh});
    if (!decoded)
      return next(new Error("In Valid Token", { cause: 400 }));
    if (decoded.jti && await servicesDB.findOne({model:RevokeToken , filter:{jti:decoded.jti}})) {
        return next(new Error ("In-Vaild Tokens",{cause:401}))
    }
    const user = await servicesDB.findById({model:UserModel , id: decoded._id})
    if (!user) {
      return next(new Error ("Account Not Register",{cause:404}))
    }
    if (user.userTokens && decoded.iat * 1000 < new Date(user.userTokens).getTime()) {
        return next(new Error ("In-Vaild Tokens",{cause:401}))
    }
    if (user.changeTokensTime?.getTime() > decoded.iat * 1000) {
        return next(new Error ("In-Vaild Tokens",{cause:401}))
    }
    return {user , decoded}
}

export const generateNewTokens = async ({user} = {}) => {
    const signature = await getSignature({
        signatureEnum: user.role != roleEnum.user ? signatureTypeEnum.system : signatureTypeEnum.bearer 
    })
    const jti = nanoid()
    const accessToken = await generateToken({payload:{_id : user._id}, signature: signature.access ,
        options:{jwtid:jti , expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRATION)}})
    const refreshToken = await generateToken({payload:{_id : user._id}, signature: signature.refresh , 
        options:{jwtid:jti , expiresIn : Number(process.env.REFRESH_TOKEN_EXPIRATION)}})

    return { accessToken, refreshToken }
}



export const createRevokeToken = async ({req}={}) => {
      await servicesDB.create({model:RevokeToken , 
            data:[{
                jti:req.decoded.jti,
                expireDate:req.decoded.iat + Number(process.env.REFRESH_TOKEN_EXPIRATION),
                userId:req.user._id
            }]})
         return true
}