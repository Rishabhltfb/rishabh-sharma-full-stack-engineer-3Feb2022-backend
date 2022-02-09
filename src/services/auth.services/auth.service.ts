import Errors from "../../enums/errors";
import * as bcrypt from "bcryptjs";
import UserProfileService from "../user.services/user.service";
import GenericError from "../../models/dto/generic/generic-error";
import TokenUtils from "../../utils/token-utils";
import User from "../../models/types/user.types/user.type";

import RefreshTokenService from "./refresh-token.service";
import AuthResponse from "../../models/types/auth.types/auth-response";

export default class AuthService {
    private tokenUtils = new TokenUtils();
    private userProfileService = new UserProfileService();
    private refreshTokenService = new RefreshTokenService();

    async signIn(
        email: string,
        name: string,
        ipAddress: string,
        password: string
    ): Promise<AuthResponse> {
        const passwordHash = await this.tokenUtils.createTokenHash(password);
        let user: User = await this.userProfileService.getUserByEmail(email);

        if (!user) {
            const newUser: User = {
                email,
                name,
                passwordHash,
            };
            user = await this.userProfileService.createUser(newUser);
        } else {
            const isMatch = await bcrypt.compare(password, user.passwordHash);
            if (!isMatch) {
                throw new GenericError(Errors.INCORRECT_CREDENTIALS_ERR, 401);
            }
        }

        const jwtToken = await this.tokenUtils.createJwtToken({
            userId: user._id!.toString(),
            email,
        });
        const refreshToken = await this.refreshTokenService.createRefreshToken(
            user,
            ipAddress
        );
        let response: AuthResponse = {
            jwtToken,
            refreshToken,
        };

        return response;
    }
}
