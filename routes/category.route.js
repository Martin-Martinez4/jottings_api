
import express from "express";

// import { signup } from "../controllers/auth.controller.js";

import categoryConroller from "../controllers/category.conroller.js";

const router = express.Router();

router.put(`/`, (req, res, next) => {

    categoryConroller.createCategory(req, res, next);
});

export default router;


