import { Router } from 'express';
import { AuthController } from '../controllers';
import passport from 'passport';

export const authRoutes = Router();
const authController = new AuthController();

authRoutes
	.post('/register', authController.register)
	.post(
		'/login',
		passport.authenticate('local', { session: false }),
		authController.login,
	)
	.post(
		'/logout',
		passport.authenticate('jwt', { session: false }),
		authController.logout,
	);
