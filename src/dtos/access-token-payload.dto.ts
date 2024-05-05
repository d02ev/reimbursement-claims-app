import { JwtPayload } from 'jsonwebtoken';

export interface AccessTokenPayloadDto extends JwtPayload {
	role: string;
}
