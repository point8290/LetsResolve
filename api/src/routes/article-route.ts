import express from "express";
import {
  getArticle,
  updateArticle,
  deleteArticle,
  createArticle,
  getArticles,
} from "../controller/article-controller";
import { uploadMultiple } from "../util/Upload";
import { requireAdmin, requireAuth } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { createArticleSchema, updateArticleSchema } from "../validation/article";

const router = express.Router();

router.use(requireAuth);

router.get("/all", getArticles);
router.get("/:id", getArticle);
router.post("/", uploadMultiple.array("attachments"), validateBody(createArticleSchema), createArticle);
router.put("/:id", uploadMultiple.array("attachments"), validateBody(updateArticleSchema), updateArticle);
router.delete("/:id", requireAdmin, deleteArticle);

export default router;
