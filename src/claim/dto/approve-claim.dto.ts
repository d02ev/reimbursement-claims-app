import { IsNotEmpty, IsNumber } from 'class-validator';
import { RequestPhase } from '../enum';

export class ApproveClaimDto {
  @IsNumber(
    {
      maxDecimalPlaces: 2,
    },
    { message: 'Approved Amount Can Only Contain Numeric Values!' },
  )
  @IsNotEmpty({
    message: 'Approved Amount Is Required!',
  })
  approvedAmt: number;
  requestPhase = RequestPhase.APPROVED;
  internalNotes?: string;
  isApproved? = true;
  approvedBy: string;
}
