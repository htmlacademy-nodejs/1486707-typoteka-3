'use strict';

const {Router} = require(`express`);
const mainRouter = new Router();
const api = require(`../api`).getAPI();
const upload = require(`../middlewares/upload`);
const {prepareErrors} = require(`../../utils`);

const ARTICLES_PER_PAGE = 8;
const MOST_COMMENTED_COUNT = 4;
const RECENT_COMMENTS_COUNT = 4;

mainRouter.get(`/`, async (req, res) => {
  let {page = 1} = req.query;
  const {user} = req.session;
  page = +page;

  const limit = ARTICLES_PER_PAGE;
  const offset = (page - 1) * ARTICLES_PER_PAGE;
  const commentedLimit = MOST_COMMENTED_COUNT;
  const commentsLimit = RECENT_COMMENTS_COUNT;

  const [{current, commented, recentComments}, categories] = await Promise.all([
    api.getArticles(offset, limit, commentedLimit, commentsLimit),
    api.getCategories({withCount: true})
  ]);

  const currentArticles = current.articlesData;
  const totalPages = Math.ceil(current.count / ARTICLES_PER_PAGE);

  return currentArticles.length
    ? res.render(`main.pug`, {currentArticles, commented, recentComments, page, totalPages, categories, user})
    : res.render(`main-empty.pug`, {user});
});

mainRouter.get(`/register`, (req, res) => res.render(`sign-up.pug`));

mainRouter.get(`/login`, (req, res) => res.render(`login.pug`));

mainRouter.get(`/search`, async (req, res) => {
  const {query} = req.query;
  const {user} = req.session;

  try {
    const results = await api.search(query);
    res.render(`search.pug`, {results, user});
  } catch (error) {
    res.render(`search.pug`, {results: [], user});
  }
});

mainRouter.post(`/register`, upload.single(`avatar`), async (req, res) => {
  const {body, file} = req;
  const userData = {
    name: body.name,
    surname: body.surname,
    email: body.email,
    password: body.password,
    passwordRepeated: body[`repeat-password`],
    avatar: file ? file.filename : body[`avatar`]
  };

  try {
    await api.createUser(userData);
    res.redirect(`/login`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    res.render(`sign-up.pug`, {validationMessages});
  }
});

mainRouter.post(`/login`, async (req, res) => {
  try {
    const user = await api.auth(req.body[`email`], req.body[`password`]);
    req.session.user = user;
    req.session.save(() => {
      res.redirect(`/`);
    });
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    res.render(`login.pug`, {validationMessages});
  }
});

mainRouter.get(`/logout`, (req, res) => {
  delete req.session.user;
  res.redirect(`/`);
});

module.exports = mainRouter;
