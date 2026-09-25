import express from "express";
import {
  createContact,
  deleteContact,
  getContact,
  getContacts,
  updateContact,
} from "../controller/contact-controller";
import { requireAdmin } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { createContactSchema, updateContactSchema } from "../validation/contact";

const router = express.Router({ mergeParams: true });

router.get("/", getContacts);
router.get("/:contactId", getContact);
router.post("/", validateBody(createContactSchema), createContact);
router.put("/:contactId", validateBody(updateContactSchema), updateContact);
router.delete("/:contactId", requireAdmin, deleteContact);

export default router;
