export interface FetchClaimResponseDto {
  id: string;
  date: string;
  type: string;
  requestedBy: string;
  requestedAmt: string;
  approvedAmt: string;
  currency: string;
  requestPhase: string;
  notes?: string | null;
  approvedBy?: string | null;
  declinedBy?: string | null;
  receipt: string | null;
}