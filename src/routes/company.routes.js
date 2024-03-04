import express from 'express';
import {
  createCompany,
  getAllCompanies,
  getCompaniesByCategory,
  getCompaniesByYearsExperience,
  getCompaniesSortedAZ,
  getCompaniesSortedZA,
  updateCompany,
  generateExcelReport,
} from '../controller/company.controller.js';
import isLoggedIn from '../middlewares/isLoggedIn.js';

const router = express.Router();

router.post('/create', isLoggedIn, createCompany);
router.get('/', isLoggedIn, getAllCompanies);
router.get('/category/:categoryName', isLoggedIn, getCompaniesByCategory);
router.get('/years/:years', isLoggedIn, getCompaniesByYearsExperience);
router.get('/sort/az', isLoggedIn, getCompaniesSortedAZ);
router.get('/sort/za', isLoggedIn, getCompaniesSortedZA);
router.put('/update/:id', isLoggedIn, updateCompany);
router.get('/report', generateExcelReport);

export default router;
