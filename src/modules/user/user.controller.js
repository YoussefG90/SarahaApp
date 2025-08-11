import * as auth from "../../middleware/authentication.middleware.js"
import { validation } from "../../middleware/Validation.js"
import { cloudFiles, fileValidation } from "../../utils/multer/Cloud.js"
import { localFiles } from "../../utils/multer/local.js"
import { endPoint } from "./user.authorization.js"
import * as services from "./user.service.js"
import *as validators from "./user.Validation.js"
import {Router} from "express"
const router = Router()

router.patch("/profile-img",auth.authentication(),...localFiles({customPath: "Users/Profile",validation: ["image"],
    fieldName: "image",multiple: false}),validation(validators.profileImg),services.profileImg)

router.patch("/cover-img",auth.authentication(),...localFiles({customPath: "Users/Profile",validation: ["image"],
    fieldName: "cover",multiple: false}),validation(validators.coverImg),services.coverImg)

router.patch("/cloud-profile-img",auth.authentication(),cloudFiles({validation: fileValidation.image}).single("image")
    ,validation(validators.cloudprofileImg),services.cloudProfileImg)

router.patch("/cloud-cover-img",auth.authentication(),cloudFiles({validation: fileValidation.image}).single("cover")
    ,validation(validators.cloudcoverImg),services.cloudCoverImg)


router.post("/logout" , auth.authentication(),validation(validators.logout), services.logout)
router.get("/profile" , auth.authentication(), services.getProfile)
router.patch("/{/:userId}freeze" , auth.authentication(),validation(validators.freeze),  services.freeze)
router.patch("/restore/:userId" , auth.authentication() , auth.authorization({accessRoles:endPoint.restore}),validation(validators.restore),  services.restore)
router.patch("/update" , auth.authentication(),validation(validators.updateBasicData), services.updateProfile)
router.patch("/update-password" , auth.authentication(),validation(validators.updatePassword), services.updatePassword)
router.patch("/update-email" , auth.authentication(),validation(validators.updateEmail), services.changeEmail)
router.delete("/delete/:userId" , auth.authentication(),auth.authorization({accessRoles:endPoint.delete}),validation(validators.deleteUser), services.deleteProfile)
router.get("/:userId" ,validation(validators.shareProfile), services.getProfileForOthers)
 
export default router  