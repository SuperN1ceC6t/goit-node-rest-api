import {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContactInfo,
} from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";

export const getAllContacts = async (req, res) => {
  const contacts = await listContacts();
  res.status(200).json(contacts);
};

export const getOneContact = async (req, res) => {
  const { id } = req.params;
  const contact = await getContactById(id);
  if (contact) {
    res.status(200).json(contact);
  } else {
    throw HttpError(404, "Not found");
  }
};

export const deleteContact = async (req, res) => {
  const { id } = req.params;
  const deletedContact = await removeContact(id);
  if (deletedContact) {
    res.status(200).json(deletedContact);
  } else {
    throw HttpError(404, "Not found");
  }
};

export const createContact = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    await createContactSchema.validateAsync(
      { name, email, phone },
      { abortEarly: false }
    );
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
  try {
    const newContact = await addContact(
      req.body.name,
      req.body.email,
      req.body.phone
    );
    res.status(201).json(newContact);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateContact = async (req, res) => {
  const { id } = req.params;
  try {
    await updateContactSchema.validateAsync(req.body);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
  const updatedContact = await updateContactInfo(id, req.body);
  if (updatedContact) {
    res.status(200).json(updatedContact);
  } else {
    throw HttpError(404, "Not found");
  }
};
