import mongoose from "mongoose";
import Collection from "../../types/collection.types/collection.type";
import RestaurantModel from "../restaurant.schema/restaurant.schema";

mongoose.Schema.Types.String.set("trim", true);

const collectionSchema = new mongoose.Schema<Collection>({
    name: {
        type: String,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    restautants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: RestaurantModel,
        },
    ],
});

collectionSchema.set("timestamps", true);
collectionSchema.set("toObject", { virtuals: true });

const CollectionModel =
    mongoose.models.Collection ||
    mongoose.model("Collection", collectionSchema);

export default CollectionModel;
