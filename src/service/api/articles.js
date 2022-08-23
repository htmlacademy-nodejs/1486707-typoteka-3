'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const articleExists = require(`../middlewares/articleExists`);
const articleValidator = require(`../middlewares/articleValidator`);
const commentExists = require(`../middlewares/commentExists`);
const commentValidator = require(`../middlewares/commentValidator`);
const routeParamsValidator = require(`../middlewares/routeParamsValidator`);

module.exports = (app, articleService, commentsService) => {
  const route = new Router();
  app.use(`/articles`, route);

  route.get(`/`, async (req, res) => {
    const {offset, limit, commentedLimit} = req.query;

    const articles = {};

    articles.current = limit || offset
      ? await articleService.findPage({limit, offset})
      : await articleService.findAll({withComments: true});

    if (commentedLimit) {
      articles.commented = await articleService.findLimit({limit: commentedLimit, withComments: true});
    }

    return res.status(HttpCode.OK).json(articles);
  });

  route.post(`/`, articleValidator, async (req, res) => {
    const article = await articleService.create(req.body);

    return res.status(HttpCode.CREATED).json(article);
  });

  route.get(`/:articleId`, routeParamsValidator, async (req, res) => {
    const {articleId} = req.params;
    const {comments} = req.query;
    const article = await articleService.findOne({id: articleId, withComments: comments});

    if (!article) {
      return res.status(HttpCode.NOT_FOUND)
      .send(`The article with the ${articleId} id was not found`);
    }

    return res.status(HttpCode.OK).json(article);
  });

  route.put(`/:articleId`, [routeParamsValidator, articleExists(articleService), articleValidator], async (req, res) => {
    const {articleId} = req.params;
    const newArticle = req.body;

    const updatedArticle = await articleService.update(articleId, newArticle);
    return res.status(HttpCode.OK).json(updatedArticle);
  });

  route.delete(`/:articleId`, [routeParamsValidator, articleExists(articleService)], async (req, res) => {
    const {articleId} = req.params;
    const deletedArticle = await articleService.drop(articleId);

    return res.status(HttpCode.OK).json(deletedArticle);
  });

  route.get(`/:articleId/comments`, [routeParamsValidator, articleExists(articleService)], async (req, res) => {
    const {articleId} = req.params;
    const comments = await commentsService.findAll(articleId);

    return res.status(HttpCode.OK).json(comments);
  });

  route.get(`/:articleId/comments/:commentId`, [routeParamsValidator, articleExists(articleService)], async (req, res) => {
    const {articleId, commentId} = req.params;
    const comment = await commentsService.findOne(articleId, commentId);

    return res.status(HttpCode.OK).json(comment);
  });

  route.post(`/:articleId/comments`, [routeParamsValidator, articleExists(articleService), commentValidator], async (req, res) => {
    const {articleId} = req.params;
    const comment = await commentsService.create(articleId, req.body);

    return res.status(HttpCode.CREATED).json(comment);
  });

  route.delete(`/:articleId/comments/:commentId`, [routeParamsValidator, articleExists(articleService), commentExists(articleService, commentsService)], async (req, res) => {
    const {commentId} = req.params;

    const deletedComment = await commentsService.drop(commentId);

    return res.status(HttpCode.OK).json(deletedComment);
  });
};
