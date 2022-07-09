
import express from "express";
import teamController from "../controllers/team.controller.js";
import { validateVerifyToken } from "./middleware/auth.middleware.js";

const router = express.Router();

// router.put(`/`, [validateVerifyToken], (req, res, next) => {
router.put(`/`, (req, res, next) => {

    teamController.createTeam(req, res, next)
});

router.put(`/project`, (req, res, next) => {

    teamController.addProjectToTeam(req, res, next)
});



export default router;
