import {Schema , model} from "mongoose"


const messageSchema = new Schema ({
    attachment:[{secure_url:String , public_id:String}],
    content :{type:String , required:function (){
        return this.attachment?.length < 1 ? true :false
    } , minLength:2 , maxLength:[20000,"You Have Reached MaxLength"]},
    userId:{type:Schema.ObjectId , ref:"user" , required: true},
    senderId:{type:Schema.ObjectId, ref:"user"},
    isAnonymous: { type: Boolean, default: true } 
},{
    timestamps:true,
    id:true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})






const MessageModel = model('message' , messageSchema)
export default MessageModel
MessageModel.syncIndexes()