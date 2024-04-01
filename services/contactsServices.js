import fs from "fs/promises";
import { fileURLToPath } from "url";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const contactsPath = path.join(__dirname, "../db/contacts.json");

async function listContacts() {
  const data = await fs.readFile(contactsPath, "utf-8");
  return JSON.parse(data);
}

async function getContactById(contactId) {
  const contacts = await listContacts();
  const contact = contacts.find((contact) => contact.id === contactId);
  return contact || null;
}

async function removeContact(contactId) {
  const contacts = await listContacts();
  const removedContact = contacts.find((contact) => contact.id === contactId);
  const updatedContacts = contacts.filter(
    (contact) => contact.id !== contactId
  );
  await fs.writeFile(contactsPath, JSON.stringify(updatedContacts, null, 2));
  return removedContact || null;
}

async function addContact(name, email, phone) {
  const contacts = await listContacts();
  const newContact = { id: uuidv4(), name, email, phone };
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newContact;
}

const updateContactInfo = async (id, newData) => {
  try {
    const contactsData = await fs.readFile(contactsPath, "utf8");
    const contacts = JSON.parse(contactsData);

    const index = contacts.findIndex((contact) => contact.id === id);
    if (index === -1) {
      return null;
    }

    contacts[index] = { ...contacts[index], ...newData };

    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

    return contacts[index];
  } catch (error) {
    throw new HttpError(500, "Failed to update contact");
  }
};

export {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContactInfo,
};
