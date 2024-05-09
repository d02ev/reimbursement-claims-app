import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';
import { BadRequestError } from '../errors';

export const upload = multer({
	storage: multer.memoryStorage(),
	limits: { fileSize: 1024 * 1024 * 5 },
	fileFilter: (
		req: Request,
		file: Express.Multer.File,
		cb: FileFilterCallback,
	) => {
		const allowedMimetypes = ['img/jpg', 'img/jpeg', 'img/png'];

		if (!allowedMimetypes.includes(file.mimetype)) {
			cb(
				new BadRequestError(
					'Invalid file type only JPG, JPEG and PNG types allowed',
				),
			);
		}

		cb(null, true);
	},
});
