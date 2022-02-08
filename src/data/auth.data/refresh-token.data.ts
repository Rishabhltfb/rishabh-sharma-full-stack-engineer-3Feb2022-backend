import { Mongoose } from "mongoose";
import RefreshToken from "../../models/types/auth.types/refresh-token.type";
import RefreshTokenModel from "../../models/schema/refresh-token.schema/refresh-token.schema";

const mongoose = new Mongoose();
export default class RefreshTokenDAO {
    async createRefreshToken(
        refreshToken: RefreshToken
    ): Promise<RefreshToken> {
        const token = new RefreshTokenModel(refreshToken);
        return token.save();
    }

    async updateRefreshToken(
        refreshToken: RefreshToken
    ): Promise<RefreshToken> {
        return RefreshTokenModel.findByIdAndUpdate(
            refreshToken._id,
            {
                ...refreshToken,
            },
            { new: true }
        );
    }

    async getRefreshTokenById(id: string): Promise<RefreshToken> {
        return RefreshTokenModel.findById(id);
    }

    async deleteRefreshTokenByToken(refreshToken: string): Promise<void> {
        await RefreshTokenModel.findOneAndDelete({
            token: refreshToken,
        });
    }

    async getAllUnRevokedRefreshToken(userId: string): Promise<RefreshToken[]> {
        return RefreshTokenModel.find({
            user: userId,
            isRevoked: false,
        });
    }
}
