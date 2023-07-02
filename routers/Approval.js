import {Router} from 'express';
import { ApproveProposal, proposal, proposalcatagories, proposaldetail } from '../controller/Approval.controller.js';


const router = Router();

  router.get('/proposal',proposal);

  router.get('/proposals/details/',proposalcatagories);

  router.get('/proposal/details/:cat_id/:date',proposaldetail);
  
  router.put("/approveproposal/:prop_id/:checked_by/:status",ApproveProposal)

  export default router;