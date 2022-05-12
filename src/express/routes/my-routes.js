'use strict';

const {Router} = require(`express`);
const myRouter = new Router();
const api = require(`../api`).getAPI();

myRouter.get(`/`, async (req, res) => {
  const articles = await api.getArticles();
  res.render(`my.pug`, {articles});
});
myRouter.get(`/comments`, async (req, res) => {
  const comments = await api.getComments();
  res.render(`comments.pug`, {comments});
});
myRouter.get(`/categories`, (req, res) => res.render(`all-categories`));

module.exports = myRouter;
