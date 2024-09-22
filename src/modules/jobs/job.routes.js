import express from "express";
import * as JC from './job.controller.js';
import { auth } from './../../middleware/auth.js';
import  {multerHost,validExtension}  from "../../service/multer.js";
const router = express.Router();


router.post('/', auth(), JC.addJob);
router.patch('/:id', auth(), JC.updateJob);
router.delete('/:id', auth(), JC.deleteJob);
router.get('/company', auth(), JC.getAllJobsWithCompanies);
router.get('/all-company', auth(), JC.getJobsByCompany);
router.get('/jobs', auth(), JC.getFilteredJobs);
router.post('/apply', auth(), multerHost(validExtension.pdf).single('pdf'), JC.applyToJob);


export default router;
