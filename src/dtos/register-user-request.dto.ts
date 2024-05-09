import {
	IsAlphanumeric,
	IsEmail,
	IsEnum,
	IsNotEmpty,
	IsNumberString,
	IsString,
	IsStrongPassword,
	Length,
	Matches,
} from 'class-validator';
import { BankNames } from '../enums';
import { DoPasswordsMatch } from '../validators';

export class RegisterUserRequestDto {
	@IsNotEmpty({ message: 'Name cannot be empty.' })
	@IsString({ message: 'Name must be a string.' })
	@Matches(/^[a-zA-Z\s]+$/, {
		message: 'Name can only contain alphabets and spaces.',
	})
	fullName: string;

	@IsNotEmpty({ message: 'Email cannot be empty' })
	@IsEmail({}, { message: 'Email must be a valid email address.' })
	email: string;

	@IsNotEmpty({ message: 'Bank name cannot be empty.' })
	@IsString({ message: 'Bank name must be a string' })
	@IsEnum(BankNames)
	bankName: string;

	@IsNotEmpty({ message: 'IFSC code cannot be empty.' })
	@IsAlphanumeric()
	@Matches(/^[A-Z]{4}[0][A-Z0-9]{6}$/, {
		message: 'IFSC code must only contain upper case alphabets and numbers.',
	})
	@Length(11, 11, { message: 'IFSC code must be 11 characters long.' })
	ifsc: string;

	@IsNotEmpty({ message: 'Bank account number cannot be empty.' })
	@IsNumberString()
	@Length(12, 12, { message: 'Bank account number must be 12 digits long.' })
	@Matches(/^\d{12}$/, {
		message: 'Bank account number must only contain numerical digits.',
	})
	bankAccNum: string;

	@IsNotEmpty({ message: 'PAN cannot be empty.' })
	@IsAlphanumeric()
	@Length(10, 10, { message: 'PAN must be 10 characters long ' })
	@Matches(/^[A-Z]{5}\d{4}[A-Z]{1}$/, {
		message: 'PAN must only contain upper case alphabets and numbers.',
	})
	pan: string;

	@IsNotEmpty({ message: 'Password cannot be empty. ' })
	@IsStrongPassword(
		{
			minLength: 8,
			minSymbols: 1,
			minNumbers: 1,
			minLowercase: 1,
			minUppercase: 1,
		},
		{
			message:
				'Password must be minimum 8 characters long with 1 upper and lower case alphabets, 1 numeric digit and 1 special symbol.',
		},
	)
	password: string;

	@IsNotEmpty({ message: 'Confirm password cannot be empty.' })
	@IsStrongPassword({
		minLength: 8,
		minSymbols: 1,
		minNumbers: 1,
		minLowercase: 1,
		minUppercase: 1,
	})
	@DoPasswordsMatch('password')
	confirmPassword: string;

	constructor(obj: RegisterUserRequestDto) {
		this.fullName = obj.fullName;
		this.email = obj.email;
		this.bankName = obj.bankName;
		this.ifsc = obj.ifsc;
		this.bankAccNum = obj.bankAccNum;
		this.pan = obj.pan;
		this.password = obj.password;
		this.confirmPassword = obj.confirmPassword;
	}
}
