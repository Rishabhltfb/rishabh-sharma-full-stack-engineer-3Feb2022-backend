/* eslint-disable no-await-in-loop */
import { Mongoose } from "mongoose";
import Errors from "../../enums/errors";
import Collection from "../../models/types/collection.types/collection.type";
import CollectionModel from "../../models/schema/collection.schema/collection.schema";
import GenericError from "../../models/dto/generic/generic-error";
import Restaurant from "../../models/types/restaurant.types/restaurant.type";

const mongoose = new Mongoose();

export default class CollectionDAO {
    async getCollectionsByUserId(userId: string): Promise<Array<Collection>> {
        try {
            const collections = await CollectionModel.find({ userId });
            if (!collections) {
                throw new GenericError(Errors.COLLECTION_NOT_FOUND_ERR, 404);
            }
            return collections;
        } catch (err) {
            if (err instanceof mongoose.Error.CastError) {
                throw new GenericError(Errors.COLLECTION_NOT_FOUND_ERR, 404);
            } else {
                throw err;
            }
        }
    }

    async createCollection(collection: Collection): Promise<Collection> {
        const newCollection = new CollectionModel(collection);
        return newCollection.save();
    }

    async updateCollection(collection: Collection): Promise<void> {
        try {
            const updatedCollection = await CollectionModel.findByIdAndUpdate(
                collection._id,
                {
                    ...collection,
                },
                { new: true, omitUndefined: true }
            );
        } catch (err) {
            throw new GenericError(Errors.COLLECTION_UPDATE_ERR, 500);
        }
    }

    async addRestaurantToCollection(
        restaurant: Restaurant,
        id: String
    ): Promise<void> {
        try {
            const updatedCollection = await CollectionModel.updateOne(
                { _id: id },
                { $push: { restaurants: restaurant } }
            );
        } catch (err) {
            throw new GenericError(Errors.COLLECTION_UPDATE_ERR, 500);
        }
    }
}
