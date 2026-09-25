import express from "express";
import {
  getTicket,
  updateTicket,
  deleteTicket,
  createTicket,
  getTickets,
} from "../controller/ticket-controller";
import { uploadMultiple } from "../util/Upload";
import { requireAdmin, requireAuth } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { createTicketSchema, updateTicketSchema } from "../validation/ticket";
import commentRouter from "./comment-route";

const router = express.Router();

router.use(requireAuth);

router.get("/all", getTickets);
router.get("/:id", getTicket);
router.post("/", uploadMultiple.array("attachments"), validateBody(createTicketSchema), createTicket);
router.put("/:id", uploadMultiple.array("attachments"), validateBody(updateTicketSchema), updateTicket);
router.delete("/:id", requireAdmin, deleteTicket);

router.use("/:ticketId/comments", commentRouter);

export default router;
