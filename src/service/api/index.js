'use strict';

const {
  ArticlesService,
  SearchService,
  CategoriesService,
  CommentsService
} = require(`../data-service`);

const sequelize = require(`../lib/sequelize`);
const defineModels = require(`../models`);

const articles = require(`./articles`);
const search = require(`./search`);
const category = require(`./category`);

defineModels(sequelize);

const getApiRoutes = async (app, next) => {


  category(app, new CategoriesService(sequelize));
  search(app, new SearchService(sequelize));
  articles(app, new ArticlesService(sequelize), new CommentsService(sequelize));

  next();
};

module.exports = getApiRoutes;
