import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { logger } from './logger.util';
import { AppError } from '../errors';
import { AppErrorCodes } from '../enums';

export class SupabaseUtil {
	private readonly _supabaseClient: SupabaseClient;
	private readonly _supabaseBucketName: string;

	constructor() {
		this._supabaseClient = createClient(
			process.env.SUPABASE_PROJECT_URL!,
			process.env.SUPABASE_ACCESS_KEY!,
		);
		this._supabaseBucketName = process.env.SUPABASE_BUCKET_NAME!;
	}

	async uploadNewImage(
		imgName: string,
		imgBuffer: Buffer,
		imgMimeType: string,
	): Promise<boolean> {
		const { error } = await this._supabaseClient.storage
			.from(this._supabaseBucketName)
			.upload(imgName, imgBuffer, { contentType: imgMimeType });

		if (error) {
			logger.error(error.message, error.stack);
			throw new AppError(error.message, AppErrorCodes.SB_UPLOAD_ERROR);
		}

		return true;
	}

	public async updateImage(
		newImgName: string,
		newImgBuffer: Buffer,
		newImgMimeType: string,
	): Promise<boolean> {
		const { error } = await this._supabaseClient.storage
			.from(this._supabaseBucketName)
			.update(newImgName, newImgBuffer, { contentType: newImgMimeType });

		if (error) {
			logger.error(error.message, error.stack);
			throw new AppError(error.message, AppErrorCodes.SB_UPDATE_ERROR);
		}

		return true;
	}

	public async deleteImage(imgName: string): Promise<boolean> {
		const { error } = await this._supabaseClient.storage
			.from(this._supabaseBucketName)
			.remove([imgName]);

		if (error) {
			logger.error(error.message, error.stack);
			throw new AppError(error.message, AppErrorCodes.SB_DELETE_ERROR);
		}

		return true;
	}

	public getImageUrl(imgName: string): string {
		const { data } = this._supabaseClient.storage
			.from(this._supabaseBucketName)
			.getPublicUrl(imgName);

		return data.publicUrl;
	}
}
