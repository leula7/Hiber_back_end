import {Router} from 'express';
import { AuthLogin,AuthRegister } from '../controller/Auth.controller.js';

const router = Router();
  
  router.post('/register',AuthRegister);
  
  router.post('/login',AuthLogin);


export default router