import express, { Request, Response, Router } from "express";
import expressAsyncHandler from "express-async-handler";
import logger from "../../config/logger";
import Errors from "../../enums/errors";
import RestaurantModel from "../../models/schema/restaurant.schema/restaurant.schema";
import Restaurant from "../../models/types/restaurant.types/restaurant.type";
import FilterService from "../../services/filter.services/filter.service";
import ResponseAdapter from "../../utils/response-adapter";

const router = Router();
const responseAdapter = new ResponseAdapter();
const filterService = new FilterService();

router.get(
    "/name",
    expressAsyncHandler(async (req: Request, res: Response) => {
        const name: string = String(req.query.name);

        let result = await filterService.getRestaurantByName(name);

        return res.send(responseAdapter.sendSuccessResponse("Success", result));
    })
);

router.get(
    "/day",
    expressAsyncHandler(async (req: Request, res: Response) => {
        const day = String(req.query.day);
        const openingTime = Number(req.query.openingTime ?? 0);
        const closingTime = Number(req.query.closingTime ?? 2359);
        if (openingTime > closingTime) {
            return res.send(
                responseAdapter.sendErrorResponse(
                    Errors.INVALID_TIME_INPUT_ERROR
                )
            );
        }
        let result: Array<Restaurant> =
            await filterService.getRestaurantsByDayTime(
                day,
                openingTime,
                closingTime
            );

        return res.send(responseAdapter.sendSuccessResponse("Success", result));
    })
);

module.exports = router;
