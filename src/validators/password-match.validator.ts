import {
	registerDecorator,
	ValidationOptions,
	ValidatorConstraint,
	ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'DoPasswordsMatch', async: false })
export class DoPasswordsMatchConstraint
	implements ValidatorConstraintInterface
{
	validate(
		value: string,
		validationArguments?: { [key: string]: any },
	): boolean {
		const [relatedPropertyName] = validationArguments!.constraints;
		const password = (validationArguments!.object as any)[relatedPropertyName];
		return password === value;
	}
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	defaultMessage?(validationArguments?: { [key: string]: any }): string {
		return 'Passwords do not match.';
	}
}

export function DoPasswordsMatch(
	relatedPropertyName: string,
	validationOptions?: ValidationOptions,
) {
	return function (object: any, propertyName: string) {
		registerDecorator({
			target: object.constructor,
			propertyName,
			constraints: [relatedPropertyName],
			options: validationOptions,
			validator: DoPasswordsMatchConstraint,
		});
	};
}
