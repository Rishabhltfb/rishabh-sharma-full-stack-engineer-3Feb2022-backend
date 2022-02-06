import Restaurant from "../../models/types/restaurant.types/restaurant.type";
import RestaurantDAO from "../../data/restaurant.data/restaurant.data";

export default class RestaurantService {
    constructor() {
        this.restaurantDAO = new RestaurantDAO();
    }

    private restaurantDAO;

    getAllRestaurants(): Promise<Array<Restaurant>> {
        return this.restaurantDAO.getAllRestaurants();
    }
}
