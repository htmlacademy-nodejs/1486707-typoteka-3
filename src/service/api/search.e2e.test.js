'use strict';

const express = require(`express`);
const supertest = require(`supertest`);

const search = require(`./search`);
const DataService = require(`../data-service/SearchService`);
const {mockData} = require(`../../test-mock-data`);
const {HttpCode} = require(`../../constants`);

const createAPI = () => {
  const app = express();
  const cloneData = JSON.parse(JSON.stringify(mockData));
  app.use(express.json());
  search(app, new DataService(cloneData));
  return app;
};

describe(`Search REST API`, () => {
  let server;
  let request;

  beforeEach((done) => {
    const api = createAPI();
    server = api.listen(done);
    request = supertest.agent(server);
  });

  afterEach((done) => {
    server.close(done);
  });

  describe(`API returns a title based on the search query`, () => {
    test(`Status code 200`, async () => {
      const response = await request
      .get(`/search`)
      .query({
        query: `Как начать программировать`
      });
      return expect(response.statusCode).toBe(HttpCode.OK);
    });

    test(`2 articles found`, async () => {
      const response = await request
      .get(`/search`)
      .query({
        query: `Как начать программировать`
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

