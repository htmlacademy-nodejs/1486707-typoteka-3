'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const upload = require(`../middlewares/upload`);

const articlesRouter = new Router();

articlesRouter.get(`/category/:id`, (req, res) => res.render(`articles-by-category.pug`));

articlesRouter.get(`/add`, (req, res) => res.render(`post.pug`));

articlesRouter.post(`/add`, upload.single(`upload`), async (req, res) => {
  const {body, file} = req;
  const articleData = {
    picture: file ? file.filename : ``,
    title: body.title,
    announce: body.announcement,
    articleText: body[`full-text`],
    categories: [],
  };
  try {
    await api.createArticle(articleData);
    res.redirect(`/my`);
  } catch (error) {
    const article = articleData;
    res.render(`post.pug`, {article});
  }

});

articlesRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const article = await api.getArticle(id);
  res.render(`post.pug`, {article});
});

articlesRouter.get(`/:id`, async (req, res) => {
  const {id} = req.params;
  const [article, comments, categories] = await Promise.all([
    api.getArticle(id),
    api.getComments(id),
    api.getCategories()
  ]);
  res.render(`post-detail.pug`, {article, comments, categories});
});

module.exports = articlesRouter;
