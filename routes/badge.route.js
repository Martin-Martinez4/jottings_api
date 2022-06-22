
import express from "express";

// import { signup } from "../controllers/auth.controller.js";

import badgeController from "../controllers/badge.controller.js";

const router = express.Router();

router.put(`/`, (req, res, next) => {

    badgeController.createBadge(req, res, next);
});

router.put(`/task`, (req, res, next) => {

    badgeController.createBadgeTaskRelation(req, res, next);
});

router.post('/',(req, res, next) => {

    badgeController.updateBadge(req, res, next);
})

router.delete('/', (req, res, next) => {

    badgeController.deleteBadge(req, res, next);
})

router.delete('/task', (req, res, next) => {

    badgeController.deleteBadgeTaskRelation(req, res, next);
})

export default router;

