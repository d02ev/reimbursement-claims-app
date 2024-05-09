export class FetchClaimResponseDto {
	date?: string | null;
	type?: string | null;
	requestedAmt?: number | null;
	approvedAmt?: number | null;
	currency?: string | null;
	requestPhase?: string | null;
	isApproved?: boolean | null;
	isDeclined?: boolean | null;
	notes?: string | null;
	approvedBy?: string | null;
	declinedBy?: string | null;
	receipt?: string | null;
}
