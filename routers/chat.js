
import {Router} from 'express';
import { chat, getcaht, getlastMessage } from '../controller/chat.controller.js';

const router = Router();

  router.post('/chat',chat);
  
  router.get('/message/:sender/:reciever',getcaht);
  
  router.get('/users/:position',getlastMessage);

export default router