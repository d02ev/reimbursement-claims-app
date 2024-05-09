import { IsOptional, IsString } from 'class-validator';

export class DeclineClaimRequestDto {
	@IsOptional()
	@IsString()
	notes?: string;

	decliner: string;
	claimId: string;

	constructor(obj: DeclineClaimRequestDto) {
		this.notes = obj.notes;
		this.decliner = obj.decliner;
		this.claimId = obj.claimId;
	}
}
