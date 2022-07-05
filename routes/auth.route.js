
import express from "express";

import authController from "../controllers/auth.controller.js";

const router = express.Router();

router.put(`/signup`, (req, res, next) => {

    authController.signup(req, res, next);
});

router.put(`/signin`, (req, res, next) => {

    authController.signin(req, res, next);
});

export default router;

