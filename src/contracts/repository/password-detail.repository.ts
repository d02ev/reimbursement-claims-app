import { PasswordDetail } from '@prisma/client';

export interface IPasswordDetailRepository {
	createRefreshToken(
		userId: string,
		refreshToken: string,
	): Promise<PasswordDetail | undefined | null>;
}
