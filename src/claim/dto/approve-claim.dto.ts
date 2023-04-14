import { IsNotEmpty, IsNumberString } from 'class-validator';

export class ApproveClaimDto {
  @IsNumberString(
    {},
    {
      message: 'Approved Amount Can Only Contain Numeric Values!',
    },
  )
  @IsNotEmpty({
    message: 'Approved Amount Is Required!',
  })
  approvedAmt: string;
  internalNotes?: string;
  approvedBy: string;
}
