import { PassportStatic } from 'passport';
import { IStrategyOptions, IVerifyOptions, Strategy } from 'passport-local';
import { AuthService } from '../services';
import { ValidatedUserResultDto } from '../dtos';

export const localStrategy = (passport: PassportStatic) => {
	const authService = new AuthService();
	const localOptions: IStrategyOptions = {
		usernameField: 'email',
		passwordField: 'password',
		session: false,
	};

	passport.use(
		new Strategy(
			localOptions,
			(
				email: string,
				password: string,
				done: (
					error: any,
					user?: Express.User | false,
					options?: IVerifyOptions,
				) => void,
			) => {
				authService
					.validateUserLocal(email, password)
					.then((user: ValidatedUserResultDto | undefined | null) => {
						if (user) {
							return done(null, user);
						}

						return done(null, false);
					})
					.catch((err: any) => {
						return done(err, false);
					});
			},
		),
	);
};
