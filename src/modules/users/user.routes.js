import express from "express";
import * as UC from './user.controller.js';
import { auth } from './../../middleware/auth.js';
import { systemRoles } from "../../../utils/systemRoles.js";

const router = express.Router();

router.post("/signUp", UC.signUp);
router.get("/", UC.getUsers);
router.get("/verifyEmail/:token", UC.verifyEmail);
router.post("/signIn", UC.signIn);
router.patch("/",auth([systemRoles.CompanyHR,systemRoles.user]), UC.updateUser);
router.get("/profile", auth([systemRoles.CompanyHR,systemRoles.user]), UC.getProfile);
router.delete("/", auth([systemRoles.CompanyHR,systemRoles.user]), UC.deleteAccount);
router.get("/:userId", auth([systemRoles.CompanyHR,systemRoles.user]), UC.getUserProfile); 
router.patch('/password', auth([systemRoles.CompanyHR,systemRoles.user]), UC.updatePassword);
router.post('/forgot-password',auth([systemRoles.CompanyHR,systemRoles.user]), UC.forgotPassword);
router.post('/reset-password',auth([systemRoles.CompanyHR,systemRoles.user]), UC.resetPassword);
router.get('/recovery-email', UC.getUsersByRecoveryEmail);

export default router;
