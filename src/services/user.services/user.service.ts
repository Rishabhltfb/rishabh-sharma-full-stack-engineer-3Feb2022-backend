/* eslint-disable no-await-in-loop */
import UserDAO from "../../data/user.data/user.data";
import Errors from "../../enums/errors";
import GenericError from "../../models/dto/generic/generic-error";
import User from "../../models/types/user.types/user.type";

import UserUpdateRequest from "../../models/types/user.types/user-update-request.type";
import UserRequestConverter from "../../utils/user-update-request";

export default class UserProfileService {
    constructor() {
        this.userDAO = new UserDAO();
        this.userRequestConverter = new UserRequestConverter();
    }

    private userDAO;
    private userRequestConverter;

    getUserById(id: string): Promise<User> {
        return this.userDAO.getUserById(id);
    }

    createUser(User: User): Promise<User> {
        return this.userDAO.createUser(User);
    }

    getUserByEmail(email: string): Promise<User> {
        return this.userDAO.getUserByEmail(email);
    }

    async updateUser(
        userId: string,
        newUser: UserUpdateRequest
    ): Promise<void> {
        if (!newUser._id || userId !== newUser._id.toString()) {
            throw new GenericError(Errors.UNAUTHORIZED_ERR, 401);
        }
        const User = await this.userRequestConverter.userUpdateRequestToUser(
            newUser
        );
        await this.userDAO.updateUser(User);
    }
}
