
import express from "express";

// import { signup } from "../controllers/auth.controller.js";

import projectController from "../controllers/project.controller.js";

const router = express.Router();

router.put(`/`, (req, res, next) => {

    projectController.createProject(req, res, next);
});

export default router;


