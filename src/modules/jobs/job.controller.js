import companyModel from "../../../db/models/company.model.js";
import jobModel from "../../../db/models/job.model.js";
import { asyncHandler } from "../../../utils/globalErrorHandler.js";
import { AppError } from './../../../utils/classError.js';
import cloudinary from './../../../utils/cloudinary.js';
import appModel from './../../../db/models/application.model.js';



// =====================AddJob===================
    export const addJob = asyncHandler(async (req, res, next) => {
        const { jobTitle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills ,companyId} = req.body;

        const newJob = await jobModel.create({
            jobTitle,
            jobLocation,
            workingTime,
            seniorityLevel,
            jobDescription,
            technicalSkills,
            softSkills,
            addedBy: req.user._id ,
            companyId
        });

        if (!newJob) {
            return next(new AppError('Failed to create job', 500));
        }

        res.status(201).json({ msg: 'Job added successfully', job: newJob });
    });


// =====================UpdateJob===================
export const updateJob = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { jobTitle } = req.body;

    const updatedJob = await jobModel.findOneAndUpdate(
        { _id: id, addedBy: req.user._id },
        { jobTitle }, 
        { new: true, runValidators: true } 
    );

    if (!updatedJob) {
        return next(new AppError('Job not found or unauthorized to update', 404));
    }

    res.status(200).json({ msg: 'Job updated successfully', job: updatedJob });
});

// ====================deleteJob======================
export const deleteJob = asyncHandler(async (req,res,next) =>{
    const {id} = req.params
    const job = await jobModel.findOneAndDelete({_id: id, userId: req.user.id},{new:true})
    if(!job){
        return res.status(400).json({msg:"job not found"})
    }
    
    res.status(200).json({msg:"done",job})
})



// ====================getAllJobsWithCompanies======================


export const getAllJobsWithCompanies = asyncHandler(async (req, res, next) => {
    try {
        console.log('Fetching all jobs with associated companies');

        const jobs = await jobModel.find({})
            .populate('companyId', 'companyName numberOfEmployees companyEmail'); 

        console.log('Jobs fetched:', jobs);

        if (!jobs || jobs.length === 0) {
            console.log('No jobs found'); 
            return next(new AppError('No jobs found', 404));
        }

        res.status(200).json({ msg: 'Jobs found', jobs });
    } catch (error) {
        console.error('Error fetching jobs:', error.message); 
        return next(new AppError('An error occurred while fetching jobs', 500));
    }
});


// ====================get All Jobs With Specific Companies======================
export const getJobsByCompany = asyncHandler(async (req, res, next) => {
    const { companyName } = req.query;

    if (!companyName) {
        return next(new AppError("Company name is required", 400));
    }

    const company = await companyModel.findOne({ companyName: { $regex: new RegExp(companyName, 'i') } });
    if (!company) {
        return next(new AppError('Company not found', 404));
    }

    const jobs = await jobModel.find({ companyId: company._id });
    if (jobs.length === 0) {
        return next(new AppError('No jobs found for the specified company', 404));
    }

    res.status(200).json({ msg: 'Jobs found', jobs });
});



// ====================Filtered Jobs=====================

export const getFilteredJobs = asyncHandler(async (req, res, next) => {
    const { workingTime, jobLocation, seniorityLevel, jobTitle, technicalSkills } = req.query;
    
    const query = {};
    if (workingTime) query.workingTime = workingTime;
    if (jobLocation) query.jobLocation = jobLocation;
    if (seniorityLevel) query.seniorityLevel = seniorityLevel;
    if (jobTitle) query.jobTitle = { $regex: new RegExp(jobTitle, 'i') };
    if (technicalSkills) query.technicalSkills = { $all: technicalSkills.split(',') }; 
    const jobs = await jobModel.find(query).populate('companyId', 'companyName numberOfEmployees companyEmail');
    
    if (!jobs || jobs.length === 0) {
        return next(new AppError('No jobs found matching the criteria', 404));
    }
    
    res.status(200).json({ msg: 'Jobs found', jobs });
});


export const applyToJob = asyncHandler(async (req, res, next) => {
    const { jobId, userTechSkills, userSoftSkills } = req.body;

    upload(req, res, async (err) => {
        if (err) {
            return next(err);
        }

        if (!req.file) {
            return next(new AppError('Resume file is required', 400));
        }

        const result = await cloudinary.uploader.upload(req.file.path);

        const newApplication = await appModel.create({
            jobId,
            userId: req.user._id,
            userTechSkills,
            userSoftSkills
        });

        if (!newApplication) {
            return next(new AppError('Failed to apply to job', 500));
        }

        res.status(201).json({ msg: 'Applied to job successfully', application: newApplication });
    });
});