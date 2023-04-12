export class BaseUserDto {
  fullName: string;
  email: string;
  PAN: string;
  bankName: string;
  bankAccountNumber: string;
  isAdmin = false;
  role = 0;
  isApprover = false;
  passwordHash: string;
}
