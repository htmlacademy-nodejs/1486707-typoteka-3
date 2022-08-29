'use strict';

const {Router} = require(`express`);
const csrf = require(`csurf`);

const api = require(`../api`).getAPI();
const upload = require(`../middlewares/upload`);
const auth = require(`../middlewares/auth`);
const {prepareErrors} = require(`../../utils`);

const csrfProtection = csrf();

const ARTICLES_PER_PAGE = 8;

const articlesRouter = new Router();

const getAddArticleData = () => {
  return api.getCategories();
};

const getEditArticleData = async ({id, userId}) => {
  const [offer, categories] = await Promise.all([
    api.getArticle(id, false, userId),
    api.getCategories(false)
  ]);

  return [offer, categories];
};

articlesRouter.get(`/category/:categoryId`, async (req, res) => {
  const {user} = req.session;
  const {categoryId} = req.params;

  let {page = 1} = req.query;
  page = +page;

  const limit = ARTICLES_PER_PAGE;
  const offset = (page - 1) * ARTICLES_PER_PAGE;

  const [categories, {category, count, articlesByCategory}] = await Promise.all([
    api.getCategories({withCount: true}),
    api.getCategory({categoryId, limit, offset})
  ]);

  const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);

  const articles = {
    category,
    current: articlesByCategory
  };

  const currentCategory = category;

  res.render(`articles-by-category.pug`, {
    fullView: true, articles, page, totalPages, categories, user, currentCategory
  });
});

articlesRouter.get(`/add`, auth, csrfProtection, async (req, res) => {
  const {user} = req.session;
  const categories = await getAddArticleData();
  res.render(`post.pug`, {categories, user, csrfToken: req.csrfToken()});
});

articlesRouter.post(`/add`, auth, upload.single(`upload`), csrfProtection, async (req, res) => {
  const {body, file} = req;
  const {user} = req.session;
console.log('article routes', body, body.categories)
  const articleData = {
    userId: user.id,
    picture: file ? file.filename : null,
    title: body.title,
    announce: body.announcement,
    articleText: body[`full-text`],
    categories: body.categories ? Object.keys(body.categories).map((item) => parseInt(item, 10)) : [],
  };
  try {
    await api.createArticle(articleData);
    res.redirect(`/my`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const categories = await getAddArticleData();
    const article = articleData;
    res.render(`post.pug`, {article, validationMessages, categories, user, csrfToken: req.csrfToken()});
  }
});

articlesRouter.get(`/edit/:id`, auth, upload.single(`upload`), csrfProtection, async (req, res) => {
  const {id} = req.params;
  const {user} = req.session;
  const [article, categories] = await getEditArticleData({id: Number(id), userId: user.id});

  res.render(`post.pug`, {article, categories, user, csrfToken: req.csrfToken()});
});

articlesRouter.post(`/edit/:id`, auth, upload.single(`upload`), csrfProtection, async (req, res) => {
  const {body, file} = req;
  const {id} = req.params;
  const {user} = req.session;

  const articleData = {
    userId: user.id,
    picture: file ? file.filename : null,
    title: body.title,
    announce: body.announcement,
    articleText: body[`full-text`],
    categories: body.categories ? Object.keys(body.categories).map((item) => parseInt(item, 10)) : [],
  };

  try {
    await api.editArticle(id, articleData);
    res.redirect(`/my`);
  } catch (error) {
    const validationMessages = prepareErrors(error);
    const [article, categories] = await getEditArticleData();
    res.render(`post.pug`, {article, validationMessages, categories, user, csrfToken: req.csrfToken()});
  }
});

articlesRouter.get(`/:id`, csrfProtection, async (req, res) => {
  const {id} = req.params;
  const {user} = req.session;
  const [article, comments, allCategories] = await Promise.all([
    api.getArticle(id),
    api.getComments(id),
    api.getCategories()
  ]);

  const articleCategoriesNames = article.categories.map((category) => category.name);
  const categories = allCategories.filter((item) => articleCategoriesNames.includes(item.name));

  res.render(`post-detail.pug`, {article, comments, categories, user, csrfToken: req.csrfToken()});
});

articlesRouter.post(`/:id/comments`, auth, csrfProtection, async (req, res) => {
  const {id} = req.params;
  const {message} = req.body;
  const {user} = req.session;

  try {
    await api.createComment(id, {
      userId: user.id,
      text: message
    });
    res.redirect(`/articles/${id}`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    const [article, comments, categories] = await Promise.all([
      api.getArticle(id),
      api.getComments(id),
      api.getCategories()
    ]);
    res.render(`post-detail.pug`, {article, comments, categories, validationMessages, user, csrfToken: req.csrfToken()});
  }
});

module.exports = articlesRouter;
