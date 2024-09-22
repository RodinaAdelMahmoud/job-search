import companyModel from "../../../db/models/company.model.js";
import { asyncHandler } from "../../../utils/globalErrorHandler.js";
import appModel from './../../../db/models/application.model.js';


// ====================getCompany======================

export const getCompany = async (req,res,next) =>{
    const company = await companyModel.find({})
    res.status(200).json({msg:"done", company})
}


// ====================AddCompany======================
export const addCompany = asyncHandler(async (req,res,next) =>{
    const {companyName,description,industry,address,companyEmail,companyHR,numberOfEmployees} = req.body
    const company = await companyModel.create({companyName,description,industry,address,companyEmail,numberOfEmployees,companyHR,userId:req.user.id})
res.status(200).json({msg:"done",company})
})



// ====================updateCompany======================
export const updateCompany = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { companyName, numberOfEmployees, companyEmail, companyHR } = req.body;

    const updatedCompany = await companyModel.findOneAndUpdate(
        { _id: id, companyHR: req.user._id },   
        { companyName, numberOfEmployees, companyEmail, companyHR }, 
        { new: true, runValidators: true } 
    );

    if (!updatedCompany) {
        return next(new AppError('Company not found or unauthorized to update', 404));
    }

    // Return updated company details
    res.status(200).json({ msg: 'Company updated successfully', company: updatedCompany });
});


// ====================deleteCompany======================
export const deleteCompany = asyncHandler(async (req,res,next) =>{
    const {id} = req.params
    const company = await companyModel.findOneAndDelete({_id: id, userId: req.user.id},{new:true})
if(!company){
    return res.status(400).json({msg:"company not found"})
}

res.status(200).json({msg:"done",company})
})



// ====================getUserCompany======================
export const getUserCompany = asyncHandler(async (req,res,next) =>{
    const company = await companyModel.find({ userId: req.user.id})
    
    res.status(200).json({msg:"done",company})
})





// ====================SearchCompany======================

export const searchCompany = asyncHandler(async (req, res, next) => {
    const { companyName } = req.query;
    
    if (!companyName) {
        return next(new AppError("Company name is required", 400));
    }
    
    const companies = await companyModel.find({ companyName: { $regex: companyName, $options: 'i' } });
    
    if (companies.length === 0) {
        return res.status(404).json({ msg: 'No companies found' });
    }
    
    res.status(200).json({ msg: 'Companies found', companies });
});



// ====================getApplicationsForJob======================

export const getApplicationsForJob = asyncHandler(async (req, res, next) => {
    const { jobId } = req.params;
    const userId = req.user.id; 

    try {
        const company = await companyModel.findOne({ companyHR: userId });
        if (!company) {
            return next(new AppError('You are not authorized to view applications for this job', 403));
        }

        const job = await jobModel.findOne({ _id: jobId, companyId: company._id });
        if (!job) {
            return next(new AppError('Job not found or you do not have permission to view it', 404));
        }

        const applications = await appModel.find({ jobId }).populate('userId', 'firstName lastName email phone');

        res.status(200).json({ msg: 'Applications retrieved successfully', applications });
    } catch (error) {
        console.error('Error fetching applications:', error);
        next(new AppError('Failed to retrieve applications', 500));
    }
});
