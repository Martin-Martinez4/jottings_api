
import express from "express";

// import { signup } from "../controllers/auth.controller.js";

import categoryController from "../controllers/category.conroller.js";

const router = express.Router();

router.put(`/`, (req, res, next) => {

    categoryController.createCategory(req, res, next);
});

router.post(`/`, (req, res, next) => {

    categoryController.editCategory(req, res, next);
});

router.delete('/', (req, res ,next) => {

    categoryController.deleteCategory(req, res, next);
});

router.put('/task', (req, res, next) => {

    categoryController.pushTaskInto(req, res, next)

})

export default router;


