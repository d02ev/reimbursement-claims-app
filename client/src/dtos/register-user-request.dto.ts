export interface RegisterUserRequestDto {
  fullName: string;
  email: string;
  bankName: string;
  ifsc: string;
  bankAccNum: string;
  pan: string;
  password: string;
  confirmPassword: string;
}