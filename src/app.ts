import express from "express";
import "dotenv/config";
import {
    GenericExceptionHandler,
    NotFoundExceptionHandler,
} from "./utils/error-handling";
import morganMiddleware from "./config/morgan-middleware";
import logger from "./config/logger";

const app = express();
const { PORT } = process.env;

app.enable("trust proxy");
app.use(morganMiddleware);
app.use(express.json());

// app.get("/", (req, res) => {
//     res.send("Hey Rishabh");
// });
try {
    app.listen(PORT || 8080, () => {
        logger.info("Server INIT", `Listening on PORT: ${PORT}`);
        logger.info(`Running in ${process.env.NODE_ENV} environment`);
    });
} catch (error: any) {}

app.use("/api/v1", require("./routes"));

app.use(NotFoundExceptionHandler);

app.use(GenericExceptionHandler);

export default app;
