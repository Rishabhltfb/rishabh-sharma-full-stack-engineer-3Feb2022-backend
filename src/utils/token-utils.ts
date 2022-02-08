import jwt, { JwtPayload } from "jsonwebtoken";
import * as bcrypt from "bcryptjs";
import GenericError from "../models/dto/generic/generic-error";
import AuthTokenPayload from "../models/types/auth.types/auth-token-payload";

export default class TokenUtils {
    private JWT_SECRET_KEY: string = process.env.JWT_SECRET_KEY || "";

    private REFRESH_TOKEN_SECRET_KEY: string =
        process.env.REFRESH_TOKEN_SECRET_KEY || "";

    private JWT_TOKEN_EXPIRY_TIME_IN_MINTUES =
        process.env.JWT_TOKEN_EXPIRY_TIME_IN_MINTUES;

    async createJwtToken(tokenPayload: AuthTokenPayload) {
        return jwt.sign(tokenPayload, this.JWT_SECRET_KEY, {
            expiresIn:
                process.env.NODE_ENV !== "production" &&
                this.JWT_TOKEN_EXPIRY_TIME_IN_MINTUES
                    ? `${this.JWT_TOKEN_EXPIRY_TIME_IN_MINTUES}m`
                    : "60m",
        });
    }

    async verifyAndDecodeExpiredJwt(token: string) {
        try {
            const payload = (await jwt.verify(token, this.JWT_SECRET_KEY, {
                ignoreExpiration: true,
            })) as JwtPayload;
            return {
                userId: payload.userId,
                email: payload.email,
            } as AuthTokenPayload;
        } catch (err) {
            throw new GenericError("Error in verifying access token", 401);
        }
    }

    async generateRefreshToken(tokenId: string, userId: string) {
        return jwt.sign({ tokenId, userId }, this.REFRESH_TOKEN_SECRET_KEY, {
            expiresIn: "30d",
        });
    }

    async verifyRefreshToken(
        refreshToken: string,
        ignoreExpiration?: boolean
    ): Promise<AuthTokenPayload> {
        try {
            const payload = (await jwt.verify(
                refreshToken,
                this.REFRESH_TOKEN_SECRET_KEY,
                {
                    ignoreExpiration:
                        ignoreExpiration !== undefined
                            ? ignoreExpiration
                            : false,
                }
            )) as JwtPayload;
            return {
                email: payload.email,
                userId: payload.userId,
            } as AuthTokenPayload;
        } catch (err) {
            throw new GenericError("Error in verifying x-access-token", 401);
        }
    }

    async createTokenHash(token: string) {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(token, salt);
    }
}
