import { RequestPhase } from '../enum';

export class BaseClaimDto {
  date: string;
  type: string;
  requestedAmt: number;
  approvedAmt? = 0.0;
  currency: string;
  receipt: string;
  requestPhase? = RequestPhase.IN_PROCESS;
  approvedBy? = '';
  declinedBy? = '';
  internalNotes? = '';
  requestedBy: string;
}
