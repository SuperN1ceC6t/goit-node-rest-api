import express from "express";
import {
  getAllContacts,
  getOneContact,
  addContact,
  deleteContact,
  updateContact,
  updateContactStatus,
} from "../controllers/contactsControllers.js";
import {
  createContactSchema,
  updateContactSchema,
  updateContactStatusSchema,
} from "../schemas/contactsSchemas.js";
import validateBody from "../decorators/validateBody.js";
import isValidId from "../middlewares/isValidId.js";

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", isValidId, getOneContact);

contactsRouter.post("/", validateBody(createContactSchema), addContact);

contactsRouter.delete("/:id", isValidId, deleteContact);

contactsRouter.put(
  "/:id",
  isValidId,
  validateBody(updateContactSchema),
  updateContact
);

contactsRouter.patch(
  "/:id/favorite",
  isValidId,
  validateBody(updateContactStatusSchema),
  updateContactStatus
);

export default contactsRouter;
