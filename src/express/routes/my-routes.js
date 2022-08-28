'use strict';

const {Router} = require(`express`);

const auth = require(`../middlewares/auth`);
const api = require(`../api`).getAPI();

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
  res.render(`all-categories`, {categories});
});

module.exports = myRouter;
