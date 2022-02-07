/* eslint-disable no-await-in-loop */
import { Mongoose } from "mongoose";
import Errors from "../../enums/errors";
import GenericError from "../../models/dto/generic/generic-error";
import RestaurantModel from "../../models/schema/restaurant.schema/restaurant.schema";
import Restaurant from "../../models/types/restaurant.types/restaurant.type";

const mongoose = new Mongoose();

export default class RestaurantDAO {
    async getAllRestaurants(): Promise<Array<Restaurant>> {
        try {
            const restaurants: Array<Restaurant> = await RestaurantModel.find();
            if (!restaurants) {
                throw new GenericError(Errors.RESTAURANT_NOT_FOUND_ERR, 404);
            }
            return restaurants;
        } catch (err) {
            if (err instanceof mongoose.Error.CastError) {
                throw new GenericError(Errors.RESTAURANT_NOT_FOUND_ERR, 404);
            } else {
                throw err;
            }
        }
    }

    async createRestaurant(restaurantBody: Restaurant): Promise<void> {
        try {
            await RestaurantModel.create(restaurantBody);
        } catch (err) {
            throw err;
        }
    }

    async getRestaurantByName(name: string): Promise<Array<Restaurant>> {
        try {
            var nameRegex = new RegExp(String(name));

            const restaurants: Array<Restaurant> = await RestaurantModel.find({
                restaurantName: { $regex: nameRegex },
            });
            if (!restaurants) {
                throw new GenericError(Errors.RESTAURANT_NOT_FOUND_ERR, 404);
            }
            return restaurants;
        } catch (err) {
            if (err instanceof mongoose.Error.CastError) {
                throw new GenericError(Errors.RESTAURANT_NOT_FOUND_ERR, 404);
            } else {
                throw err;
            }
        }
    }

    async getRestaurantsByDayTime(
        day: string,
        openingTime: number,
        closingTime: number
    ): Promise<Array<Restaurant>> {
        try {
            const restaurants: Array<Restaurant> = await RestaurantModel.find()
                .where(`schedule.${day}.openingTime`)
                .lte(openingTime)
                .where(`schedule.${day}.closingTime`)
                .gte(closingTime)
                .exec();
            if (!restaurants) {
                throw new GenericError(Errors.RESTAURANT_NOT_FOUND_ERR, 404);
            }
            return restaurants;
        } catch (err) {
            if (err instanceof mongoose.Error.CastError) {
                throw new GenericError(Errors.RESTAURANT_NOT_FOUND_ERR, 404);
            } else {
                throw err;
            }
        }
    }
}
