'use strict';

const express = require(`express`);
const supertest = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../lib/init-db`);
const search = require(`./search`);
const DataService = require(`../data-service/SearchService`);
const {HttpCode} = require(`../../constants`);

const mockCategories = require(`../../mockTestData/mockCategories`);
const mockArticles = require(`../../mockTestData/mockArticles`);
const mockUsers = require(`../../mockTestData/mockUsers`);


const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  await initDB(mockDB, {categories: mockCategories, articles: mockArticles, users: mockUsers});

  const app = express();
  app.use(express.json());
  search(app, new DataService(mockDB));
  return app;
};

describe(`Search REST API`, () => {
  let server;
  let request;

  beforeEach(async () => {
    const api = await createAPI();
    server = api.listen();
    request = supertest.agent(server);
  });

  afterEach(() => {
    server.close();
  });

  describe(`API returns a title based on the search query`, () => {
    test(`Status code 200`, async () => {
      const response = await request
      .get(`/search`)
      .query({
        query: `Как начать`
      });
      return expect(response.statusCode).toBe(HttpCode.OK);
    });

    test(`2 articles found`, async () => {
      const response = await request
      .get(`/search`)
      .query({
        query: `Как начать`
      });
      return expect(response.body.length).toBe(2);
    });
  });

  describe(`API returns error status when something is wrong`, () => {
    test(`API returns 400 when query string is absent`, () => {
      return request
        .get(`/search`)
        .expect(HttpCode.BAD_REQUEST);
    });
  });
});

