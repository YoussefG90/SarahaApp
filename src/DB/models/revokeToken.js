import {Schema , model} from "mongoose"


const revokeTokenSchema = new Schema ({
    jti :{type:String , required:true , unique:true},
    expireDate:{type:Number , required:true },
    userId:{type:Schema.ObjectId , ref:"user" , required: true}
},{
    timestamps:true,

})


const RevokeToken = model('revoketoken' , revokeTokenSchema)
export default RevokeToken
RevokeToken.syncIndexes()