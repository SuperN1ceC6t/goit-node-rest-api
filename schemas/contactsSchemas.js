import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.number().required(),
  favorite: Joi.boolean().default(false),
});

export const updateContactSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.number(),
  favorite: Joi.boolean(),
})
  .min(1)
  .message("Body must have at least one field!");

export const updateContactStatusSchema = Joi.object({
  favorite: Joi.boolean().required(),
});
