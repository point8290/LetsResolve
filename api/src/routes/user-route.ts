import express from "express";
import { uploadImage } from "../controller/user-controller";
import { uploadSingle } from "../util/Upload";

const router = express.Router();

router.post("/upload", uploadSingle.single("profileImage"), uploadImage);

export default router;
