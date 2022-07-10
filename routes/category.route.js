
import express from "express";

import { validateVerifyToken } from "./middleware/auth.middleware.js";

import categoryController from "../controllers/category.controller.js";

const router = express.Router();

router.put(`/`, [validateVerifyToken], (req, res, next) => {

    categoryController.createCategory(req, res, next);
});

router.post(`/`, [validateVerifyToken], (req, res, next) => {

    categoryController.editCategory(req, res, next);
});

router.post(`/order`, [validateVerifyToken], (req, res, next) => {

    categoryController.changeCategoryOrder(req, res, next);
});

router.delete('/', [validateVerifyToken], (req, res ,next) => {

    categoryController.deleteCategory(req, res, next);
});

router.put('/task', [validateVerifyToken], (req, res, next) => {

    categoryController.pushTaskInto(req, res, next)

})

router.post('/task/order', [validateVerifyToken], (req, res, next) => {

    categoryController.changeTaskOrder(req, res, next);

})

export default router;


