'use strict';

const {HttpCode} = require(`../../constants`);

module.exports = (articleService, commentsService) => (req, res, next) => {
  const {articleId, commentId} = req.params;
  const article = articleService.findOne(articleId);
  const comment = commentsService.findOne(article, commentId);

  if (!comment) {
    return res.status(HttpCode.NOT_FOUND).send(`Comment with the ${commentId} id not found`);
  }

  res.locals.comment = comment;
  return next();
};

