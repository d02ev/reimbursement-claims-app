import { IsNotEmpty, IsString } from 'class-validator';

export class DeclineClaimDto {
  @IsString({
    message: 'Internal Notes Can Only Contain Alphabets!',
  })
  @IsNotEmpty({
    message: 'Internal Notes Cannot Be Empty!',
  })
  internalNotes: string;
  approvedAmt? = 0.0;
  declinedBy: string;
}
