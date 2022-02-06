import { Router } from "express";

const router = Router();

router.use(require("./filter"));

module.exports = router;
