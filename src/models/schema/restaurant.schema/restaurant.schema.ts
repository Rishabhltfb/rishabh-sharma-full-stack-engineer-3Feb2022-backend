import { timeStamp } from "console";
import mongoose from "mongoose";
import Restaurant from "../../types/restaurant.types/restaurant.type";

mongoose.Schema.Types.String.set("trim", true);

const restaurantSchema = new mongoose.Schema<Restaurant>({
    restaurantName: {
        type: String,
    },
    schedule: {
        Mon: {
            openingTime: Number,
            closingTime: Number,
        },
        Tues: {
            openingTime: Number,
            closingTime: Number,
        },
        Wed: {
            openingTime: Number,
            closingTime: Number,
        },
        Thu: {
            openingTime: Number,
            closingTime: Number,
        },
        Fri: {
            openingTime: Number,
            closingTime: Number,
        },
        Sat: {
            openingTime: Number,
            closingTime: Number,
        },
        Sun: {
            openingTime: Number,
            closingTime: Number,
        },
    },
    time: {
        type: String,
    },
});

restaurantSchema.set("timestamps", true);
// restaurantSchema.set("toObject", { virtuals: true });

const RestaurantModel =
    mongoose.models.Restaurant ||
    mongoose.model("Restaurant", restaurantSchema);

export default RestaurantModel;
