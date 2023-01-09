const Joi = require('joi');

const postSchema = Joi.object({
  title: Joi.string()
    .required()
    .min(3)
    .max(75),

  description: Joi.string()
    .max(225),

  tags: Joi.string(),

  body: Joi.string()
    .required(),

  readCount: Joi.number()
    .default(0),

  readingTime: Joi.number(),

  state: Joi.string()
    .default('draft'),

  publishedAt: Joi.date(),

  slug: Joi.string()
    .trim()
    .lowercase()
});

module.exports = postSchema;
