export class FetchClaimResponseDto {
	date?: string;
	type?: string;
	requestedAmt?: number;
	approvedAmt?: number;
	currency?: string;
	requestPhase?: string;
	isApproved?: boolean;
	isDeclined?: boolean;
	notes?: string;
	approvedBy?: string;
	declinedBy?: string;
	receipt?: string;
}
