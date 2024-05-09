import {
	IsDateString,
	IsEnum,
	IsNotEmpty,
	IsNumberString,
} from 'class-validator';
import { ClaimType, Currency } from '../enums';

export class GenerateClaimRequestDto {
	@IsNotEmpty({ message: 'A date is required.' })
	@IsDateString({}, { message: 'Date must be a valid date.' })
	date: string;

	@IsNotEmpty({ message: 'A claim type is required.' })
	@IsEnum(ClaimType)
	type: string;

	@IsNotEmpty({ message: 'A Request amount is required.' })
	@IsNumberString()
	requestedAmt: number;

	@IsNotEmpty({ message: 'A currency is required.' })
	@IsEnum(Currency)
	currency: string;

	userId: string;
	imgName: string;
	imgBuffer: Buffer;
	imgMimeType: string;

	constructor(obj: GenerateClaimRequestDto) {
		this.date = obj.date;
		this.type = obj.type;
		this.requestedAmt = obj.requestedAmt;
		this.currency = obj.currency;
		this.userId = obj.userId;
		this.imgName = obj.imgName;
		this.imgBuffer = obj.imgBuffer;
		this.imgMimeType = obj.imgMimeType;
	}
}
