import Restaurant from "../../models/types/restaurant.types/restaurant.type";
import RestaurantDAO from "../../data/restaurant.data/restaurant.data";

export default class RestaurantService {
    constructor() {
        this.restaurantDAO = new RestaurantDAO();
    }

    private restaurantDAO;

    getRestaurants(page: number, perPage: number): Promise<Array<Restaurant>> {
        return this.restaurantDAO.getRestaurants(page, perPage);
    }

    createRestaurant(restaurantBody: Restaurant): Promise<void> {
        return this.restaurantDAO.createRestaurant(restaurantBody);
    }
}
