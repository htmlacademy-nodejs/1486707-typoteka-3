'use strict';

const Joi = require(`joi`);
const {HttpCode} = require(`../../constants`);

const ErrorArticleMessage = {
  TITLE_MIN: `Заголовок должен содержать не меньше 30 симоволов`,
  TITLE_MAX: `Заголовок должен содержать не больше 250 символов`,
  ANNOUNCE_MIN: `Анонс должен содержать не меньше 30 символов`,
  ANNOUNCE_MAX: `Анонс должен содержать не больше 250 символов`,
  TEXT: `Текст должен содержать не больше 1000 символов`,
  CATEGORIES: `Не выбрана ни одна категория`
};

const schema = Joi.object({
  categories: Joi.array().items(
      Joi.number().integer().positive().messages({
        'number.base': ErrorArticleMessage.CATEGORIES
      })
  ).min(1).required(),
  title: Joi.string().min(30).max(100).messages({
    'string.min': ErrorArticleMessage.TITLE_MIN,
    'string.max': ErrorArticleMessage.TITLE_MAX
  }).required(),
  announce: Joi.string().min(30).max(250).messages({
    'string.min': ErrorArticleMessage.ANNOUNCE_MIN,
    'string.max': ErrorArticleMessage.ANNOUNCE_MAX
  }).required(),
  articleText: Joi.string().max(1000).messages({
    'string.max': ErrorArticleMessage.TEXT
  }),
  picture: Joi.string()
});

module.exports = (req, res, next) => {
  const article = req.body;
  const {error} = schema.validate(article, {abortEarly: false});

  if (error) {
    return res.status(HttpCode.BAD_REQUEST).send(error.details.map((err) => err.message)).join(`\n`);
  }

  return next();
};
