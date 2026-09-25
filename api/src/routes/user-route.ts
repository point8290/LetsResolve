import express from "express";
import { uploadImage } from "../controller/user-controller";
import { uploadSingle } from "../util/Upload";
import { requireAuth } from "../middleware/auth";

const router = express.Router();

router.use(requireAuth);

router.post("/upload", uploadSingle.single("profileImage"), uploadImage);

export default router;
