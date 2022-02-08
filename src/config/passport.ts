import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import passport from "passport";
import AuthTokenPayload from "../models/types/auth.types/auth-token-payload";
import logger from "./logger";
import GenericError from "../models/dto/generic/generic-error";

class PassportManager {
    private JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "";

    initialize() {
        const opts = {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: this.JWT_SECRET_KEY,
        };
        passport.use(
            new JwtStrategy(opts, (jwtPayload: JwtPayload, done: any) => {
                try {
                    const { userId, email } = jwtPayload;
                    const tokenPayload: AuthTokenPayload = {
                        userId,
                        email,
                    };
                    return done(null, tokenPayload);
                } catch (err) {
                    logger.error(err);
                    return done(err);
                }
            })
        );
        return passport.initialize();
    }

    authenticateUser(req: Request, res: Response, next: NextFunction) {
        passport.authenticate("jwt", { session: false }, (err, user, info) => {
            if (err) {
                throw new GenericError(err.message, 401);
            }
            if (!user) {
                if (info.name === "TokenExpiredError") {
                    throw new GenericError("JWT Token Expired", 401);
                }
                throw new GenericError(info.message, 401);
            }
            req.user = user;
            return next();
        })(req, res, next);
    }

    authenticateAll(req: Request, res: Response, next: NextFunction) {
        passport.authenticate("jwt", { session: false }, (err, user, info) => {
            if (err) {
                throw new GenericError(err.message, 401);
            }
            if (!user) {
                if (info.name === "TokenExpiredError") {
                    throw new GenericError("JWT Token Expired", 401);
                }
                throw new GenericError(info.message, 401);
            }
            req.user = user;
            return next();
        })(req, res, next);
    }
}

export default new PassportManager();
