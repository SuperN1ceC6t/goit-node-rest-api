import Contact from "../models/Contact.js";

const listContacts = (filter = {}, setting = {}) =>
  Contact.find(filter, "-createdAt -updatedAt", setting).populate(
    "owner",
    "email subscription"
  );

const createContact = (data) => Contact.create(data);

const getContactByFilter = (filter) => Contact.findOne(filter);

const updateContactByFilter = (filter, data) =>
  Contact.findOneAndUpdate(filter, data);

const removeContactByFilter = (filter) => Contact.findOneAndDelete(filter);

const updateContactStatusByFilter = (filter, data) =>
  Contact.findOneAndUpdate(filter, data);

const countContacts = (filter) => Contact.countDocuments(filter);

export default {
  listContacts,
  createContact,
  getContactByFilter,
  updateContactByFilter,
  removeContactByFilter,
  updateContactStatusByFilter,
  countContacts,
};
