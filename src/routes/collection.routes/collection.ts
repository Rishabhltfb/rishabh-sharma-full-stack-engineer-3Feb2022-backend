import { Request, Response, Router } from "express";
import expressAsyncHandler from "express-async-handler";
import logger from "../../config/logger";
import passport from "../../config/passport";
import Errors from "../../enums/errors";
import AuthTokenPayload from "../../models/types/auth.types/auth-token-payload";
import CollectionUpdateRequest from "../../models/types/collection.types/collection-update-request.types";
import Collection from "../../models/types/collection.types/collection.type";
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
        const collectionBody: Collection = req.body;
        const user: AuthTokenPayload = req.user as AuthTokenPayload;

        if (!collectionBody.user || collectionBody.user !== user.userId) {
            return res.send(
                responseAdapter.sendErrorResponse(Errors.UNAUTHORIZED_ERR, 401)
            );
        }
        let result = await collectionService.createCollection(collectionBody);
        return res.send(responseAdapter.sendSuccessResponse("Success", result));
    })
);

router.put(
    "/addRestaurant",
    passport.authenticateUser,
    expressAsyncHandler(async (req: Request, res: Response) => {
        const { restaurant, id } = req.body;

        let result = await collectionService.addRestaurantToCollection(
            restaurant,
            id
        );
        return res.send(responseAdapter.sendSuccessResponse("Success", result));
    })
);

router.put(
    "",
    passport.authenticateUser,
    expressAsyncHandler(async (req: Request, res: Response) => {
        const body: CollectionUpdateRequest = req.body;
        const user: AuthTokenPayload = req.user as AuthTokenPayload;

        let result = await collectionService.updateCollection(
            user.userId,
            body
        );
        return res.send(responseAdapter.sendSuccessResponse("Success", result));
    })
);

module.exports = router;
