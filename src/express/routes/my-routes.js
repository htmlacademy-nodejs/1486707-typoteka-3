'use strict';

const {Router} = require(`express`);

const authorAuth = require(`../middlewares/authorAuth`);
const api = require(`../api`).getAPI();

const {prepareErrors} = require(`../../utils`);
const {HttpCode} = require(`../../constants`);

const myRouter = new Router();

myRouter.get(`/`, authorAuth, async (req, res) => {
  const {user} = req.session;

  const articlesData = await api.getArticles({userId: user.id});
  const articles = articlesData.current;

  res.render(`my.pug`, {articles});
});

myRouter.get(`/comments`, authorAuth, async (req, res) => {
  const {user} = req.session;
  const comments = await api.getAllComments();
  res.render(`comments.pug`, {comments, user});
});

myRouter.get(`/comments/:articleId/:commentId`, authorAuth, async (req, res) => {
  const {articleId, commentId} = req.params;

  try {
    await api.deleteComment(articleId, commentId);
    res.redirect(`/my/comments`);
  } catch (errors) {
    res.status(errors.response.status).send(errors.response.statusText);
  }
});

myRouter.get(`/categories`, authorAuth, async (req, res) => {
  const {user} = req.session;
  const categories = await api.getCategories();
  res.render(`all-categories.pug`, {categories, user});
});

myRouter.post(`/categories`, authorAuth, async (req, res) => {
  const {user} = req.session;
  const categoryText = req.body[`add-category`];

  try {
    await api.createCategory({name: categoryText});
    res.redirect(`/my/categories`);
  } catch (error) {
    const validationMessages = prepareErrors(error);
    const categories = await api.getCategories();
    res.render(`all-categories.pug`, {categories, validationMessages, user});
  }
});

myRouter.post(`/categories/:categoryId`, authorAuth, async (req, res) => {
  const {categoryId} = req.params;
  const categoryText = req.body[`category-name`];

  try {
    await api.updateCategory(categoryId, {
      name: categoryText
    });
    res.redirect(`/my/categories`);
  } catch (error) {
    const validationMessages = prepareErrors(error);
    const categories = await api.getCategories();
    res.render(`all-categories.pug`, {categories, validationMessages});
  }
});

myRouter.get(`/categories/:categoryId`, authorAuth, async (req, res) => {
  const {categoryId} = req.params;

  try {
    await api.deleteCategory(categoryId);
    res.redirect(`/my/categories`);
  } catch (error) {
    const validationMessages = prepareErrors(error);
    const categories = await api.getCategories();
    res.render(`all-categories.pug`, {categories, validationMessages});
  }
});


myRouter.get(`/articles/delete/:articleId/`, authorAuth, async (req, res) => {
  const {articleId} = req.params;

  await api.deleteArticle(articleId);
  res.redirect(`/my`);
});


module.exports = myRouter;
