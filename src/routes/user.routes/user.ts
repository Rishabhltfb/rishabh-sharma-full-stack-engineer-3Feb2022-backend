import express, { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import passport from "../../config/passport";
import AuthTokenPayload from "../../models/types/auth.types/auth-token-payload";
import UserUpdateRequest from "../../models/types/user.types/user-update-request.type";
import UserProfileService from "../../services/user.services/user.service";
import ResponseAdapter from "../../utils/response-adapter";

const router = express.Router();
const userProfileService = new UserProfileService();
const responseAdapter = new ResponseAdapter();

// TODO: If someone is getting someone else profile data. Some data must be hidden.
router.get(
    "",
    passport.authenticateAll,
    expressAsyncHandler(async (req: Request, res: Response) => {
        let id = req.query.id || "";
        const user: AuthTokenPayload = req.user as AuthTokenPayload;

        if (!id || id.length === 0) {
            id = user.userId;
        }
        const response = await userProfileService.getUserById(id?.toString());
        return res.send(
            responseAdapter.sendSuccessResponse("Success", response)
        );
    })
);

router.put(
    "",
    passport.authenticateUser,
    expressAsyncHandler(async (req: Request, res: Response) => {
        const userReqBody: UserUpdateRequest = req.body;
        const user = req.user as AuthTokenPayload;

        await userProfileService.updateUser(user.userId, userReqBody);
        return res.send(responseAdapter.sendSuccessResponse("Success", null));
    })
);

module.exports = router;
