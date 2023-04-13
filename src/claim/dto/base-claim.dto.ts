import { RequestPhase } from '../enum';

export class BaseClaimDto {
  date: Date;
  type: string;
  requestedAmt: number;
  approvedAmt? = 0.0;
  currency: string;
  receipt: string;
  requestPhase? = RequestPhase.IN_PROCESS;
  isApproved? = false;
  approvedBy? = '';
  declinedBy? = '';
  internalNotes? = '';
  requestedBy: string;
}
