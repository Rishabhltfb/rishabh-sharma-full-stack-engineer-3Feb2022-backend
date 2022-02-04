import morgan, { StreamOptions } from "morgan";
import logger from "./logger";

const stream: StreamOptions = {
    // Use the http severity
    write: (message: any) => logger.http(message),
};

const skip = () => {
    const env = process.env.NODE_ENV || "development";
    return env !== "development";
};

const morganMiddleware = morgan(
    ":date[YYYY-MM-DD HH:mm:ss:ms] :remote-addr :method :url :status :res[content-length] - :response-time ms",
    { stream, skip }
);

export default morganMiddleware;
