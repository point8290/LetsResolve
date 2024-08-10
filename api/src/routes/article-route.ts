import express from "express";
import {
  getArticle,
  updateArticle,
  deleteArticle,
  createArticle,
} from "../controller/article-controller";

const router = express.Router();

router.get("/:id", getArticle);

router.post("/", createArticle);

router.put("/:id", updateArticle);

router.delete("/:id", deleteArticle);

export default router;
