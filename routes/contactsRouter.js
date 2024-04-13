import express from "express";
import contactsControllers from "../controllers/contactsControllers.js";
import {
  createContactSchema,
  updateContactSchema,
  updateContactStatusSchema,
} from "../schemas/contactsSchemas.js";
import validateBody from "../decorators/validateBody.js";
import isValidId from "../middlewares/isValidId.js";
import authenticate from "../middlewares/authenticate.js";

const contactsRouter = express.Router();

contactsRouter.use(authenticate);

contactsRouter.get("/", contactsControllers.getAllContacts);

contactsRouter.get("/:id", isValidId, contactsControllers.getOneContact);

contactsRouter.post(
  "/",
  validateBody(createContactSchema),
  contactsControllers.addContact
);

contactsRouter.delete("/:id", isValidId, contactsControllers.deleteContact);

contactsRouter.put(
  "/:id",
  isValidId,
  validateBody(updateContactSchema),
  contactsControllers.updateContact
);

contactsRouter.patch(
  "/:id/favorite",
  isValidId,
  validateBody(updateContactStatusSchema),
  contactsControllers.updateContactStatus
);

export default contactsRouter;
