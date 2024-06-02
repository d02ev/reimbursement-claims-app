import { hash, compare } from 'bcrypt';
import { JwtPayload, verify, sign } from 'jsonwebtoken';
import { AccessTokenPayloadDto } from '../dtos';

export class AuthUtil {
	private readonly _accessTokenSecretKey: string;
	private readonly _refreshTokenSecretKey: string;
	private readonly _accessTokenExpiry: string;
	private readonly _refreshTokenExpiry: string;
	private readonly _hashSaltRounds: number;

	constructor() {
		this._accessTokenSecretKey = process.env.ACCESS_TOKEN_SECRET_KEY!;
		this._accessTokenExpiry = process.env.ACCESS_TOKEN_EXPIRY!;
		this._refreshTokenSecretKey = process.env.REFRESH_TOKEN_SECRET_KEY!;
		this._refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY!;
		this._hashSaltRounds = parseInt(process.env.HASH_SALT_ROUNDS!) || 10;
	}

	createPasswordHash = async (password: string): Promise<string> => {
		return await hash(password, this._hashSaltRounds);
	};

	comparePassword = async (
		password: string,
		hash: string,
	): Promise<boolean> => {
		return await compare(password, hash);
	};

	generateAccessToken = (payload: AccessTokenPayloadDto): string => {
		return sign(payload, this._accessTokenSecretKey, {
			expiresIn: this._accessTokenExpiry,
		});
	};

	generateRefreshToken = (payload: JwtPayload): string => {
		return sign(payload, this._refreshTokenSecretKey, {
			expiresIn: this._refreshTokenExpiry,
		});
	};

	verifyRefreshToken = (token: string): string | JwtPayload | null => {
		return verify(token, this._refreshTokenSecretKey, {
			ignoreExpiration: false,
		});
	};
}
