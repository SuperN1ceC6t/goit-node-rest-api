import Joi from "joi";

export const userSignupSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

export const userSigninSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});
