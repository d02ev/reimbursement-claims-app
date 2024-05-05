import { Application } from 'express';
import { logger } from '../utils';
import { AppErrorCodes } from '../enums';

export class ServerConfig {
	private readonly _portNumber: number;
	private readonly _expApp: Application;
	private readonly _appEnvironment: string;

	constructor(portNumber: number, expApp: Application) {
		this._portNumber = portNumber;
		this._expApp = expApp;
		this._appEnvironment = process.env.NODE_ENV! || 'development';
	}

	initServer = () => {
		try {
			if (this._appEnvironment === 'development' || this._appEnvironment === 'test') {
				this._expApp.listen(this._portNumber, () =>
					logger.info(`The Server Is Running At http://localhost:${this._portNumber}`),
				);
			}
			if (this._appEnvironment === 'production') {
				logger.info('Server Initiated Successfully.....');
				this._expApp.listen(this._portNumber);
			}
		} catch (err: any) {
			logger.error('An Error Occurred While Spinning Up The Server. Exiting Now....', {
				errorCode: AppErrorCodes.INIT_SERVER_FAILURE,
				errorStack: err.stack,
			});
			process.exit(1);
		}
	};
}
