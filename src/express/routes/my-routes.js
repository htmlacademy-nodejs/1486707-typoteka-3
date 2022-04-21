'use strict';

const {Router} = require(`express`);
const myRouter = new Router();

myRouter.get(`/`, (req, res) => res.render(`my.pug`));
myRouter.get(`/comments`, (req, res) => res.render(`comments.pug`));
myRouter.get(`/categories`, (req, res) => res.render(`all-categories`));

module.exports = myRouter;
