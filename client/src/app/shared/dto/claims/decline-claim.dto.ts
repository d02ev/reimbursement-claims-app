export class DeclineClaimDto {
  internalNotes: string;

  constructor(claimDecliningFormValue: RawClaimDecliningFormValue) {
    this.internalNotes = claimDecliningFormValue.internalNotes;
  }
}

export interface RawClaimDecliningFormValue {
  internalNotes: string;
}
