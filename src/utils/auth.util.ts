import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
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
		return await bcrypt.hash(password, this._hashSaltRounds);
	};

	comparePasswordHash = async (
		normalPassword: string,
		passwordHash: string,
	): Promise<boolean> => {
		return await bcrypt.compare(normalPassword, passwordHash);
	};

	generateAccessToken = (payload: AccessTokenPayloadDto): string => {
		return jwt.sign(payload, this._accessTokenSecretKey, {
			expiresIn: this._accessTokenExpiry,
		});
	};

	generateRefreshToken = (payload: JwtPayload): string => {
		return jwt.sign(payload, this._refreshTokenSecretKey, {
			expiresIn: this._refreshTokenExpiry,
		});
	};
}
