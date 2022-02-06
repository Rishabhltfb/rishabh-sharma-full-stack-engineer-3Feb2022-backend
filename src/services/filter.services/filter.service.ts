import Restaurant from "../../models/types/restaurant.types/restaurant.type";
import RestaurantDAO from "../../data/restaurant.data/restaurant.data";

export default class FilterService {
    constructor() {
        this.restaurantDAO = new RestaurantDAO();
    }

    private restaurantDAO;

    getRestaurantByName(name: string): Promise<Array<Restaurant>> {
        return this.restaurantDAO.getRestaurantByName(name);
    }

    getRestaurantsByDayTime(
        day: string,
        openingTime: number,
        closingTime: number
    ): Promise<Array<Restaurant>> {
        return this.restaurantDAO.getRestaurantsByDayTime(
            day,
            openingTime,
            closingTime
        );
    }
}
