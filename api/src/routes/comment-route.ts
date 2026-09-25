import express from "express";
import { createComment, getComments } from "../controller/comment-controller";
import { validateBody } from "../middleware/validate";
import { createCommentSchema } from "../validation/comment";

const router = express.Router({ mergeParams: true });

router.get("/", getComments);
router.post("/", validateBody(createCommentSchema), createComment);

export default router;
