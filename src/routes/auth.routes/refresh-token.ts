import express, { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import passport from "../../config/passport";
import AuthResponse from "../../models/types/auth.types/auth-response";
import AuthTokenPayload from "../../models/types/auth.types/auth-token-payload";
import RefreshTokenService from "../../services/auth.services/refresh-token.service";
import ResponseAdapter from "../../utils/response-adapter";

const router = express.Router();
const responseAdapter = new ResponseAdapter();
const refreshTokenService = new RefreshTokenService();

router.get(
    "/refresh",
    expressAsyncHandler(async (req: Request, res: Response) => {
        const jwtToken = req.headers["access-token"]?.toString() || "";
        const refreshToken = req.headers["x-access-token"]?.toString() || "";
        const ip =
            req.headers["x-forwarded-for"]?.toString() ||
            req.socket.remoteAddress ||
            req.ip ||
            "";
        const refreshTokenRequestBody: AuthResponse = {
            jwtToken,
            refreshToken,
            ipAddress: ip,
        };
        refreshTokenRequestBody.ipAddress = ip;
        const response = await refreshTokenService.refreshJwtToken(
            refreshTokenRequestBody
        );
        res.header("x-access-token", response.refreshToken);
        return res
            .status(200)
            .send(
                responseAdapter.sendSuccessResponse(
                    "Success",
                    response.jwtToken
                )
            );
    })
);

router.put(
    "/revoke",
    passport.authenticateAll,
    expressAsyncHandler(async (req: Request, res: Response) => {
        const user = req.user as AuthTokenPayload;
        const refreshToken = req.headers["x-access-token"]?.toString() || "";
        const ip =
            req.headers["x-forwarded-for"]?.toString() ||
            req.socket.remoteAddress ||
            req.ip ||
            "";
        await refreshTokenService.revokeRefreshToken(refreshToken, ip, user);
        return res.send(responseAdapter.sendSuccessResponse("Success", null));
    })
);

router.put(
    "/revoke",
    passport.authenticateAll,
    expressAsyncHandler(async (req: Request, res: Response) => {
        const user = req.user as AuthTokenPayload;
        const refreshToken = req.headers["x-access-token"]?.toString() || "";
        const ip =
            req.headers["x-forwarded-for"]?.toString() ||
            req.socket.remoteAddress ||
            req.ip ||
            "";
        await refreshTokenService.revokeRefreshToken(refreshToken, ip, user);
        return res.send(responseAdapter.sendSuccessResponse("Success", null));
    })
);

router.put(
    "/revoke-all",
    passport.authenticateAll,
    expressAsyncHandler(async (req: Request, res: Response) => {
        const user = req.user as AuthTokenPayload;
        const ip =
            req.headers["x-forwarded-for"]?.toString() ||
            req.socket.remoteAddress ||
            req.ip ||
            "";
        const { _id } = req.body;
        await refreshTokenService.revokeAllRefreshTokens(_id, ip, user);
        return res.send(responseAdapter.sendSuccessResponse("Success", null));
    })
);

module.exports = router;
