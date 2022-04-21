'use strict';

const {Router} = require(`express`);
const articlesRouter = new Router();

articlesRouter.get(`/:id`, (req, res) => res.render(`post-detail.pug`));
articlesRouter.get(`/category/:id`, (req, res) => res.render(`articles-by-category.pug`));
articlesRouter.get(`/add`, (req, res) => res.render(`post.pug`));
articlesRouter.get(`/edit/:id`, (req, res) => res.render(`post.pug`));

module.exports = articlesRouter;
