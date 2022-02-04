import winston from "winston";

const env = process.env.NODE_ENV || "development";

const level = () => {
    const isDevelopment = env === "development";
    return isDevelopment ? "debug" : "info";
};

const print = winston.format.printf((info: any) => {
    const log = `${info.timestamp} [${info.level.toUpperCase()}]: ${
        info.message
    }`;
    return info.stack ? `${log}\n${info.stack}` : log;
});

const format = winston.format.combine(
    winston.format.errors({ message: true, stack: true }),
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
    print
);

const options = {
    console: {
        level: "debug",
        handleExceptions: true,
        json: false,
        colorize: true,
        format: winston.format.combine(
            winston.format.errors({ message: true, stack: true }),
            winston.format.colorize({
                message: true,
            }),
            format,
            env === "development"
                ? print
                : winston.format.printf(
                      (info) =>
                          `${info.timestamp} [${info.level.toUpperCase()}]: ${
                              info.message
                          }`
                  )
        ),
    },
};

const devTransports = [
    new winston.transports.Console(options.console),
    new winston.transports.File({
        filename: "./logs/error.log",
        level: "error",
        handleExceptions: true,
        maxsize: 52428800, // 5MB
        maxFiles: 5,
    }),
    new winston.transports.File({
        filename: "./logs/all.log",
        handleExceptions: true,
        maxsize: 52428800, // 5MB
        maxFiles: 5,
    }),
];

const transports = [
    new winston.transports.Console(options.console),
    new winston.transports.File({
        filename: "./logs/error.log",
        level: "error",
        handleExceptions: true,
        maxsize: 52428800, // 5MB
        maxFiles: 5,
    }),
];

const logger = winston.createLogger({
    level: level(),
    levels: winston.config.npm.levels,
    transports: env === "production" ? transports : devTransports,
    exitOnError: false,
    format,
});

export default logger;
