'use strict';

const {HttpCode} = require(`../../constants`);

module.exports = (service) => async (req, res, next) => {
  const {articleId} = req.params;
  const article = await service.findOne({id: articleId, withComments: true});

  if (!article) {
    return res.status(HttpCode.NOT_FOUND).send(`Article with the id=${articleId} not found`);
  }

  res.locals.article = article;
  return next();
};
