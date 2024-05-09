import { createClient, SupabaseClient } from '@supabase/supabase-js';

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
	): Promise<
		| {
				data: {
					path: string;
				};
				error: null;
		  }
		| {
				data: null;
				error: any;
		  }
	> {
		return await this._supabaseClient.storage
			.from(this._supabaseBucketName)
			.upload(imgName, imgBuffer, { contentType: imgMimeType });
	}

	public async updateImage(
		newImgName: string,
		newImgBuffer: Buffer,
		newImgMimeType: string,
	): Promise<
		| {
				data: {
					path: string;
				};
				error: null;
		  }
		| {
				data: null;
				error: any;
		  }
	> {
		return await this._supabaseClient.storage
			.from(this._supabaseBucketName)
			.update(newImgName, newImgBuffer, { contentType: newImgMimeType });
	}

	public async deleteImage(imgName: string): Promise<
		| {
				data: any;
				error: null;
		  }
		| {
				data: null;
				error: any;
		  }
	> {
		return await this._supabaseClient.storage
			.from(this._supabaseBucketName)
			.remove([imgName]);
	}

	public getImageUrl(imgName: string): string {
		const { data } = this._supabaseClient.storage
			.from(this._supabaseBucketName)
			.getPublicUrl(imgName);

		return data.publicUrl;
	}
}
