import { Claim, Prisma } from '@prisma/client';
import { DbConfig } from '../configs';
import { IClaimRepository } from '../contracts';
import { RequestPhase } from '../enums';

export class ClaimRepository implements IClaimRepository {
	private readonly _dbConfig: DbConfig;

	constructor() {
		this._dbConfig = new DbConfig();
	}

	async create(
		date: Date,
		requestedAmt: number,
		claimType: string,
		currency: string,
		receipt: string,
		imgName: string,
		userId: string,
	): Promise<Claim | undefined | null> {
		return await this._dbConfig.claim.create({
			data: {
				date,
				requestedAmt,
				user: {
					connect: {
						id: userId,
					},
				},
				claimType: {
					connectOrCreate: {
						create: { type: claimType },
						where: { type: claimType },
					},
				},
				currency: {
					connectOrCreate: {
						create: { currency },
						where: { currency },
					},
				},
				receipt: {
					create: {
						receipt,
						imageName: imgName,
					},
				},
				requestPhase: {
					connectOrCreate: {
						create: { phase: RequestPhase.IN_PROCESS },
						where: { phase: RequestPhase.IN_PROCESS },
					},
				},
			},
		});
	}

	async fetchAll(): Promise<
		| Prisma.ClaimGetPayload<{
				include: {
					claimType: true;
					currency: true;
					requestPhase: true;
					receipt: true;
				};
		  }>[]
		| undefined
		| null
	> {
		return await this._dbConfig.claim.findMany({
			include: {
				claimType: true,
				currency: true,
				requestPhase: true,
				receipt: true,
			},
		});
	}

	async fetchById(claimId: string): Promise<
		| Prisma.ClaimGetPayload<{
				include: {
					claimType: true;
					currency: true;
					requestPhase: true;
					receipt: true;
				};
		  }>
		| undefined
		| null
	> {
		return await this._dbConfig.claim.findUniqueOrThrow({
			where: { id: claimId },
			include: {
				claimType: true,
				currency: true,
				requestPhase: true,
				receipt: true,
			},
		});
	}

	async fetchAllByUserId(userId: string): Promise<
		| Prisma.ClaimGetPayload<{
				include: {
					claimType: true;
					currency: true;
					requestPhase: true;
					receipt: true;
				};
		  }>[]
		| undefined
		| null
	> {
		return await this._dbConfig.claim.findMany({
			where: { userId },
			include: {
				claimType: true,
				currency: true,
				requestPhase: true,
				receipt: true,
			},
		});
	}

	async approve(
		approverEmail: string,
		claimId: string,
		approvedAmt: number,
	): Promise<Claim | undefined | null> {
		return await this._dbConfig.claim.update({
			where: { id: claimId },
			data: {
				approvedBy: approverEmail,
				isApproved: true,
				isDeclined: false,
				requestPhase: {
					connectOrCreate: {
						create: { phase: RequestPhase.APPROVED },
						where: { phase: RequestPhase.APPROVED },
					},
				},
				approvedAmt,
			},
		});
	}

	async decline(
		declinerEmail: string,
		claimId: string,
		notes?: string | null,
	): Promise<Claim | undefined | null> {
		return await this._dbConfig.claim.update({
			where: { id: claimId },
			data: {
				declinedBy: declinerEmail,
				isDeclined: true,
				isApproved: false,
				requestPhase: {
					connectOrCreate: {
						create: { phase: RequestPhase.DECLINED },
						where: { phase: RequestPhase.DECLINED },
					},
				},
				notes,
			},
		});
	}

	async update(
		claimId: string,
		date?: Date | undefined,
		requestedAmt?: number | undefined,
		claimType?: string | undefined,
		currency?: string | undefined,
		receiptId?: string | undefined,
		receipt?: string | undefined,
	): Promise<Claim | undefined | null> {
		return await this._dbConfig.claim.update({
			where: { id: claimId },
			data: {
				date,
				requestedAmt,
				claimType: claimType
					? {
							connectOrCreate: {
								create: { type: claimType },
								where: { type: claimType },
							},
						}
					: undefined,
				currency: currency
					? {
							connectOrCreate: {
								create: { currency },
								where: { currency },
							},
						}
					: undefined,
				receipt: receiptId
					? {
							update: {
								where: {
									id: receiptId,
								},
								data: {
									receipt,
								},
							},
						}
					: undefined,
			},
		});
	}

	async delete(claimId: string): Promise<Claim | undefined | null> {
		return await this._dbConfig.claim.delete({
			where: { id: claimId },
		});
	}
}
