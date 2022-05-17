'use strict';

const express = require(`express`);
const request = require(`supertest`);

const category = require(`./category`);
const DataService = require(`../data-service/CategoriesService`);
const {mockData} = require(`../../test-mock-data`);
const {HttpCode} = require(`../../constants`);

const createAPI = () => {
  const app = express();
  const cloneData = JSON.parse(JSON.stringify(mockData));
  app.use(express.json());
  category(app, new DataService(cloneData));
  return app;
};

describe(`Category REST API`, () => {
  describe(`API returns category list`, () => {
    const app = createAPI();

    test(`Status code 200`, async () => {
      const response = await request(app).get(`/categories`);
      return expect(response.statusCode).toBe(HttpCode.OK);
    });
    test(`Returns list of 9 titles`, async () => {
      const response = await request(app).get(`/categories`);
      return expect(response.body.length).toBe(9);
    });
  });

});

