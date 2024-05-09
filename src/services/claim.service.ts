import {
	PrismaClientKnownRequestError,
	PrismaClientUnknownRequestError,
} from '@prisma/client/runtime/library';
import { IClaimRepository, IClaimService } from '../contracts';
import {
	ApproveClaimRequestDto,
	ApproveClaimResponseDto,
	DeclineClaimRequestDto,
	DeclineClaimResponseDto,
	DeleteClaimResponseDto,
	FetchClaimRequestDto,
	FetchClaimResponseDto,
	GenerateClaimRequestDto,
	GenerateClaimResponseDto,
	UpdateClaimResponseDto,
} from '../dtos';
import { ClaimRepository } from '../repository';
import { SupabaseUtil } from '../utils';
import {
	AppError,
	BadRequestError,
	ForbiddenError,
	NotFoundError,
} from '../errors';
import { AppErrorCodes } from '../enums';
import { Prisma } from '@prisma/client';
import { UpdateClaimRequestDto } from '../dtos/update-claim-request.dto';

export class ClaimService implements IClaimService {
	private readonly _claimRepository: IClaimRepository;
	private readonly _supabaseUtil: SupabaseUtil;

	constructor() {
		this._claimRepository = new ClaimRepository();
		this._supabaseUtil = new SupabaseUtil();
	}

	async generateClaim(
		generateClaimRequestDto: GenerateClaimRequestDto,
	): Promise<GenerateClaimResponseDto | undefined> {
		const {
			date,
			requestedAmt,
			type,
			currency,
			imgName,
			imgBuffer,
			imgMimeType,
			userId,
		} = generateClaimRequestDto;
		const customImgName = this.generateCustomFileName(imgName);

		// upload the image to the cloud
		const { error } = await this._supabaseUtil.uploadNewImage(
			customImgName,
			imgBuffer,
			imgMimeType,
		);

		if (error) {
			throw new AppError(
				error.message,
				AppErrorCodes.SB_UPLOAD_ERROR,
				error.stack,
			);
		}

		try {
			// fetch the url for the newly uploaded image
			const receiptUrl = this._supabaseUtil.getImageUrl(customImgName);
			// save the data in the db
			const newClaim = await this._claimRepository.create(
				new Date(date),
				requestedAmt,
				type,
				currency,
				receiptUrl,
				customImgName,
				userId,
			);

			return new GenerateClaimResponseDto(newClaim?.id!);
		} catch (err: any) {
			if (err instanceof PrismaClientKnownRequestError) {
				throw new AppError(
					err.message,
					AppErrorCodes.KNOWN_ORM_ERROR,
					err.stack,
				);
			}
			if (err instanceof PrismaClientUnknownRequestError) {
				throw new AppError(
					err.message,
					AppErrorCodes.UNKNOWN_ORM_ERROR,
					err.stack,
				);
			}

			throw new AppError(
				err.message,
				AppErrorCodes.UNKNOWN_APP_ERROR,
				err.stack,
			);
		}
	}

	async getClaim(
		fetchClaimRequestDto: FetchClaimRequestDto,
	): Promise<FetchClaimResponseDto | FetchClaimResponseDto[] | undefined> {
		try {
			const { claimId, userId } = fetchClaimRequestDto;
			const claim = await this._claimRepository.fetchById(claimId);

			if (claim!.userId !== userId)
				throw new ForbiddenError('You are not allowed to access the claim.');

			const fetchClaimResponseDto:
				| FetchClaimResponseDto
				| FetchClaimResponseDto[] = this.generateFetchClaimResponseDto(claim!);

			return fetchClaimResponseDto;
		} catch (err: any) {
			if (err instanceof ForbiddenError) {
				throw err;
			}
			if (err instanceof PrismaClientKnownRequestError) {
				if (err.code === 'P2025') {
					throw new NotFoundError('Claim does not exist.');
				}

				throw new AppError(
					err.message,
					AppErrorCodes.KNOWN_ORM_ERROR,
					err.stack,
				);
			}
			if (err instanceof PrismaClientUnknownRequestError) {
				throw new AppError(
					err.message,
					AppErrorCodes.UNKNOWN_ORM_ERROR,
					err.stack,
				);
			}

			throw new AppError(
				err.message,
				AppErrorCodes.UNKNOWN_APP_ERROR,
				err.stack,
			);
		}
	}

	async getAllClaims(): Promise<
		FetchClaimResponseDto[] | FetchClaimResponseDto | undefined
	> {
		try {
			const claims = await this._claimRepository.fetchAll();

			if (claims!.length === 0) return [];

			const fetchClaimResponseDto = this.generateFetchClaimResponseDto(claims!);

			return fetchClaimResponseDto;
		} catch (err: any) {
			if (err instanceof PrismaClientKnownRequestError) {
				throw new AppError(
					err.message,
					AppErrorCodes.KNOWN_ORM_ERROR,
					err.stack,
				);
			}
			if (err instanceof PrismaClientUnknownRequestError) {
				throw new AppError(
					err.message,
					AppErrorCodes.UNKNOWN_ORM_ERROR,
					err.stack,
				);
			}

			throw new AppError(
				err.message,
				AppErrorCodes.UNKNOWN_APP_ERROR,
				err.stack,
			);
		}
	}

	async getUserClaims(
		userId: string,
	): Promise<FetchClaimResponseDto[] | FetchClaimResponseDto | undefined> {
		try {
			const userClaims = await this._claimRepository.fetchAllByUserId(userId);

			if (userClaims!.length === 0) return [];

			const fetchClaimResponseDto = this.generateFetchClaimResponseDto(
				userClaims!,
			);

			return fetchClaimResponseDto;
		} catch (err: any) {
			if (err instanceof PrismaClientKnownRequestError) {
				throw new AppError(
					err.message,
					AppErrorCodes.KNOWN_ORM_ERROR,
					err.stack,
				);
			}
			if (err instanceof PrismaClientUnknownRequestError) {
				throw new AppError(
					err.message,
					AppErrorCodes.UNKNOWN_ORM_ERROR,
					err.stack,
				);
			}

			throw new AppError(
				err.message,
				AppErrorCodes.UNKNOWN_APP_ERROR,
				err.stack,
			);
		}
	}

	async approveClaim(
		approveClaimRequestDto: ApproveClaimRequestDto,
	): Promise<ApproveClaimResponseDto | undefined> {
		try {
			const { approver, claimId, approvedAmt } = approveClaimRequestDto;
			const approvedClaim = await this._claimRepository.approve(
				approver,
				claimId,
				approvedAmt,
			);

			if (!approvedClaim) {
				throw new NotFoundError('Cannot approve a non-existent claim.');
			}

			return new ApproveClaimResponseDto(approvedClaim.id!);
		} catch (err: any) {
			if (err instanceof NotFoundError) {
				throw err;
			}
			if (err instanceof PrismaClientKnownRequestError) {
				throw new AppError(
					err.message,
					AppErrorCodes.KNOWN_ORM_ERROR,
					err.stack,
				);
			}
			if (err instanceof PrismaClientUnknownRequestError) {
				throw new AppError(
					err.message,
					AppErrorCodes.UNKNOWN_ORM_ERROR,
					err.stack,
				);
			}

			throw new AppError(
				err.message,
				AppErrorCodes.UNKNOWN_APP_ERROR,
				err.stack,
			);
		}
	}

	async declineClaim(
		declineClaimRequestDto: DeclineClaimRequestDto,
	): Promise<DeclineClaimResponseDto | undefined> {
		try {
			const { claimId, decliner, notes } = declineClaimRequestDto;
			const declinedClaim = await this._claimRepository.decline(
				decliner,
				claimId,
				notes,
			);

			if (!declinedClaim) {
				throw new NotFoundError('Cannot decline a non-existent claim.');
			}

			return new DeclineClaimResponseDto(declinedClaim.id!);
		} catch (err: any) {
			if (err instanceof NotFoundError) {
				throw err;
			}
			if (err instanceof PrismaClientKnownRequestError) {
				throw new AppError(
					err.message,
					AppErrorCodes.KNOWN_ORM_ERROR,
					err.stack,
				);
			}
			if (err instanceof PrismaClientUnknownRequestError) {
				throw new AppError(
					err.message,
					AppErrorCodes.UNKNOWN_ORM_ERROR,
					err.stack,
				);
			}

			throw new AppError(
				err.message,
				AppErrorCodes.UNKNOWN_APP_ERROR,
				err.stack,
			);
		}
	}

	async updateClaim(
		updateClaimRequestDto: UpdateClaimRequestDto,
	): Promise<UpdateClaimResponseDto | undefined> {
		try {
			const {
				date,
				type,
				requestedAmt,
				currency,
				userId,
				imgBuffer,
				imgMimeType,
				claimId,
			} = updateClaimRequestDto;

			const claim = await this._claimRepository.fetchById(claimId);

			if (claim!.userId !== userId) {
				throw new ForbiddenError('You are not allowed to access the claim.');
			}

			let sanitizedDate: Date;
			let receiptId: string | undefined;
			let oldImageName: string | null;

			if (updateClaimRequestDto?.date === undefined) {
				sanitizedDate = new Date(claim!.date);
			} else {
				sanitizedDate = new Date(date!);
				const inputUtcDate = sanitizedDate.getUTCDate();
				const presentUtcDate = new Date(Date.now()).getUTCDate();
				const isPastDate = inputUtcDate < presentUtcDate;
				if (isPastDate) {
					throw new BadRequestError('You cannot choose a past date.');
				}
			}

			if (updateClaimRequestDto?.imgName !== undefined) {
				oldImageName = claim!.receipt.imageName;
				receiptId = claim!.receipt.id;
				const { error } = await this._supabaseUtil.updateImage(
					oldImageName!,
					imgBuffer!,
					imgMimeType!,
				);

				if (error) {
					throw new AppError(
						error.message,
						AppErrorCodes.SB_UPDATE_ERROR,
						error.stack,
					);
				}
			}

			const newReceiptUrl = this._supabaseUtil.getImageUrl(oldImageName!);
			const updatedClaim = await this._claimRepository.update(
				claimId,
				sanitizedDate,
				requestedAmt,
				type,
				currency,
				receiptId,
				newReceiptUrl,
			);

			return new UpdateClaimResponseDto(updatedClaim?.id!);
		} catch (err: any) {
			if (
				err instanceof ForbiddenError ||
				err instanceof BadRequestError ||
				err instanceof AppError
			) {
				throw err;
			}
			if (err instanceof PrismaClientKnownRequestError) {
				if (err.code === 'P2025') {
					throw new NotFoundError('Cannot update a non-existent claim.');
				}

				throw new AppError(
					err.message,
					AppErrorCodes.KNOWN_ORM_ERROR,
					err.stack,
				);
			}
			if (err instanceof PrismaClientUnknownRequestError) {
				throw new AppError(
					err.message,
					AppErrorCodes.UNKNOWN_ORM_ERROR,
					err.stack,
				);
			}

			throw new AppError(
				err.message,
				AppErrorCodes.UNKNOWN_APP_ERROR,
				err.stack,
			);
		}
	}

	async deleteClaim(
		claimId: string,
		userId: string,
	): Promise<DeleteClaimResponseDto | undefined> {
		try {
			const claim = await this._claimRepository.fetchById(claimId);

			if (claim!.userId !== userId) {
				throw new ForbiddenError('You are not allowed to delete the claim.');
			}

			const { error } = await this._supabaseUtil.deleteImage(
				claim?.receipt.imageName!,
			);

			if (error) {
				throw new AppError(
					error.message,
					AppErrorCodes.SB_DELETE_ERROR,
					error.stack,
				);
			}

			const deletedClaim = await this._claimRepository.delete(claimId);

			return new DeleteClaimResponseDto(deletedClaim?.id!);
		} catch (err: any) {
			if (err instanceof ForbiddenError || err instanceof AppError) {
				throw err;
			}
			if (err instanceof PrismaClientKnownRequestError) {
				if (err.code === 'P2025') {
					throw new NotFoundError('Cannot delete a non-existent claim.');
				}

				throw new AppError(
					err.message,
					AppErrorCodes.KNOWN_ORM_ERROR,
					err.stack,
				);
			}
			if (err instanceof PrismaClientUnknownRequestError) {
				throw new AppError(
					err.message,
					AppErrorCodes.UNKNOWN_ORM_ERROR,
					err.stack,
				);
			}

			throw new AppError(
				err.message,
				AppErrorCodes.UNKNOWN_APP_ERROR,
				err.stack,
			);
		}
	}

	private generateFetchClaimResponseDto(
		claim:
			| Prisma.ClaimGetPayload<{
					include: {
						claimType: true;
						currency: true;
						requestPhase: true;
						receipt: true;
					};
			  }>[]
			| Prisma.ClaimGetPayload<{
					include: {
						claimType: true;
						currency: true;
						requestPhase: true;
						receipt: true;
					};
			  }>,
	): FetchClaimResponseDto[] | FetchClaimResponseDto {
		let fetchClaimResponseDto: FetchClaimResponseDto[] | FetchClaimResponseDto;

		if (Array.isArray(claim)) {
			fetchClaimResponseDto = claim.map(
				(
					claim: Prisma.ClaimGetPayload<{
						include: {
							claimType: true;
							currency: true;
							requestPhase: true;
							receipt: true;
						};
					}>,
				) => {
					const response: FetchClaimResponseDto = {
						date: new Date(claim.date).toDateString(),
						type: claim.claimType.type,
						requestedAmt: Number(claim.requestedAmt).valueOf(),
						currency: claim.currency.currency,
						requestPhase: claim.requestPhase.phase,
						receipt: claim.receipt.receipt,
					};

					// an approved claim request
					if (claim.isApproved && claim.isDeclined === null) {
						response.approvedAmt = Number(claim.approvedAmt).valueOf();
						response.isApproved = claim.isApproved;
						response.isDeclined = false;
						response.notes = null;
						response.approvedBy = claim.approvedBy;
						response.declinedBy = null;
					}
					// a declined claim request
					else if (claim.isApproved === null && claim.isDeclined) {
						response.approvedAmt = 0;
						response.isApproved = false;
						response.isDeclined = true;
						response.notes = claim.notes;
						response.approvedBy = null;
						response.declinedBy = claim.declinedBy;
					}
					// a pending claim request
					else if (claim.isApproved === null && claim.isDeclined === null) {
						response.approvedAmt = 0;
						response.isApproved = false;
						response.isDeclined = false;
						response.notes = claim.notes;
						response.approvedBy = claim.approvedBy;
						response.declinedBy = claim.declinedBy;
					}

					return response;
				},
			);
		} else {
			fetchClaimResponseDto = {
				date: new Date(claim.date).toDateString(),
				type: claim.claimType.type,
				requestedAmt: Number(claim.requestedAmt).valueOf(),
				currency: claim.currency.currency,
				requestPhase: claim.requestPhase.phase,
				receipt: claim.receipt.receipt,
			};

			// an approved claim request
			if (claim.isApproved && claim.isDeclined === null) {
				fetchClaimResponseDto.approvedAmt = Number(claim.approvedAmt).valueOf();
				fetchClaimResponseDto.isApproved = claim.isApproved;
				fetchClaimResponseDto.isDeclined = false;
				fetchClaimResponseDto.notes = null;
				fetchClaimResponseDto.approvedBy = claim.approvedBy;
				fetchClaimResponseDto.declinedBy = null;
			}
			// a declined claim request
			else if (claim.isApproved === null && claim.isDeclined) {
				fetchClaimResponseDto.approvedAmt = 0;
				fetchClaimResponseDto.isApproved = false;
				fetchClaimResponseDto.isDeclined = true;
				fetchClaimResponseDto.notes = claim.notes;
				fetchClaimResponseDto.approvedBy = null;
				fetchClaimResponseDto.declinedBy = claim.declinedBy;
			}
			// a pending claim request
			else if (claim.isApproved === null && claim.isDeclined === null) {
				fetchClaimResponseDto.approvedAmt = 0;
				fetchClaimResponseDto.isApproved = false;
				fetchClaimResponseDto.isDeclined = false;
				fetchClaimResponseDto.notes = claim.notes;
				fetchClaimResponseDto.approvedBy = claim.approvedBy;
				fetchClaimResponseDto.declinedBy = claim.declinedBy;
			}
		}

		return fetchClaimResponseDto;
	}

	private generateCustomFileName(imgName: string): string {
		const timestampString = Date.now().toString();
		return timestampString + '_' + imgName;
	}
}
