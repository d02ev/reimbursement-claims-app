import { DbConfig } from '../configs';
import { IUserRepository } from '../contracts';
import { Prisma, User } from '@prisma/client';

export class UserRepository implements IUserRepository {
	private readonly _dbConfig: DbConfig;

	constructor() {
		this._dbConfig = new DbConfig();
	}

	async create(
		fullName: string,
		email: string,
		role: string,
		passwordHash: string,
		ifsc: string,
		bankName: string,
		bankAccNum: string,
		pan: string,
	): Promise<User | null | undefined> {
		return await this._dbConfig.user.create({
			data: {
				fullName,
				email,
				role: {
					connectOrCreate: {
						where: { role },
						create: { role },
					},
				},
				passowordDetail: {
					connectOrCreate: {
						create: { passwordHash },
						where: { passwordHash },
					},
				},
				bankDetail: {
					connectOrCreate: {
						create: {
							bankAccNum,
							ifsc,
							pan,
							bankName: {
								connectOrCreate: {
									create: { name: bankName },
									where: { name: bankName },
								},
							},
						},
						where: {
							bankAccNum,
							ifsc,
							pan,
						},
					},
				},
			},
		});
	}

	async fetchById(userId: string): Promise<
		| Prisma.UserGetPayload<{
				include: {
					role: true;
					passowordDetail: true;
					bankDetail: true;
					claims: true;
				};
		  }>
		| undefined
		| null
	> {
		return await this._dbConfig.user.findUnique({
			where: { id: userId },
			include: {
				role: true,
				bankDetail: true,
				passowordDetail: true,
				claims: true,
			},
		});
	}

	async fetchByEmail(userEmail: string): Promise<
		| Prisma.UserGetPayload<{
				include: {
					role: true;
					passowordDetail: true;
					bankDetail: true;
					claims: true;
				};
		  }>
		| undefined
		| null
	> {
		return await this._dbConfig.user.findUnique({
			where: { email: userEmail },
			include: {
				role: true,
				bankDetail: true,
				passowordDetail: true,
				claims: true,
			},
		});
	}
}
