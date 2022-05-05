'use strict';

const {
  ArticlesService,
  SearchService,
  CategoriesService,
  CommentsService
} = require(`../data-service`);
const {getMockData} = require(`../lib/get-mock-data`);

const articles = require(`./articles`);
const search = require(`./search`);
const category = require(`./category`);

const getApiRoutes = async (app, next) => {
  const mockData = await getMockData();

  category(app, new CategoriesService(mockData));
  search(app, new SearchService(mockData));
  articles(app, new ArticlesService(mockData), new CommentsService());

  next();
};

module.exports = getApiRoutes;
