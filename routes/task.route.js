
import express from "express";

import { validateVerifyToken } from "./middleware/auth.middleware.js";

import taskController from "../controllers/task.controller.js";

const router = express.Router();

router.put(`/`, [validateVerifyToken], (req, res, next) => {

    taskController.createTask(req, res, next);
});

router.delete('/', [validateVerifyToken], (req, res, next) => {

    taskController.deleteTask(req, res, next);
});

router.put('/update', [validateVerifyToken], (req, res, next) => {

    taskController.updateTask(req, res, next);
});

export default router;


