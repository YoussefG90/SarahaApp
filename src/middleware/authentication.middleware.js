import { asyncHandler } from "../utils/response.js";
import * as servicesDB from "../DB/services.db.js"
import { UserModel } from "../DB/models/user.js";
import {decodedToken, signatureTypeEnum, verfiyToken} from "../utils/Security/token.js"
import { tokenTypeEnum } from "../utils/Security/token.js";


export const authentication = ({tokenType = tokenTypeEnum.access} = {}) =>{
    return asyncHandler( async  (req, res, next) => {
      const {user , decoded} = await decodedToken({authorization : req.headers.authorization , next , tokenType}) || {}
      req.user = user
      req.decoded = decoded
      return next()
})}


export const authorization = ({accessRoles = []} = {}) =>{
    return asyncHandler( async  (req, res, next) => {
      if (!accessRoles.includes(req.user.role)) {
        return next(new Error("Not Authorized",{cause:403}))
      }
      return next()
})}


export const optionalAuthentication = async (req, res, next) => {
  const authHeader = req.headers.authorization; 
  if (
  !authHeader?.startsWith(signatureTypeEnum.bearer) &&
  !authHeader?.startsWith(signatureTypeEnum.system)
) {
  return next();
}

  const token = authHeader.split(" ")[1];
  if (!token) {
    return next();
  }
  const decoded = await verfiyToken({token});
  const user = await servicesDB.findById({model:UserModel,id:decoded._id})
  if (user) {
    req.user = user;
  }
  return next();
};