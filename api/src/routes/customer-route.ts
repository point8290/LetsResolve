import express from "express";
import {
  createCustomer,
  deleteCustomer,
  getCustomer,
  getCustomers,
  updateCustomer,
} from "../controller/customer-controller";
import { requireAdmin, requireAuth } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { createCustomerSchema, updateCustomerSchema } from "../validation/customer";
import contactRouter from "./contact-route";

const router = express.Router();

router.use(requireAuth);

router.get("/all", getCustomers);
router.get("/:id", getCustomer);
router.post("/", validateBody(createCustomerSchema), createCustomer);
router.put("/:id", validateBody(updateCustomerSchema), updateCustomer);
router.delete("/:id", requireAdmin, deleteCustomer);

router.use("/:customerId/contacts", contactRouter);

export default router;
