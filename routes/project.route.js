
import express from "express";

import projectController from "../controllers/project.controller.js";

const router = express.Router();

router.get('/:id', (req, res, next) => {

    projectController.getProject(req, res, next)
})

router.put(`/`, (req, res, next) => {

    projectController.createProject(req, res, next);
});

router.post('/', (req, res, next) => {

    projectController.editProject(req, res, next);
})

export default router;


