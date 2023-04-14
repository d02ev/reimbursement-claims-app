export class EditClaimDto {
  date?: string;
  type?: string;
  requestedAmt?: number;
  approvedAmt?: number;
  currency?: string;
  receipt?: string;
  requestPhase?: string;
  approvedBy?: string;
  declinedBy?: string;
  internalNotes?: string;
}
