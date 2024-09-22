import express from "express";
import * as CC from './company.controllers.js';
import { auth } from './../../middleware/auth.js';
import { authorizeRoles } from "../../middleware/authorization.js";
import { systemRoles } from "../../../utils/systemRoles.js";
const router = express.Router();

router.get("/",CC.getCompany);
router.get("/user",auth([systemRoles.CompanyHR,systemRoles.user]),CC.getUserCompany);
router.post("/", auth([systemRoles.CompanyHR,systemRoles.user]),CC.addCompany);
router.patch("/:id", auth([systemRoles.CompanyHR,systemRoles.user]),CC.updateCompany);
router.delete("/:id", auth([systemRoles.CompanyHR,systemRoles.user]),CC.deleteCompany);
router.get('/search', auth([systemRoles.CompanyHR,systemRoles.user]), authorizeRoles(['Company-HR', 'user']), CC.searchCompany);


export default router;
