import mongoose, { Connection } from "mongoose";
import logger from "./logger";

const NODE_ENV = process.env.NODE_ENV || "";

let db: Connection;
function getMongoURI() {
    return process.env.MONGODB_URI || "";
}

function connectDB() {
    // DATABASE CONNECTION
    mongoose.connect(getMongoURI(), {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    });

    // MONGODB CONNECTION CHECK
    db = mongoose.connection;
    db.on("error", (err: any) => {
        logger.error(`Database connection Error: ${err}`);
    });
    db.once("open", () => {
        logger.info("Database connected");
    });
}

export default connectDB;
