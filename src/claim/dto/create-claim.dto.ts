import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ClaimType, Currency } from '../enum';

export class CreateClaimDto {
  @IsString()
  @IsNotEmpty({
    message: 'Date Is Required!',
  })
  date: string;

  @IsString({
    message: 'Claim Type Can Only Be A Valid String',
  })
  type = ClaimType.MISC;

  @IsNumber(
    {
      maxDecimalPlaces: 2,
    },
    { message: 'Amount Can Only Be A Valid Number!' },
  )
  @IsNotEmpty({
    message: 'Requested Amount Is Required!',
  })
  requestedAmt: number;

  @IsString({
    message: 'Currency Can Only Be INR, USD or EURO!',
  })
  currency = Currency.INR;

  @IsString()
  @IsOptional()
  receipt: 'Not Attached!';

  @IsString()
  @IsNotEmpty()
  requestedBy: string;
}
