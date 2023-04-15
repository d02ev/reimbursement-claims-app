export class BaseUserDto {
  fullName: string;
  email: string;
  PAN: string;
  bankName: string;
  bankAccountNumber: string;
  roles = [0];
  isApprover? = false;
  passwordHash: string;
}
