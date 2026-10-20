import { Router } from 'express';
import * as authController from '../controllers/auth.js';
import { auth } from '../middlewares/auth.js';

export const authRouter = Router();

authRouter.post('/inscription', authController.inscription);
authRouter.post('/connexion', authController.connexion);
authRouter.post('/deconnexion', authController.deconnexion);
authRouter.get('/moi', auth, authController.moi);
