'use strict';

const {Router} = require(`express`);
const myRouter = new Router();
const api = require(`../api`).getAPI();

myRouter.get(`/`, async (req, res) => {
  const articles = await api.getArticles();
  res.render(`my.pug`, {articles});
});
// isn't implemented yet
// myRouter.get(`/comments`, async (req, res) => {
//   const comments = await api.getAllComments();
//   res.render(`comments.pug`, {comments});
// });
myRouter.get(`/categories`, async (req, res) => {
  const categories = await api.getCategories();
  res.render(`all-categories`, {categories});
});

module.exports = myRouter;
