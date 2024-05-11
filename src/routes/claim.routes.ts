import { Router } from 'express';
import passport from 'passport';
import { ClaimController } from '../controllers';
import { fileUploadHandler, roleHandler } from '../middlewares';
import { UserRoles } from '../enums';

export const claimRoutes = Router();
const claimController = new ClaimController();

claimRoutes
	.post(
		'/',
		passport.authenticate('jwt', { session: false }),
		roleHandler(UserRoles.USER),
		fileUploadHandler,
		claimController.generate,
	)
	.get(
		'/',
		passport.authenticate('jwt', { session: false }),
		roleHandler(UserRoles.ADMIN),
		claimController.accessAllClaims,
	)
	.get(
		'/my-claims',
		passport.authenticate('jwt', { session: false }),
		roleHandler(UserRoles.USER),
		claimController.accessUserClaims,
	)
	.get(
		'/:id',
		passport.authenticate('jwt', { session: false }),
		claimController.accessClaim,
	)
	.patch(
		'/:id',
		passport.authenticate('jwt', { session: false }),
		roleHandler(UserRoles.USER),
		fileUploadHandler,
		claimController.updateClaim,
	)
	.patch(
		'/approve/:id',
		passport.authenticate('jwt', { session: false }),
		roleHandler(UserRoles.ADMIN),
		claimController.approveClaim,
	)
	.patch(
		'/decline/:id',
		passport.authenticate('jwt', { session: false }),
		roleHandler(UserRoles.ADMIN),
		claimController.declineClaim,
	)
	.delete(
		'/:id',
		passport.authenticate('jwt', { session: false }),
		roleHandler(UserRoles.USER),
		claimController.deleteClaim,
	);
