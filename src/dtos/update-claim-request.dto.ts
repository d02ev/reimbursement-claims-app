import {
	IsDateString,
	IsEnum,
	IsNumberString,
	IsOptional,
} from 'class-validator';
import { ClaimType, Currency } from '../enums';

export class UpdateClaimRequestDto {
	@IsOptional()
	@IsDateString({}, { message: 'Date must be a valid date.' })
	date?: string;

	@IsOptional()
	@IsEnum(ClaimType)
	type?: string;

	@IsOptional()
	@IsNumberString()
	requestedAmt?: number;

	@IsOptional()
	@IsEnum(Currency)
	currency?: string;

	userId?: string;
	imgName?: string;
	imgBuffer?: Buffer;
	imgMimeType?: string;
	claimId: string;

	constructor(obj: UpdateClaimRequestDto) {
		this.date = obj.date;
		this.type = obj.type;
		this.requestedAmt = obj.requestedAmt;
		this.currency = obj.currency;
		this.userId = obj.userId;
		this.imgName = obj.imgName;
		this.imgBuffer = obj.imgBuffer;
		this.imgMimeType = obj.imgMimeType;
		this.claimId = obj.claimId;
	}
}
