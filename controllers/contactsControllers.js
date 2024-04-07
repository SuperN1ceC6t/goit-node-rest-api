import contactsServices from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (req, res) => {
  const contacts = await contactsServices.listContacts();
  res.json(contacts);
};

export const getOneContact = async (req, res) => {
  const { id } = req.params;
  const result = await contactsServices.getContactById(id);
  if (!result) throw HttpError(404, `Not found`);
  res.json(result);
};

export const addContact = async (req, res) => {
  const result = await contactsServices.createContact(req.body);
  res.status(201).json(result);
};

export const updateContact = async (req, res) => {
  const { id } = req.params;
  const result = await contactsServices.updateContactById(id, req.body);
  if (!result) throw HttpError(404, `Not found`);
  res.json(result);
};

export const deleteContact = async (req, res) => {
  const { id } = req.params;
  const result = await contactsServices.removeContactById(id);
  if (!result) throw HttpError(404, `Not found`);
  res.json(result);
};

export const updateContactStatus = async (req, res) => {
  const { id } = req.params;
  const result = await contactsServices.updateContactStatusById(id, req.body);
  if (!result) throw HttpError(404, `Not found`);
  res.json(result);
};
