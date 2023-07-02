import {Router} from 'express';
import { pendingRequest,ApproveRequstes,RejectRequests } from '../controller/BranchManager.controller.js';

  const router = Router();

  router.get('/manrequests/:branch_id',pendingRequest);
  
  router.put('/requests/approve',ApproveRequstes);
  
  router.put('/requests/reject',RejectRequests);

export default router;