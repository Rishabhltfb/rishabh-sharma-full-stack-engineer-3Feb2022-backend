import { Request, Response, Router } from "express";
import expressAsyncHandler from "express-async-handler";
import passport from "../../config/passport";
import Errors from "../../enums/errors";
import AuthTokenPayload from "../../models/types/auth.types/auth-token-payload";
import Restaurant from "../../models/types/restaurant.types/restaurant.type";
import CollectionService from "../../services/collection.services/collection.service";
import ResponseAdapter from "../../utils/response-adapter";

const router = Router();
const responseAdapter = new ResponseAdapter();
const collectionService = new CollectionService();

router.get(
    "",
    passport.authenticateUser,
    expressAsyncHandler(async (req: Request, res: Response) => {
        const user: AuthTokenPayload = req.user as AuthTokenPayload;

        let result = await collectionService.getCollectionsByUserId(
            user.userId
        );

        return res.send(responseAdapter.sendSuccessResponse("Success", result));
    })
);

router.post(
    "",
    passport.authenticateUser,
    expressAsyncHandler(async (req: Request, res: Response) => {
        const body = req.body;
        let result = await collectionService.createCollection(body);
        return res.send(responseAdapter.sendSuccessResponse("Success", result));
    })
);

router.put(
    "",
    passport.authenticateUser,
    expressAsyncHandler(async (req: Request, res: Response) => {
        const body = req.body;
        const user: AuthTokenPayload = req.user as AuthTokenPayload;
        let result = await collectionService.addRestaurantToCollection(
            body,
            user.userId
        );
        return res.send(responseAdapter.sendSuccessResponse("Success", result));
    })
);

module.exports = router;
