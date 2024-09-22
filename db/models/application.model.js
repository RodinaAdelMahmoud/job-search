import mongoose from "mongoose";
const appSchema = new mongoose.Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, 
        ref: 'job', 
        required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, 
        ref: 'user', 
        required: true },
    userTechSkills: { type: [String], 
        required: true },
    userSoftSkills: { type: [String], 
        required: true },
    userResumeUrl: { type: String, 
        required: true }})

        const appModel = mongoose.model("app", appSchema)
        export default appModel