import express from 'express';
import {
  loginController,
  registerController,
  updateController,
  updatePasswordController,
} from '../controller/user.controller.js';
import isLoggedIn from '../middlewares/isLoggedIn.js';

const router = express.Router();

router.post('/register', registerController);
router.post('/login', loginController);
router.put('/update', isLoggedIn, updateController);
router.put('/update/password', isLoggedIn, updatePasswordController);

export default router;