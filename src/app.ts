import express from "express";
import "dotenv/config";
import {
    GenericExceptionHandler,
    NotFoundExceptionHandler,
} from "./utils/error-handling";
import morganMiddleware from "./config/morgan-middleware";
import logger from "./config/logger";
import connectDB from "./config/db";

const app = express();
if (process.env.NODE_ENV !== "test") {
    connectDB();
}
const { PORT } = process.env;

app.enable("trust proxy");
app.use(morganMiddleware);
app.use(express.json());

try {
    app.listen(PORT || 8080, () => {
        logger.info("Server INIT", `Listening on PORT: ${PORT}`);
        logger.info(`Running in ${process.env.NODE_ENV} environment`);
    });
} catch (error: any) {
    logger.error(`Server SHUTDOWN`, error.message, error);
}

app.use("/api/v1", require("./routes"));

app.use(NotFoundExceptionHandler);

app.use(GenericExceptionHandler);

export default app;
