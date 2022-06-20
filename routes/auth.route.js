
import express from "express";

// import { signup } from "../controllers/auth.controller.js";

import authController from "../controllers/auth.controller.js";

const router = express.Router();

router.put(`/signup`, (req, res, next) => {

    authController.signup(req, res, next);
});

export default router;

