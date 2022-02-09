/* eslint-disable no-await-in-loop */
import CollectionDAO from "../../data/collection.data/collection.data";
import Errors from "../../enums/errors";
import GenericError from "../../models/dto/generic/generic-error";
import Collection from "../../models/types/collection.types/collection.type";
import Restaurant from "../../models/types/restaurant.types/restaurant.type";

export default class CollectionService {
    constructor() {
        this.collectionDAO = new CollectionDAO();
    }

    private collectionDAO;

    getCollectionsByUserId(userId: string): Promise<Array<Collection>> {
        return this.collectionDAO.getCollectionsByUserId(userId);
    }

    createCollection(collection: Collection): Promise<Collection> {
        return this.collectionDAO.createCollection(collection);
    }

    addRestaurantToCollection(
        restaurant: Restaurant,
        id: String
    ): Promise<void> {
        return this.collectionDAO.addRestaurantToCollection(restaurant, id);
    }
}
