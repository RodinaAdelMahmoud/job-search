import mongoose from "mongoose";
const jobSchema = new mongoose.Schema({
    jobTitle: {
        type: String,
        required: [true, "Job title is required"],
        minLength: 3,
        maxLength: 50,
        trim: true
    },
    jobLocation: {
        type: String,
        enum: ["hybrid", "remotely", "onsite"]
    },
    workingTime: {
        type: String,
        enum: ["part-time", "full-time"]
    },
    seniorityLevel: {
        type: String,
        enum: ["CTO", "Team-Lead", "Senior", "Mid-Level", "Junior"]
    },
    jobDescription: {
        type: String,
        required: [true, "Job description is required"]
    },
    technicalSkills: [{
        type: String,
        trim: true
    }],
    softSkills: [{
        type: String,
        trim: true
    }],
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'company', 
        required: true,
    },

})

const jobModel = mongoose.model("job", jobSchema)
export default jobModel;