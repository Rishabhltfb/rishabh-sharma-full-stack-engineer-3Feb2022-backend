import { Request, Response, Router } from "express";
import ResponseMessages from "../enums/response-message";
import ResponseAdapter from "../utils/response-adapter";

const router = Router();
const responseAdapter = new ResponseAdapter();

// TESTING ENDPOINT
router.get("/test", (req: Request, res: Response) =>
    res.send(
        responseAdapter.sendSuccessResponse(
            ResponseMessages.SERVER_RUNNING,
            null
        )
    )
);

// router.use("/auth", require("./auth.routes"));
router.use("/restaurant", require("./restaurant.routes"));

module.exports = router;
