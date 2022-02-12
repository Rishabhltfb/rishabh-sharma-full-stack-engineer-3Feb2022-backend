/* eslint-disable no-await-in-loop */
import logger from "../../config/logger";
import CollectionDAO from "../../data/collection.data/collection.data";
import Errors from "../../enums/errors";
import GenericError from "../../models/dto/generic/generic-error";
import CollectionUpdateRequest from "../../models/types/collection.types/collection-update-request.types";
import Collection from "../../models/types/collection.types/collection.type";
import Restaurant from "../../models/types/restaurant.types/restaurant.type";
import CollectionRequestConverter from "../../utils/collection-update-request";

export default class CollectionService {
    constructor() {
        this.collectionDAO = new CollectionDAO();

        this.collectionRequestConverter = new CollectionRequestConverter();
    }

    private collectionDAO;
    private collectionRequestConverter;

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

    async updateCollection(
        userId: string,
        newCollection: CollectionUpdateRequest
    ): Promise<void> {
        if (!newCollection.user || userId !== newCollection.user.toString()) {
            throw new GenericError(Errors.UNAUTHORIZED_ERR, 401);
        }

        const collection =
            await this.collectionRequestConverter.collectionUpdateRequestToCollection(
                newCollection
            );
        await this.collectionDAO.updateCollection(collection);
    }
}
