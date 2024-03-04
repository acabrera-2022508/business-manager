import express from 'express';
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controller/category.controller.js';
import isLoggedIn from '../middlewares/isLoggedIn.js';

const router = express.Router();

router.get('/', isLoggedIn, getAllCategories);
router.post('/create', isLoggedIn, createCategory);
router.put('/update/:id', isLoggedIn, updateCategory);
router.delete('/delete/:id', isLoggedIn, deleteCategory);

export default router;
