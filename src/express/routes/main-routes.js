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
mainRouter.get(`/search`, async (req, res) => {
  try {
    const {query} = req.query;
    const results = await api.search(query);
    res.render(`search.pug`, {results});
  } catch (error) {
    res.render(`search.pug`, {results: []});
  }
});

module.exports = mainRouter;
