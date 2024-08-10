import express from "express";
import {
  getTicket,
  updateTicket,
  deleteTicket,
  createTicket,
} from "../controller/ticket-controller";

const router = express.Router();

router.get("/:id", getTicket);

router.post("/", createTicket);

router.put("/:id", updateTicket);

router.delete("/:id", deleteTicket);

export default router;
