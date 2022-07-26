'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../lib/init-db`);
const category = require(`./category`);
const DataService = require(`../data-service/CategoriesService`);

const {HttpCode} = require(`../../constants`);

const mockCategories = require(`../../mockTestData/mockCategories`);
const mockArticles = require(`../../mockTestData/mockArticles`);


const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  await initDB(mockDB, {categories: mockCategories, articles: mockArticles});

  const app = express();
  app.use(express.json());
  category(app, new DataService(mockDB));
  return app;
};

describe(`Category REST API`, () => {
  describe(`API returns category list`, () => {

    test(`Status code 200`, async () => {
      const app = await createAPI();
      const response = await request(app).get(`/categories`);
      return expect(response.statusCode).toBe(HttpCode.OK);
    });
    test(`Returns list of 3 titles`, async () => {
      const app = await createAPI();
      const response = await request(app).get(`/categories`);
      return expect(response.body.length).toBe(9);
    });
  });

});

