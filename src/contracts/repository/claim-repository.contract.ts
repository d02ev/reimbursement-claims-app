import { Claim, Prisma } from '@prisma/client';

export interface IClaimRepository {
	create(
		date: Date,
		requestedAmt: number,
		claimType: string,
		currency: string,
		receipt: string,
		imgName: string,
		userId: string,
	): Promise<Claim | undefined | null>;

	fetchAll(): Promise<
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
	>;

	fetchById(claimId: string): Promise<
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
	>;

	fetchAllByUserId(userId: string): Promise<
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
	>;

	approve(
		approverEmail: string,
		claimId: string,
		approvedAmt: number,
	): Promise<Claim | undefined | null>;

	decline(
		declinerEmail: string,
		claimId: string,
		notes?: string | null,
	): Promise<Claim | undefined | null>;

	update(
		claimId: string,
		date?: Date | undefined,
		requestedAmt?: number | undefined,
		claimType?: string | undefined,
		currency?: string | undefined,
		receiptId?: string | undefined,
		receipt?: string | undefined,
	): Promise<Claim | undefined | null>;

	delete(claimId: string): Promise<Claim | undefined | null>;
}
