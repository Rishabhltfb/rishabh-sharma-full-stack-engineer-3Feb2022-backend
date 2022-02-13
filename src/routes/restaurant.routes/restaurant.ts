import express, { Request, Response, Router } from "express";
import expressAsyncHandler from "express-async-handler";
import passport from "../../config/passport";
import RestaurantModel from "../../models/schema/restaurant.schema/restaurant.schema";
import Restaurant from "../../models/types/restaurant.types/restaurant.type";
import RestaurantService from "../../services/restaurant.services/restaurant.service";
import ResponseAdapter from "../../utils/response-adapter";

const router = Router();
const responseAdapter = new ResponseAdapter();
const restaurantService = new RestaurantService();

//Endpoint for fetching all the restaurant data
router.get(
    "",
    passport.authenticateAll,
    expressAsyncHandler(async (req: Request, res: Response) => {
        let page: number = Number(req.query.page ?? 1);
        let perPage: number = Number(req.query.perPage ?? 20);
        let result = await restaurantService.getRestaurants(page, perPage);
        return res.send(
            responseAdapter.sendSuccessResponse(
                "Successfully fetched restaurants list.",
                result
            )
        );
    })
);

//Endpoint for creating restaurants data
router.post(
    "",
    passport.authenticateUser,
    expressAsyncHandler(async (req: Request, res: Response) => {
        const restaurantBody: Restaurant = req.body;
        await restaurantService.createRestaurant(restaurantBody);
        return res.send(
            responseAdapter.sendSuccessResponse(
                "Restaurant successfully created",
                restaurantBody
            )
        );
    })
);

module.exports = router;
