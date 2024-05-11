import { Request, Response, NextFunction } from 'express';
import { IClaimService } from '../contracts';
import { ClaimService } from '../services';
import {
	ApproveClaimRequestDto,
	DeclineClaimRequestDto,
	FetchClaimRequestDto,
	GenerateClaimRequestDto,
	ValidatedUserResultDto,
} from '../dtos';
import { validate } from 'class-validator';
import { RequestValidationError } from '../errors';
import { HttpStatusCodes } from '../enums';
import { UpdateClaimRequestDto } from '../dtos/update-claim-request.dto';

export class ClaimController {
	private readonly _claimService: IClaimService;

	constructor() {
		this._claimService = new ClaimService();
	}

	generate = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const user = req.user as ValidatedUserResultDto;
			const requestBody: GenerateClaimRequestDto = {
				...req.body,
				userId: user.id,
				imgName: req.file?.originalname,
				imgBuffer: req.file?.buffer,
				imgMimeType: req.file?.mimetype,
			};
			const generateClaimRequestDto = new GenerateClaimRequestDto(requestBody);
			const validationErrors = await validate(generateClaimRequestDto);

			if (validationErrors && validationErrors.length > 0) {
				return next(new RequestValidationError(validationErrors));
			}

			const generateClaimResponseDto = await this._claimService.generateClaim(
				generateClaimRequestDto,
			);
			return res.status(HttpStatusCodes.CREATED).json(generateClaimResponseDto);
		} catch (err: any) {
			return next(err);
		}
	};

	accessAllClaims = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const fetchClaimResponseDto = await this._claimService.getAllClaims();
			return res.status(HttpStatusCodes.OK).json(fetchClaimResponseDto);
		} catch (err: any) {
			return next(err);
		}
	};

	accessUserClaims = async (
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		try {
			const user = req.user as ValidatedUserResultDto;
			const fetchClaimResponseDto = await this._claimService.getUserClaims(
				user.id,
			);

			return res.status(HttpStatusCodes.OK).json(fetchClaimResponseDto);
		} catch (err: any) {
			return next(err);
		}
	};

	accessClaim = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const user = req.user as ValidatedUserResultDto;
			const fetchClaimRequestDto: FetchClaimRequestDto = {
				userId: user.id,
				claimId: req.params['id'],
			};
			const fetchClaimResponseDto =
				await this._claimService.getClaim(fetchClaimRequestDto);

			return res.status(HttpStatusCodes.OK).json(fetchClaimResponseDto);
		} catch (err: any) {
			return next(err);
		}
	};

	updateClaim = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const user = req.user as ValidatedUserResultDto;
			const requestBody: UpdateClaimRequestDto = {
				...req.body,
				userId: user.id,
				claimId: req.params['id'],
			};

			if (req.file) {
				requestBody.imgName = req.file.originalname;
				requestBody.imgBuffer = req.file.buffer;
				requestBody.imgMimeType = req.file.mimetype;
			}

			const updateClaimRequestDto = new UpdateClaimRequestDto(requestBody);
			const validationErrors = await validate(updateClaimRequestDto);

			if (validationErrors && validationErrors.length > 0) {
				return next(new RequestValidationError(validationErrors));
			}

			const updateClaimResponseDto = await this._claimService.updateClaim(
				updateClaimRequestDto,
			);
			return res.status(HttpStatusCodes.OK).json(updateClaimResponseDto);
		} catch (err: any) {
			return next(err);
		}
	};

	approveClaim = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const user = req.user as ValidatedUserResultDto;
			const requestBody: ApproveClaimRequestDto = {
				...req.body,
				claimId: req.params['id'],
				approver: user.email,
			};
			const approveClaimRequestDto = new ApproveClaimRequestDto(requestBody);
			const validationErrors = await validate(approveClaimRequestDto);

			if (validationErrors && validationErrors.length > 0) {
				return next(new RequestValidationError(validationErrors));
			}

			const approveClaimResponseDto = await this._claimService.approveClaim(
				approveClaimRequestDto,
			);
			return res.status(HttpStatusCodes.OK).json(approveClaimResponseDto);
		} catch (err: any) {
			return next(err);
		}
	};

	declineClaim = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const user = req.user as ValidatedUserResultDto;
			const requestBody: DeclineClaimRequestDto = {
				...req.body,
				claimId: req.params['id'],
				decliner: user.email,
			};
			const declineClaimRequestDto = new DeclineClaimRequestDto(requestBody);
			const validationErrors = await validate(declineClaimRequestDto);

			if (validationErrors && validationErrors.length > 0) {
				return next(new RequestValidationError(validationErrors));
			}

			const declineClaimResponseDto = await this._claimService.declineClaim(
				declineClaimRequestDto,
			);
			return res.status(HttpStatusCodes.OK).json(declineClaimResponseDto);
		} catch (err: any) {
			return next(err);
		}
	};

	deleteClaim = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const user = req.user as ValidatedUserResultDto;
			const userId = user.id;
			const claimId = req.params['id']!;
			const deleteClaimResponseDto = await this._claimService.deleteClaim(
				claimId,
				userId,
			);

			return res.status(HttpStatusCodes.OK).json(deleteClaimResponseDto);
		} catch (err: any) {
			return next(err);
		}
	};
}
