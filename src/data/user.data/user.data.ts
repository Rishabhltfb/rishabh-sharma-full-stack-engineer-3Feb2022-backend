/* eslint-disable no-await-in-loop */
import { Mongoose } from "mongoose";
import Errors from "../../enums/errors";
import User from "../../models/types/user.types/user.type";
import UserModel from "../../models/schema/user.schema/user.schema";
import GenericError from "../../models/dto/generic/generic-error";

const mongoose = new Mongoose();

export default class UserDAO {
    async getUserById(id: string): Promise<User> {
        try {
            const user = await UserModel.findById(id);
            if (!user) {
                throw new GenericError(Errors.USER_NOT_FOUND_ERR, 404);
            }
            return user;
        } catch (err) {
            if (err instanceof mongoose.Error.CastError) {
                throw new GenericError(Errors.USER_NOT_FOUND_ERR, 404);
            } else {
                throw err;
            }
        }
    }

    async getUserByEmail(email: string): Promise<User> {
        return UserModel.findOne({ email });
    }

    async createUser(user: User): Promise<User> {
        const newUser = new UserModel(user);
        return newUser.save();
    }

    async updateUser(user: User): Promise<void> {
        try {
            const updatedUser = await UserModel.findByIdAndUpdate(
                user._id,
                {
                    ...user,
                },
                { new: true, omitUndefined: true }
            );
        } catch (err) {
            throw new GenericError(Errors.USER_UPDATE_ERR, 500);
        }
    }
}
