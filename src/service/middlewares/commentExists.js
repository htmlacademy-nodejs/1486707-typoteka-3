'use strict';

const {HttpCode} = require(`../../constants`);

module.exports = (articleService, commentsService) => async (req, res, next) => {
  const {articleId, commentId} = req.params;
  const comment = await commentsService.findOne(articleId, commentId);

  if (!comment) {
    return res.status(HttpCode.NOT_FOUND).send(`Comment with the ${commentId} id not found`);
  }

  res.locals.comment = comment;
  return next();
};

