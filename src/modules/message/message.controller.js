import { Router } from "express";
const router = Router()
import * as services from "./message.service.js"
import { authentication , optionalAuthentication} from "../../middleware/authentication.middleware.js";
import *as validators from "./message.Validation.js"
import { validation } from "../../middleware/Validation.js"
import { cloudFiles, fileValidation } from "../../utils/multer/Cloud.js";


router.post("/:id", optionalAuthentication,validation(validators.createMessage),
    cloudFiles({validation:fileValidation.image}).array("attachment", 2), services.createMessage);
router.delete("/delete/:id" ,authentication(),validation(validators.idCheck), services.deleteMessage)
router.delete("/delete" ,authentication(), services.deleteAllMessages)
router.get("/getone/:id" ,authentication(), validation(validators.idCheck),services.getMessage)
router.get("/" ,authentication(), services.getAllMessages)



export default router