import {
  Equals,
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class CreateUserDto {
  @IsString({
    message: 'Name Can Only Contain Alphabets!',
  })
  @IsNotEmpty({
    message: 'Name Cannot Be An Empty String!',
  })
  @Length(5, 255, {
    message: 'Name Must Be Between 5 And 255 Characters Long!',
  })
  fullName: string;

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
    message: 'PAN Cannot Be An Empty String!',
  })
  @IsAlphanumeric()
  @Matches(/([A-Z]){5}([0-9]){4}([A-Z]){1}$/, {
    message:
      'PAN Starts From 5 Alphabets With 4 Numeric Values In The Middle and 1 Alphabet At The End!',
  })
  @Length(10, 10, {
    message: 'PAN Must Be Only 10 Characters Long!',
  })
  PAN: string;

  @IsString()
  @IsNotEmpty()
  bankName: string;

  @IsString()
  @IsNotEmpty({
    message: 'Bank Account Number Cannot Be Empty!',
  })
  @Matches(/([0-9]{12})$/, {
    message: 'Bank Account Number Must Only Contain Numeric Digits!',
  })
  @Length(12, 12, {
    message: 'Bank Account Number Must Be 12 Digit Long!',
  })
  bankAccountNumber: string;

  @IsString()
  @IsNotEmpty({
    message: 'Password Cannot Be Empty!',
  })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Password Must Contain 1 Capital Letter, 1 Small Letter, 1 Special Character and 1 Numeric Digit!',
    },
  )
  @MinLength(8, {
    message: 'Password Must Be 8 Characters Long!',
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @ValidateIf((object: CreateUserDto) => object.password !== undefined)
  @Equals('password', { message: 'Passwords Do Not Match!' })
  confirmPassword: string;
}
