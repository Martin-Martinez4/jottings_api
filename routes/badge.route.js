
import express from "express";

// import { signup } from "../controllers/auth.controller.js";

import badgeController from "../controllers/badge.controller.js";

const router = express.Router();

router.put(`/`, (req, res, next) => {

    badgeController.createBadge(req, res, next);
});

export default router;

