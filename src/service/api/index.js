'use strict';

const {Router} = require(`express`);

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

const app = new Router();

(async () => {
  const mockData = await getMockData();

  category(app, new CategoriesService(mockData));
  search(app, new SearchService(mockData));
  articles(app, new ArticlesService(mockData), new CommentsService());
})();

module.exports = app;
