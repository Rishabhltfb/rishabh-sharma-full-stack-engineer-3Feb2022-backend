import { Types } from "mongoose";

export default interface RefreshToken {
    readonly _id?: Types.ObjectId;
    user: Types.ObjectId;
    token: string;
    expiresAt: Date;
    readonly createdAt?: Date;
    readonly updatedAt?: Date;
    createdByIp: string;
    isRevoked: boolean;
    revokedAt?: Date;
    revokedByIp?: string;
    replacedByToken?: string;
}
