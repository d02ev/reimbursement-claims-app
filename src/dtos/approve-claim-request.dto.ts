import { IsNotEmpty, IsNumberString } from 'class-validator';

export class ApproveClaimRequestDto {
	@IsNotEmpty({ message: 'Approved amount cannot be empty.' })
	@IsNumberString(
		{},
		{ message: 'Approved amount must only contain numeric digits.' },
	)
	approvedAmt: number;

	approver: string;
	claimId: string;

	constructor(obj: ApproveClaimRequestDto) {
		this.approvedAmt = obj.approvedAmt;
		this.approver = obj.approver;
		this.claimId = obj.claimId;
	}
}
