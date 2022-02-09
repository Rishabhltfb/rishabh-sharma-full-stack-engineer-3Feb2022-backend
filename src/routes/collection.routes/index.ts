import { Router } from "express";

const router = Router();

router.use(require("./collection"));

module.exports = router;
