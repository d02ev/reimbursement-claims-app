import { Router } from 'express';
import { AuthController } from '../controllers';

export const authRoutes = Router();
const authController = new AuthController();

authRoutes.post('/register', authController.register);
