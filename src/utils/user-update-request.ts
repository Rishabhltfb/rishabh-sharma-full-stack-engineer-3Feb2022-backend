import User from "../models/types/user.types/user.type";
import UserUpdateRequest from "../models/types/user.types/user-update-request.type";

export default class UserRequestConverter {
    userUpdateRequestToUser(
        userUpdateRequest: UserUpdateRequest
    ): Promise<User> {
        const user: User = {
            _id: userUpdateRequest._id,
            name: userUpdateRequest.name ?? "",
            passwordHash: userUpdateRequest.passwordHash,
            email: userUpdateRequest.email,
        };
        return Promise.resolve(user);
    }

    UserToUserUpdateRequest(user: User): Promise<UserUpdateRequest> {
        const userUpdateRequest: UserUpdateRequest = {
            _id: user._id!,
            name: user.name,
            email: user.email,
            passwordHash: user.passwordHash,
        };
        return Promise.resolve(userUpdateRequest);
    }
}
