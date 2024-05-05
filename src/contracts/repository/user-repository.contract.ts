import { Prisma, User } from '@prisma/client';

export interface IUserRepository {
	create(
		fullName: string,
		email: string,
		role: string,
		passwordHash: string,
		ifsc: string,
		bankName: string,
		bankAccNum: string,
		pan: string,
	): Promise<User | undefined | null>;

	fetchById(userId: string): Promise<
		| Prisma.UserGetPayload<{
				include: {
					role: true;
					bankDetail: true;
					passowordDetail: true;
					claims: true;
				};
		  }>
		| undefined
		| null
	>;

	fetchByEmail(userEmail: string): Promise<
		| Prisma.UserGetPayload<{
				include: {
					role: true;
					bankDetail: true;
					passowordDetail: true;
					claims: true;
				};
		  }>
		| undefined
		| null
	>;
}
