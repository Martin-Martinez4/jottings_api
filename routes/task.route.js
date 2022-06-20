
import express from "express";

import taskController from "../controllers/task.controller.js";

const router = express.Router();

router.put(`/`, (req, res, next) => {

    taskController.createTask(req, res, next);
});

router.delete('/', (req, res, next) => {

    taskController.deleteTask(req, res, next);
})

export default router;


