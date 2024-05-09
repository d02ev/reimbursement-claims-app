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
} from '../../dtos';
import { UpdateClaimRequestDto } from '../../dtos/update-claim-request.dto';

export interface IClaimService {
	generateClaim(
		generateClaimRequestDto: GenerateClaimRequestDto,
	): Promise<GenerateClaimResponseDto | undefined>;

	getClaim(
		fetchClaimRequestDto: FetchClaimRequestDto,
	): Promise<FetchClaimResponseDto | FetchClaimResponseDto[] | undefined>;

	getAllClaims(): Promise<
		FetchClaimResponseDto[] | FetchClaimResponseDto | undefined
	>;

	getUserClaims(
		userId: string,
	): Promise<FetchClaimResponseDto[] | FetchClaimResponseDto | undefined>;

	approveClaim(
		approveClaimRequestDto: ApproveClaimRequestDto,
	): Promise<ApproveClaimResponseDto | undefined>;

	declineClaim(
		declineClaimRequestDto: DeclineClaimRequestDto,
	): Promise<DeclineClaimResponseDto | undefined>;

	updateClaim(
		updateClaimRequestDto: UpdateClaimRequestDto,
	): Promise<UpdateClaimResponseDto | undefined>;

	deleteClaim(
		claimId: string,
		userId: string,
	): Promise<DeleteClaimResponseDto | undefined>;
}
