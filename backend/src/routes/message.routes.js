import express from 'express';
import { getAllContacts } from '../controllers/message.controller.js';
import { getMessagesByUserId } from '../controllers/message.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import { sendMessage } from '../controllers/message.controller.js';
import { getChatPartners } from '../controllers/message.controller.js';
import { MessageRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.use(protectRoute); 

router.get('/contacts' , getAllContacts);

router.get('/chats', getChatPartners);

router.get('/:id', getMessagesByUserId);

router.post('/send/:id', MessageRateLimiter , sendMessage);

export default router;