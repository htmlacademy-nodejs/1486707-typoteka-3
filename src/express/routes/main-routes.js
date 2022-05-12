'use strict';

const {Router} = require(`express`);
const mainRouter = new Router();
const api = require(`../api`).getAPI();

mainRouter.get(`/`, async (req, res) => {
  const articles = await api.getArticles();
  res.render(`main.pug`, {articles});
});
mainRouter.get(`/register`, (req, res) => res.render(`sign-up.pug`));
mainRouter.get(`/login`, (req, res) => res.render(`login.pug`));
mainRouter.get(`/search`, (req, res) => res.render(`search.pug`));

module.exports = mainRouter;
