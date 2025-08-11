import * as authservices from "./auth.service.js";
import * as auth from "../../middleware/authentication.middleware.js"
import * as otp from "../../middleware/otp.middleware.js"
import *as validators from "./auth.Validation.js"
import {Router} from "express"
import { tokenTypeEnum } from "../../utils/Security/token.js";
import { validation } from "../../middleware/Validation.js";
const router = Router()


router.post("/signup" ,validation(validators.signup), authservices.signup)
router.post("/signup-with-gmail" ,validation(validators.gmail), authservices.signupWithGmail)
router.post("/login" , validation(validators.login), authservices.login)
router.post("/login-with-gmail" ,validation(validators.gmail) , authservices.loginWithGmail)
router.post("/forget-password"  ,validation(validators.forgetPassword) ,authservices.forgetPassword)
router.get("/refresh", auth.authentication({tokenType:tokenTypeEnum.refresh}),authservices.getRefreshToken)
router.post("/request-otp",validation(validators.getOTP),otp.limitOtp, otp.getOtp())
router.patch("/verfiy-otp",validation(validators.verfiyOTP),otp.verfiy())






export default router