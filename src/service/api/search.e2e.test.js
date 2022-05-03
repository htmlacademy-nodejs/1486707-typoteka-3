'use strict';

const express = require(`express`);
const request = require(`supertest`);

const search = require(`./search`);
const DataService = require(`../data-service/SearchService`);
const {mockData} = require(`../../test-mock-data`);
const {HttpCode} = require(`../../constants`);

const app = express();
app.use(express.json());
search(app, new DataService(mockData));

describe(`API returns a title based on the search query`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
        .get(`/search`)
        .query({
          query: `Как начать программировать`
        });
  });

  test(`Status code 200`, () => {
    return expect(response.statusCode).toBe(HttpCode.OK);
  });
  test(`2 articles found`, () => {
    return expect(response.body.length).toBe(2);
  });
});

describe(`API returns error status when something is wrong`, () => {
  test(`API returns code 404 if nothing's found`, () => {
    return request(app)
    .get(`/search`)
    .query({
      query: `Invalid title`
    })
    .expect(HttpCode.NOT_FOUND);
  });

  test(`API returns 400 when query string is absent`, () => {
    return request(app)
      .get(`/search`)
      .expect(HttpCode.BAD_REQUEST);
  });
});
