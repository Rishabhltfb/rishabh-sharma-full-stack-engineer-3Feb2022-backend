import CollectionUpdateRequest from "../models/types/collection.types/collection-update-request.types";
import Collection from "../models/types/collection.types/collection.type";

export default class CollectionRequestConverter {
    collectionUpdateRequestToCollection(
        collectionUpdateRequest: CollectionUpdateRequest
    ): Promise<Collection> {
        const collection: Collection = {
            _id: collectionUpdateRequest._id,
            name: collectionUpdateRequest.name ?? "",
            user: collectionUpdateRequest.user,
            restaurants: collectionUpdateRequest.restaurants,
        };
        return Promise.resolve(collection);
    }

    CollectionToCollectionUpdateRequest(
        collection: Collection
    ): Promise<CollectionUpdateRequest> {
        const collectionUpdateRequest: CollectionUpdateRequest = {
            _id: collection._id!,
            name: collection.name,
            user: collection.user,
            restaurants: collection.restaurants,
        };
        return Promise.resolve(collectionUpdateRequest);
    }
}
