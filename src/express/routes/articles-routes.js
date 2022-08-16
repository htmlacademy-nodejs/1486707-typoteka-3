'use strict';

const {Router} = require(`express`);
const csrf = require(`csurf`);
const csrfProtection = csrf();

const api = require(`../api`).getAPI();
const upload = require(`../middlewares/upload`);
const auth = require(`../middlewares/auth`);
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

articlesRouter.get(`/category/:id`, auth, (req, res) => {
  const {user} = req.session;
  res.render(`articles-by-category.pug`, {user});
});

articlesRouter.get(`/add`, auth, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const categories = await getAddArticleData();
  res.render(`post.pug`, {categories, user, csrfToken: req.csrfToken()});
});

articlesRouter.post(`/add`, auth, csrfProtection, upload.single(`upload`), async (req, res) => {
  const {body, file} = req;
  const {user} = req.session;
  const articleData = {
    userId: user.id,
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
    res.render(`post.pug`, {article, validationMessages, categories, user});
  }
});

articlesRouter.get(`/edit/:id`, auth, csrfProtection, async (req, res) => {
  const {id} = req.params;
  const {user} = req.session;
  const article = getViewArticleData(id);
  const categories = await getAddArticleData();
  res.render(`post.pug`, {article, categories, user, csrfToken: req.csrfToken()});
});

articlesRouter.post(`/edit/:id`, auth, csrfProtection, upload.single(`upload`), async (req, res) => {
  const {body, file} = req;
  const {id} = req.params;
  const {user} = req.session;

  const articleData = {
    userId: user.id,
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
    res.render(`post.pug`, {article, validationMessages, categories, user});
  }
});

articlesRouter.get(`/:id`, csrfProtection, async (req, res) => {
  const {id} = req.params;
  const {user} = req.session;
  const [article, comments, categories] = await Promise.all([
    api.getArticle(id),
    api.getComments(id),
    api.getCategories()
  ]);
  res.render(`post-detail.pug`, {article, comments, categories, user, csrfToken: req.csrfToken()});
});

articlesRouter.post(`/:id/comments`, auth, csrfProtection, async (req, res) => {
  const {id} = req.params;
  const {comment} = req.body;
  const {user} = req.session;

  try {
    await api.createComment(id, {
      userId: user.id,
      text: comment
    });
    res.redirect(`/articles/${id}`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const [article, comments, categories] = await Promise.all([
      api.getArticle(id),
      api.getComments(id),
      api.getCategories()
    ]);
    res.render(`post-detail.pug`, {article, comments, categories, validationMessages, user});
  }
});

module.exports = articlesRouter;
