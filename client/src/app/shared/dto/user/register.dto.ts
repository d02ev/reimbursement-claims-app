export class RegisterDto {
  fullName: string;
  email: string;
  PAN: string;
  bankName: string;
  bankAccountNumber: string;
  password: string;
  confirmPassword: string;

  constructor(registrationFormValue: RawRegistrationFormValue) {
    this.fullName = registrationFormValue.fullName;
    this.email = registrationFormValue.email;
    this.PAN = registrationFormValue.PAN;
    this.bankName = registrationFormValue.bankName;
    this.bankAccountNumber = registrationFormValue.bankAccountNumber;
    this.password = registrationFormValue.password;
    this.confirmPassword = registrationFormValue.confirmPassword;
  }
}

export interface RawRegistrationFormValue {
  fullName: string;
  email: string;
  PAN: string;
  bankName: string;
  bankAccountNumber: string;
  password: string;
  confirmPassword: string;
}
