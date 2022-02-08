import { Router } from "express";

const router = Router();

router.use(require("./auth"));
router.use("/refresh-token", require("./refresh-token"));

module.exports = router;
