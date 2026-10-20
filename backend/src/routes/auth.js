import { Router } from 'express';
import * as authController from '../controllers/auth.js';

export const authRouter = Router();

authRouter.post('/inscription', authController.inscription);
authRouter.post('/connexion', authController.connexion);
