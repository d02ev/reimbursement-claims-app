import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginUserRequestDto {
	@IsNotEmpty({ message: 'Email cannot be empty.' })
	@IsEmail({}, { message: 'Email must be a valid email address.' })
	email!: string;

	@IsNotEmpty({ message: 'Password cannot be empty.' })
	password!: string;
}
