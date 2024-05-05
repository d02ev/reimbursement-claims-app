import { format, createLogger, transports } from 'winston';

export const logger = createLogger({
	format: format.combine(
		format.colorize({
			colors: {
				info: 'blue',
				warning: 'yellow',
				debug: 'yello',
				error: 'red',
			},
		}),
		format.prettyPrint(),
		format.timestamp({
			format: 'YYYY-MM-DD HH:mm:ss',
		}),
		format.simple(),
	),
	transports: [new transports.Console()],
});
