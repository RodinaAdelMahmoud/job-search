import mongoose from "mongoose";
export const companySchema = new mongoose.Schema({
    companyName:{
        type: String,
        required:[true, "name is required"],
        minLength:3,
        maxLength: 15,
        trim: true,
        unique:true
    },
    description:{
        type: String,
        minLength:5,
        maxLength:100,
        trim: true
    },
    industry:{
        type: String
    },
    address:[String],
    numberOfEmployees: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /^\d+-\d+$/.test(v);
            },
            message: props => `${props.value} is not a valid employee range! Use the format "min-max".`
        }
    },
    companyEmail:{
        type:String,
        required:[true, "Email is required"],
        trim: true,
        unique: true,
        lowercase: true
    },
    companyHR: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },

})
const companyModel = mongoose.model("company", companySchema)
export default companyModel;