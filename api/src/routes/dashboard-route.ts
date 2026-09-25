import express from "express";
import { getDashboardSummary } from "../controller/dashboard-controller";
import { requireAuth } from "../middleware/auth";

const router = express.Router();

router.use(requireAuth);

router.get("/summary", getDashboardSummary);

export default router;
