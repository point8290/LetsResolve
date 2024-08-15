import express from "express";
import {
  getArticle,
  updateArticle,
  deleteArticle,
  createArticle,
  getArticles,
} from "../controller/article-controller";

const router = express.Router();
router.get("/all", getArticles);

router.get("/:id", getArticle);

router.post("/", createArticle);

router.put("/:id", updateArticle);

router.delete("/:id", deleteArticle);

export default router;
