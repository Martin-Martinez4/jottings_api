
import express from "express";
import { validateVerifyToken } from "./middleware/auth.middleware.js";
import authController from "../controllers/auth.controller.js";

const router = express.Router();

router.put(`/signup`, (req, res, next) => {

    authController.signup(req, res, next);
});

router.put(`/signin`, (req, res, next) => {

    authController.signin(req, res, next);
});

router.get(`/`, [validateVerifyToken], (req, res, next) => {

    // id is from the http cookie refresh_token
    authController.getUser(req, res, next);
});

export default router;

