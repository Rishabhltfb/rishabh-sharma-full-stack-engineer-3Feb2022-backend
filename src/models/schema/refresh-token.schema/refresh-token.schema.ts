import mongoose from "mongoose";
import RefreshToken from "../../types/auth.types/refresh-token.type";

mongoose.Schema.Types.String.set("trim", true);

const refreshTokenSchema = new mongoose.Schema<RefreshToken>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    token: {
        type: String,
        unique: true,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
    createdByIp: {
        type: String,
        required: true,
    },
    isRevoked: {
        type: Boolean,
    },
    revokedAt: {
        type: Date,
    },
    revokedByIp: {
        type: String,
    },
    replacedByToken: {
        type: String,
        index: { unique: true, sparse: true },
    },
});

refreshTokenSchema.set("toObject", { virtuals: true });
refreshTokenSchema.set("timestamps", true);

refreshTokenSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform(doc, ret) {
        delete ret._id;
        delete ret.id;
        delete ret.user;
    },
});

const RefreshTokenModel =
    mongoose.models.RefreshToken ||
    mongoose.model("RefreshToken", refreshTokenSchema);

export default RefreshTokenModel;
