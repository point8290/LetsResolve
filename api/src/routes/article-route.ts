import express from "express";
import {
  getArticle,
  updateArticle,
  deleteArticle,
  createArticle,
  getArticles,
} from "../controller/article-controller";
import { upload } from "../util/Upload";

const router = express.Router();

router.get("/all", getArticles);

router.get("/:id", getArticle);

router.post("/", upload, createArticle);

router.put("/:id", upload, updateArticle);

router.delete("/:id", deleteArticle);

export default router;
