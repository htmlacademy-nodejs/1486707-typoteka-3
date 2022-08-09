'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const upload = require(`../middlewares/upload`);
const {prepareErrors, ensureArray} = require(`../../utils`);

const articlesRouter = new Router();

const getAddArticleData = () => {
  return api.getCategories();
};

const getEditArticleData = async ({id}) => {
  const [offer, categories] = await Promise.all([
    api.getArticle({id, withComments: false}),
    api.getCategories({withCount: false})
  ]);

  return [offer, categories];
};

const getViewArticleData = (id) => {
  return api.getArticle({id, withComments: true});
};

articlesRouter.get(`/category/:id`, (req, res) => res.render(`articles-by-category.pug`));

articlesRouter.get(`/add`, async (req, res) => {
  const categories = await getAddArticleData();
  res.render(`post.pug`, {categories});
});

articlesRouter.post(`/add`, upload.single(`upload`), async (req, res) => {
  const {body, file} = req;
  const articleData = {
    picture: file ? file.filename : ``,
    title: body.title,
    announce: body.announcement,
    articleText: body[`full-text`],
    categories: ensureArray(body.category),
  };
  try {
    await api.createArticle(articleData);
    res.redirect(`/my`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const categories = await getAddArticleData();
    const article = articleData;
    res.render(`post.pug`, {article, validationMessages, categories});
  }
});

articlesRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const article = getViewArticleData(id);
  const categories = await getAddArticleData();
  res.render(`post.pug`, {article, categories});
});

articlesRouter.post(`/edit/:id`, upload.single(`upload`), async (req, res) => {
  const {body, file} = req;
  const {id} = req.params;

  const articleData = {
    picture: file ? file.filename : body[`photo`],
    title: body.title,
    announce: body.announcement,
    articleText: body[`full-text`],
    categories: ensureArray(body.category),
  };

  try {
    await api.editArticle(id, articleData);
    res.redirect(`/my`);
  } catch (error) {
    const validationMessages = prepareErrors(error);
    const [article, categories] = await getEditArticleData();
    res.render(`post.pug`, {article, validationMessages, categories});
  }
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

articlesRouter.post(`/:id/comments`, async (req, res) => {
  const {id} = req.params;
  const {comment} = req.body;

  try {
    await api.createComment(id, comment);
    res.redirect(`/articles/${id}`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const [article, comments, categories] = await Promise.all([
      api.getArticle(id),
      api.getComments(id),
      api.getCategories()
    ]);
    res.render(`post-detail.pug`, {article, comments, categories, validationMessages});
  }
});

module.exports = articlesRouter;
