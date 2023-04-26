export class LoginDto {
  email: string;
  password: string;

  constructor(loginFormValue: RawLoginFormValue) {
    this.email = loginFormValue.email;
    this.password = loginFormValue.password;
  }
}

export interface RawLoginFormValue {
  email: string;
  password: string;
}
