import express, { Request, Response, Router } from "express";
import expressAsyncHandler from "express-async-handler";
import logger from "../../config/logger";
import Errors from "../../enums/errors";
import GenericError from "../../models/dto/generic/generic-error";
import RestaurantModel from "../../models/schema/restaurant.schema/restaurant.schema";
import ResponseAdapter from "../../utils/response-adapter";

const router = Router();
const responseAdapter = new ResponseAdapter();

router.get(
    "/find",
    expressAsyncHandler(async (req: Request, res: Response) => {
        const name = req.query.name;
        let result;
        if (name) {
            logger.info("Find By name: " + name);
            var nameRegex = new RegExp(String(name));
            result = await RestaurantModel.find({
                restaurantName: { $regex: nameRegex },
            });
        } else {
            result = await RestaurantModel.find();
        }
        return res.send(responseAdapter.sendSuccessResponse("Success", result));
    })
);

router.post(
    "",
    expressAsyncHandler(async (req: Request, res: Response) => {
        const restaurantBody: any = req.body;
        await RestaurantModel.create(restaurantBody);
        return res.send(
            responseAdapter.sendSuccessResponse(
                "Restaurant successfully created",
                restaurantBody
            )
        );
    })
);

module.exports = router;
