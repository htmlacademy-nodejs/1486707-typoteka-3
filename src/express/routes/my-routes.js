'use strict';

const {Router} = require(`express`);

const auth = require(`../middlewares/auth`);
const api = require(`../api`).getAPI();

const {prepareErrors} = require(`../../utils`);
const {HttpCode} = require("../../constants");

const myRouter = new Router();

myRouter.get(`/`, auth, async (req, res) => {
  const articles = await api.getArticles();
  res.render(`my.pug`, {articles});
});

myRouter.get(`/comments`, async (req, res) => {
  const comments = await api.getComments();
  res.render(`comments.pug`, {comments});
});

myRouter.get(`/categories`, auth, async (req, res) => {
  const categories = await api.getCategories();
  res.render(`all-categories.pug`, {categories});
});

myRouter.post(`/categories`, auth, async (req, res) => {
  const categoryText = req.body[`add-category`];

  try {
    await api.createCategory({name: categoryText});
    res.redirect(`/my/categories`);
  } catch (error) {
    const validationMessages = prepareErrors(error);
    const categories = await api.getCategories();
    res.render(`all-categories.pug`, {categories, validationMessages});
  }
});

myRouter.post(`/categories/:categoryId`, auth, async (req, res) => {
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

myRouter.get(`/categories/:categoryId`, auth, async (req, res) => {
  const {categoryId} = req.params;

  try {
    await api.deleteCategory(categoryId);

    res.redirect(`/my/categories`);
  } catch (errors) {
    res.status(errors.response.status).send(errors.response.statusText);
  }
});


module.exports = myRouter;
