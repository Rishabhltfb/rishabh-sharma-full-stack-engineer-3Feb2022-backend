import { Types } from "mongoose";
import Restaurant from "../restaurant.types/restaurant.type";

export default interface Collection {
    readonly _id?: Types.ObjectId;
    readonly userId: Types.ObjectId;
    name: String;
    restautant: Array<Restaurant>;
    readonly createdAt?: Date;
    readonly updatedAt?: Date;
}
