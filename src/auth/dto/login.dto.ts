import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail(
    {},
    {
      message: 'Email Must Be A Valid Email Address!',
    },
  )
  @IsNotEmpty({
    message: 'Email Cannot Be An Empty String!',
  })
  email: string;

  @IsString()
  @IsNotEmpty({
    message: 'Password Cannot Be An Empty String!',
  })
  password: string;
}
