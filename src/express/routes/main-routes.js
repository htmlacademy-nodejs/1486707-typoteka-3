'use strict';

const {Router} = require(`express`);
const mainRouter = new Router();

mainRouter.get(`/`, (req, res) => res.render(`main.pug`));
mainRouter.get(`/register`, (req, res) => res.render(`sign-up.pug`));
mainRouter.get(`/login`, (req, res) => res.render(`login.pug`));
mainRouter.get(`/search`, (req, res) => res.render(`search.pug`));

module.exports = mainRouter;
