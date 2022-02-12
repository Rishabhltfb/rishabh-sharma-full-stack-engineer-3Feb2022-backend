import { Types } from "mongoose";
import Restaurant from "../restaurant.types/restaurant.type";

export default interface CollectionUpdateRequest {
    readonly _id: Types.ObjectId;
    name?: string;
    restaurants: Array<Restaurant>;
    readonly user: Types.ObjectId;
    readonly createdAt?: Date;
    readonly updatedAt?: Date;
}
