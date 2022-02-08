import { Mongoose } from "mongoose";
import RefreshTokenDAO from "../../data/auth.data/refresh-token.data";
import Errors from "../../enums/errors";
import GenericError from "../../models/dto/generic/generic-error";
import AuthResponse from "../../models/types/auth.types/auth-response";
import RefreshToken from "../../models/types/auth.types/refresh-token.type";
import TokenPayload from "../../models/types/auth.types/auth-token-payload";
import TokenUtils from "../../utils/token-utils";
import User from "../../models/types/user.types/user.type";

export default class RefreshTokenService {
    private refreshTokenDAO = new RefreshTokenDAO();

    private tokenUtils = new TokenUtils();

    private mongoose = new Mongoose();

    async refreshJwtToken(refreshJwtTokenRequestBody: AuthResponse) {
        const jwtPayload = await this.tokenUtils.verifyAndDecodeExpiredJwt(
            refreshJwtTokenRequestBody.jwtToken
        );
        const { userId, email } = jwtPayload;

        const refreshTokenPayload = await this.tokenUtils.verifyRefreshToken(
            refreshJwtTokenRequestBody.refreshToken
        );
        const refreshTokenId = refreshTokenPayload.tokenId || "";
        const refreshTokenUserId = refreshTokenPayload.userId;

        if (refreshTokenUserId !== userId) {
            throw new GenericError(
                "Refresh Token & JWT Token aren't from same Bearer",
                401
            );
        }
        const passedHashedToken = await this.tokenUtils.createTokenHash(
            refreshJwtTokenRequestBody.refreshToken
        );
        let dbRefreshToken: RefreshToken;
        dbRefreshToken = await this.refreshTokenDAO.getRefreshTokenById(
            refreshTokenId
        );
        if (!dbRefreshToken) {
            throw new GenericError(
                "No refresh token found with the given token",
                404
            );
        }
        if (
            dbRefreshToken.expiresAt.getTime() > Date.now() &&
            !dbRefreshToken.isRevoked &&
            dbRefreshToken.user!.toString() === userId
        ) {
            const token = await this.tokenUtils.generateRefreshToken(
                dbRefreshToken._id!.toString(),
                userId
            );
            dbRefreshToken.expiresAt = new Date(
                Date.now() + 60 * 60 * 24 * 30 * 1000
            );
            const hashedToken = await this.tokenUtils.createTokenHash(token);
            dbRefreshToken.replacedByToken = passedHashedToken;
            dbRefreshToken.token = hashedToken;
            dbRefreshToken.createdByIp =
                refreshJwtTokenRequestBody.ipAddress || "";
            dbRefreshToken.expiresAt = new Date(
                Date.now() + 60 * 60 * 24 * 30 * 1000 - 1000 * 60 * 60
            );

            await this.refreshTokenDAO.updateRefreshToken(dbRefreshToken);
            const jwtToken = await this.tokenUtils.createJwtToken({
                userId,
                email,
            });
            const authResponse: AuthResponse = {
                jwtToken,
                refreshToken: token,
            };
            return authResponse;
        }
        throw new GenericError("Refresh Token expired or unauthorized", 401);
    }

    async createRefreshToken(user: User, ipAddress: string): Promise<string> {
        const id = new this.mongoose.Types.ObjectId();

        const tokenCreated = await this.tokenUtils.generateRefreshToken(
            id.toString(),
            user._id!.toString()
        );
        const hashedToken = await this.tokenUtils.createTokenHash(tokenCreated);

        const refreshToken: RefreshToken = {
            _id: id,
            token: hashedToken,
            user: user._id!,
            expiresAt: new Date(Date.now() + 60 * 60 * 24 * 30 * 1000),
            createdByIp: ipAddress,
            isRevoked: false,
        };

        await this.refreshTokenDAO.createRefreshToken(refreshToken);
        return tokenCreated;
    }

    async revokeRefreshToken(
        refreshToken: string,
        ipAddress: string,
        authData: TokenPayload
    ) {
        const payload = await this.tokenUtils.verifyRefreshToken(
            refreshToken,
            true
        );
        const { userId } = payload;
        const tokenId = payload.tokenId || "";
        if (userId !== authData.userId) {
            throw new GenericError(Errors.UNAUTHORIZED_ERR, 401);
        }
        let dbRefreshToken: RefreshToken;
        dbRefreshToken = await this.refreshTokenDAO.getRefreshTokenById(
            tokenId
        );
        if (!dbRefreshToken) {
            throw new GenericError(
                "No refresh token found with the given token",
                404
            );
        }
        if (dbRefreshToken.isRevoked) {
            throw new GenericError("Token already revoked", 208);
        }
        dbRefreshToken.isRevoked = true;
        dbRefreshToken.revokedAt = new Date();
        dbRefreshToken.revokedByIp = ipAddress;
        await this.refreshTokenDAO.updateRefreshToken(dbRefreshToken);
    }

    async revokeAllRefreshTokens(
        userId: string,
        ipAddress: string,
        authData: TokenPayload
    ) {
        if (userId !== authData.userId) {
            throw new GenericError(Errors.UNAUTHORIZED_ERR, 401);
        } else {
            let tokens: RefreshToken[];
            tokens = await this.refreshTokenDAO.getAllUnRevokedRefreshToken(
                userId
            );
            tokens.forEach(async (token) => {
                token.isRevoked = true;
                token.revokedAt = new Date();
                token.revokedByIp = ipAddress;
                await this.refreshTokenDAO.updateRefreshToken(token);
            });
        }
    }
}
