export class CreateClaimDto {
  date: string;
  type: string;
  requestedAmt: string;
  currency: string;
  receipt: string;

  constructor(claimCreationFormValue: RawClaimCreationFormValue) {
    this.date = claimCreationFormValue.date;
    this.type = claimCreationFormValue.type;
    this.requestedAmt = claimCreationFormValue.requestedAmt;
    this.currency = claimCreationFormValue.currency;
    this.receipt = claimCreationFormValue.receipt;
  }
}

export interface RawClaimCreationFormValue {
  date: string;
  type: string;
  requestedAmt: string;
  currency: string;
  receipt: string;
}
