const Joi = require('joi');

const signupSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(15)
    .required(),

  firstname: Joi.string()
    .alphanum()
    .required(),

  lastname: Joi.string()
    .alphanum()
    .required(),

  password: Joi.string()
    .pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,1024}$/)
    .required(),

  email: Joi.string()
    .email()
    .required()
});

const loginSchema = Joi.object({
  password: Joi.string()
    .pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,1024}$/)
    .required(),

  email: Joi.string()
    .email()
    .required()
});

module.exports = {
  signupSchema,
  loginSchema
};
