'use strict';

const Joi = require(`joi`);
const {HttpCode} = require(`../../constants`);

const ErrorCommentMessage = {
  TEXT_MIN: `Комментарий содержит меньше 5 символов`,
  TEXT_MAX: `Комментарий содержит больше 30 символов`
};

const schema = Joi.object({
  name: Joi.string().min(5).max(30).required().messages({
    'string.min': ErrorCommentMessage.TEXT_MIN,
    'string.man': ErrorCommentMessage.TEXT_MAX
  })
});

module.exports = (req, res, next) => {
  const comment = req.body;

  const {error} = schema.validate(comment, {abortEarly: false});
  if (error) {
    return res.status(HttpCode.BAD_REQUEST).send(error.details.map((err) => err.message).join(`\n`));
  }

  return next();
};
