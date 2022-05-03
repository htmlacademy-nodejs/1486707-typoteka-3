'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const articleExists = require(`../middlewares/articleExists`);
const articleValidator = require(`../middlewares/articleValidator`);
const commentExists = require(`../middlewares/commentExists`);
const commentValidator = require(`../middlewares/commentValidator`);

const route = new Router();

module.exports = (app, articleService, commentsService) => {
  app.use(`/articles`, route);

  route.get(`/`, async (req, res) => {
    const articles = await articleService.findAll();
    return res.status(HttpCode.OK).json(articles);
  });

  route.post(`/`, articleValidator, (req, res) => {
    const article = articleService.create(req.body);

    return res.status(HttpCode.CREATED).json(article);
  });

  route.get(`/:articleId`, (req, res) => {
    const {articleId} = req.params;
    const article = articleService.findOne(articleId);

    if (!article) {
      return res.status(HttpCode.NOT_FOUND)
      .send(`The article with the ${articleId} id was not found`);
    }

    return res.status(HttpCode.OK).json(article);
  });

  route.put(`/:articleId`, [articleExists(articleService), articleValidator], (req, res) => {
    const {article} = res.locals;
    const newArticle = req.body;

    const updatedArticle = articleService.update(article.id, newArticle);
    return res.status(HttpCode.OK).json(updatedArticle);
  });

  route.delete(`/:articleId`, articleExists(articleService), (req, res) => {
    const {articleId} = req.params;
    const deletedArticle = articleService.drop(articleId);

    return res.status(HttpCode.OK).json(deletedArticle);
  });

  route.get(`/:articleId/comments`, articleExists(articleService), (req, res) => {
    const {article} = res.locals;
    const comments = commentsService.findAll(article);

    return res.status(HttpCode.OK).json(comments);
  });

  route.post(`/:articleId/comments`, [articleExists(articleService), commentValidator], (req, res) => {
    const {article} = res.locals;
    const comment = commentsService.create(article, req.body);

    return res.status(HttpCode.CREATED).json(comment);
  });

  route.delete(`/:articleId/comments/:commentId`, [articleExists(articleService), commentExists(articleService, commentsService)], (req, res) => {
    const {article} = res.locals;
    const {comment} = res.locals;

    const deletedComment = commentsService.drop(article, comment.id);

    return res.status(HttpCode.OK).json(deletedComment);
  });
};
