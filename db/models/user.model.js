import mongoose from "mongoose"
import { systemRoles } from "../../utils/systemRoles.js";
const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required:[true, "name is required"],
    minLength:3,
    maxLength: 15,
    trim: true
    },
    lastName:{
        type:String,
        required:[true, "name is required"],
        minLength:3,
        maxLength: 15,
        trim: true    },

email:{
    type:String,
    required:[true, "Email is required"],
    trim: true,
    unique: true,
    lowercase: true
},
password:{
    type:String,
    required:[true, "Password is required"],
    trim: true
},

recoveryEmail:{
    type:String,
    required:true,
    
},
phone:[String],
confirmed:{
    type: Boolean,
    default: false
},
status:{
    type: Boolean,
    default: false
},

birthday: {  type: Date,
    required: true,
    trim: true
 },

role:{
    type:String,
    enum : Object.values(systemRoles),
    default: "user"


},
otp:String

},{
    timestamps: true,
    versionKey: false,
}) 

const userModel = mongoose.model("users", userSchema)
export default userModel;