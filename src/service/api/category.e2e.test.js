'use strict';

const express = require(`express`);
const request = require(`supertest`);

const category = require(`./category`);
const DataService = require(`../data-service/CategoriesService`);
const {mockData} = require(`../../test-mock-data`);
const {HttpCode} = require(`../../constants`);

const app = express();
app.use(express.json());
category(app, new DataService(mockData));

describe(`API returns category list`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
            .get(`/categories`);
  });

  test(`Status code 200`, () => {
    return expect(response.statusCode).toBe(HttpCode.OK);
  });
  test(`Returns list of 9 titles`, () => {
    return expect(response.body.length).toBe(9);
  });
});
