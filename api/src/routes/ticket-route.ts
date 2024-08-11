import express from "express";
import {
  getTicket,
  updateTicket,
  deleteTicket,
  createTicket,
  getTickets,
} from "../controller/ticket-controller";

const router = express.Router();

router.get("/all", getTickets);

router.get("/:id", getTicket);

router.post("/", createTicket);

router.put("/:id", updateTicket);

router.delete("/:id", deleteTicket);

export default router;
