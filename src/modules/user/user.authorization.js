import { roleEnum } from "../../DB/models/user.js";




export const endPoint ={
    delete : [roleEnum.admin],
    restore : [roleEnum.admin]
}