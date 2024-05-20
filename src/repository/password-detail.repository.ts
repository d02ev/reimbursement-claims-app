import { PasswordDetail } from '@prisma/client';
import { DbConfig } from '../configs';
import { IPasswordDetailRepository } from '../contracts';

export class PasswordDetailRepository implements IPasswordDetailRepository {
	private readonly _dbConfig: DbConfig;

	constructor() {
		this._dbConfig = new DbConfig();
	}

	async createRefreshToken(
		userId: string,
		refreshToken: string,
	): Promise<PasswordDetail | null | undefined> {
		return await this._dbConfig.passwordDetail.update({
			where: { userId },
			data: { refreshToken },
		});
	}

	async fetchByUserId(
		userId: string,
	): Promise<PasswordDetail | undefined | null> {
		return await this._dbConfig.passwordDetail.findFirst({
			where: { userId },
		});
	}
}
