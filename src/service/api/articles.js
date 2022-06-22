'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const articleExists = require(`../middlewares/articleExists`);
const articleValidator = require(`../middlewares/articleValidator`);
const commentExists = require(`../middlewares/commentExists`);
const commentValidator = require(`../middlewares/commentValidator`);

module.exports = (app, articleService, commentsService) => {
  const route = new Router();
  app.use(`/articles`, route);

  route.get(`/`, async (req, res) => {
    const articles = await articleService.findAll();
    return res.status(HttpCode.OK).json(articles);
  });

  route.post(`/`, articleValidator, async (req, res) => {
    const article = await articleService.create(req.body);

    return res.status(HttpCode.CREATED).json(article);
  });

  route.get(`/:articleId`, async (req, res) => {
    const {articleId} = req.params;
    const article = await articleService.findOne(articleId);

    if (!article) {
      return res.status(HttpCode.NOT_FOUND)
      .send(`The article with the ${articleId} id was not found`);
    }

    return res.status(HttpCode.OK).json(article);
  });

  route.put(`/:articleId`, [articleExists(articleService), articleValidator], async (req, res) => {
    const {article} = res.locals;
    const newArticle = req.body;

    const updatedArticle = await articleService.update(article.id, newArticle);
    return res.status(HttpCode.OK).json(updatedArticle);
  });

  route.delete(`/:articleId`, articleExists(articleService), async (req, res) => {
    const {articleId} = req.params;
    const deletedArticle = await articleService.drop(articleId);

    return res.status(HttpCode.OK).json(deletedArticle);
  });

  route.get(`/:articleId/comments`, articleExists(articleService), async (req, res) => {
    const {article} = res.locals;
    const comments = await commentsService.findAll(article);

    return res.status(HttpCode.OK).json(comments);
  });

  route.get(`/:articleId/comments/:commentId`, articleExists(articleService), async (req, res) => {
    const {article} = res.locals;
    const {commentId} = req.params;
    const comment = await commentsService.findOne(article, commentId);

    return res.status(HttpCode.OK).json(comment);
  });

  route.post(`/:articleId/comments`, [articleExists(articleService), commentValidator], async (req, res) => {
    const {article} = res.locals;
    const comment = await commentsService.create(article, req.body);

    return res.status(HttpCode.CREATED).json(comment);
  });

  route.delete(`/:articleId/comments/:commentId`, [articleExists(articleService), commentExists(articleService, commentsService)], async (req, res) => {
    const {article} = res.locals;
    const {comment} = res.locals;

    const deletedComment = await commentsService.drop(article, comment.id);

    return res.status(HttpCode.OK).json(deletedComment);
  });
};
