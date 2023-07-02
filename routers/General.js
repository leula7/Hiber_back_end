import {Router} from 'express';
import { branch, branchname, cats, items, oneitem } from '../controller/general.conntroller.js';

const router = Router();

  router.get('/branch',branch);

  router.get('/branchname/:user_id',branchname);
  
  router.get('/items',items);
  
  router.get('/items/:cat_id',oneitem);
  
  router.get('/cats',cats);

  export default router;