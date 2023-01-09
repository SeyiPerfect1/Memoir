const Joi = require('joi');

const userSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(15),

  firstname: Joi.string()
    .alphanum(),

  lastname: Joi.string()
    .alphanum(),

  intro: Joi.string(),
  urlToImage: Joi.string()
});

module.exports = userSchema;
