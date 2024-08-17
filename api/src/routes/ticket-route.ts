import express from "express";
import {
  getTicket,
  updateTicket,
  deleteTicket,
  createTicket,
  getTickets,
} from "../controller/ticket-controller";
import { upload } from "../util/Upload";

const router = express.Router();

router.get("/all", getTickets);

router.get("/:id", getTicket);

router.post("/", upload, createTicket);

router.put("/:id", upload, updateTicket);

router.delete("/:id", deleteTicket);

export default router;
