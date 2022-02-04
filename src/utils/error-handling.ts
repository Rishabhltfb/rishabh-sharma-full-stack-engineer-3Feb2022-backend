import { NextFunction, Request, Response } from "express";
// import logger from "../config/logger";
import Errors from "../enums/errors";
import ResponseAdapter from "./response-adapter";

const responseAdapter = new ResponseAdapter();

export function NotFoundExceptionHandler(
    req: Request,
    res: Response,
    // eslint-disable-next-line no-unused-vars
    next: NextFunction
) {
    const error = new Error(Errors.NOT_FOUND_ERR);
    return res
        .status(404)
        .send(responseAdapter.sendErrorResponse(error.message, 404));
}

function getErrorCode(err: any) {
    if (err.code && err.code >= 100 && err.code <= 599) {
        return err.code;
    }
    if (err.status) {
        return err.status;
    }
    return 500;
}

export function GenericExceptionHandler(
    err: any,
    req: Request,
    res: Response,
    // eslint-disable-next-line no-unused-vars
    next: NextFunction
) {
    // logger.error(err);
    const error = err;
    const errCode = getErrorCode(err);
    if (errCode === 401) {
        error.message = Errors.UNAUTHORIZED_ERR;
    } else if (errCode === 404) {
        error.message = Errors.NOT_FOUND_ERR;
    } else if (errCode === 500) {
        error.message = Errors.SERVER_ERR;
    }
    return res
        .status(errCode)
        .send(responseAdapter.sendErrorResponse(error.message, errCode));
}
