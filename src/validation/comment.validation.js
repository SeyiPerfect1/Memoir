const Joi = require('joi');

const commentSchema = Joi.object({
  body: Joi.string()
    .required(),

  state: Joi.number()
    .default('draft'),

  publishedAt: Joi.date()

});

module.exports = commentSchema;
