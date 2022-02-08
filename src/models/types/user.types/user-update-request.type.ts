import { Types } from "mongoose";

export default interface UserUpdateRequest {
    readonly _id: Types.ObjectId;
    name?: string;
    readonly email: string;
    readonly passwordHash: string;
    readonly createdAt?: Date;
    readonly updatedAt?: Date;
}
