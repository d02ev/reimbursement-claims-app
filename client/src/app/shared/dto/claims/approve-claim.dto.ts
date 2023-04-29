export class ApproveClaimDto {
  approvedAmt: string;
  internalNotes?: string;

  constructor(claimApprovalFormValue: RawClaimApprovalFormValue) {
    this.approvedAmt = claimApprovalFormValue.approvedAmt;
    this.internalNotes = claimApprovalFormValue.internalNotes;
  }
}

export interface RawClaimApprovalFormValue {
  approvedAmt: string;
  internalNotes?: string;
}
