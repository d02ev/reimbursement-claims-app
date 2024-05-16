export interface CreateClaimRequestDto {
  date: string;
  type: string;
  requestedAmt: number;
  currency: string;
  imgName: string;
  imgBuffer: any;
  imgMimeType: string;
};