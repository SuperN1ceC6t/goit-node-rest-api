import Contact from "../models/Contact.js";

const listContacts = () => Contact.find({});

const createContact = (data) => Contact.create(data);

const getContactById = (id) => {
  const data = Contact.findById(id);
  return data;
};

const updateContactById = (id, data) => Contact.findByIdAndUpdate(id, data);

const removeContactById = (id) => Contact.findByIdAndDelete(id);

const updateContactStatusById = (id, data) =>
  Contact.findByIdAndUpdate(id, data);

export default {
  listContacts,
  createContact,
  getContactById,
  updateContactById,
  removeContactById,
  updateContactStatusById,
};
