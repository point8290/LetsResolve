import express from "express";
import {
  getArticle,
  updateArticle,
  deleteArticle,
  createArticle,
  getArticles,
} from "../controller/article-controller";
import { uploadMultiple } from "../util/Upload";

const router = express.Router();

router.get("/all", getArticles);

router.get("/:id", getArticle);

router.post("/", uploadMultiple.array("attachments"), createArticle);

router.put("/:id", uploadMultiple.array("attachments"), updateArticle);

router.delete("/:id", deleteArticle);

export default router;
