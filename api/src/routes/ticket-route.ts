import express from "express";
import {
  getTicket,
  updateTicket,
  deleteTicket,
  createTicket,
  getTickets,
} from "../controller/ticket-controller";
import { uploadMultiple } from "../util/Upload";

const router = express.Router();

router.get("/all", getTickets);

router.get("/:id", getTicket);

router.post("/", uploadMultiple.array("attachments"), createTicket);

router.put("/:id", uploadMultiple.array("attachments"), updateTicket);

router.delete("/:id", deleteTicket);

export default router;
