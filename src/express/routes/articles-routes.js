'use strict';

const {Router} = require(`express`);
const articlesRouter = new Router();
const api = require(`../api`).getAPI();

articlesRouter.get(`/:id`, async (req, res) => {
  const {id} = req.params;
  const [article, comments, categories] = await Promise.all([
    api.getArticle(id),
    api.getComments(id),
    api.getCategories()
  ]);
  res.render(`post-detail.pug`, {article, comments, categories});
});
articlesRouter.get(`/category/:id`, (req, res) => res.render(`articles-by-category.pug`));
articlesRouter.get(`/add`, (req, res) => res.render(`post.pug`));
articlesRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const article = await api.getArticle(id);
  res.render(`post.pug`, {article});
});

module.exports = articlesRouter;
