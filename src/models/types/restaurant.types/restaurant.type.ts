import { Types } from "mongoose";

export default interface Restaurant {
    readonly _id?: Types.ObjectId;
    restaurantName?: string;
    schedule?: Map<String, Map<String, Number>>;
    readonly createdAt?: Date;
    readonly updatedAt?: Date;
}
