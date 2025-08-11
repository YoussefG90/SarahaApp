import {Schema , model} from "mongoose"

export let genderEnum = {male:"male" , female:"female"}
export let roleEnum = {user:"User" , admin:"Admin"}
export let providerEnum = {system:"system" , google:"google"}

const userSchema = new Schema ({
    firstName:{type:String , required : true , minLength:2 , maxLength:[20 , "Max Length is 20 char"]},
    lastName:{type:String , required : true, minLength:2 , maxLength:[20 , "Max Length is 20 char"]},
    username:{type:String , required : function(){
            console.log({DOC:this});return this.provider === providerEnum.system ? true : false} , unique:true},
    email:{type:String , required : true , unique:true},
    confirmEmail: {type: Boolean,default: false},
    confirmNewEmail: {type: Boolean,default: false},
    emailOTP: String,
    emailOTPExpires: Date,
    passwordOTP: String,
    passwordOTPExpires: Date,
    tempEmail:String,
    passwordRest:{type: Boolean,default: false},
    password:{type:String , 
        required : function(){
            console.log({DOC:this});return this.provider === providerEnum.system ? true : false} , select:false},
    provider:{type:String , enum: Object.values(providerEnum), default:providerEnum.system},    
    phone:String,
    gender:{type:String , enum : {values : Object.values(genderEnum),
       message:`Only Allowed Gender Is ${genderEnum}`},
       default:genderEnum.male},
    role:{type:String , enum : {values : Object.values(roleEnum),
       message:`Only Allowed Roles Is ${roleEnum}`},
       default:roleEnum.user},
    failattempts:{type:Number , default:0}, 
    bannedUntil: { type: Date, default: null },
    lastRequestAt: { type: Date, default: null },     
    deletedAt:Date,
    deletedBy:{type:Schema.ObjectId, ref:"user"},
    restoredAt:Date,
    restoredBy:{type:Schema.ObjectId, ref:"user"}, 
    changeTokensTime:Date,
    profilePicture:{data:Buffer , contentType: String},
    CoverPicture:{data:Buffer , contentType: String},
    cloudProfilePicture:{secure_url:String , public_id:String},
    cloudCoverPicture:{secure_url:String , public_id:String}
}, {
    timestamps:true,
    id:true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
}) 

userSchema.virtual("fullName").set(function(value) {
    const [firstName , lastName] =value?.split(" ") || [];
    this.set({firstName,lastName})
}).get(function() {return this.firstName + " " + this.lastName})


userSchema.virtual("Messages",{
    localField:"_id",
    foreignField:"userId",
    ref:"message"
}) 



export const UserModel = model('user' , userSchema) 
UserModel.syncIndexes()