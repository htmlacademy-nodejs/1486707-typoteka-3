'use strict';

const express = require(`express`);
const supertest = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../lib/init-db`);
const articles = require(`./articles`);
const DataService = require(`../data-service/ArticlesService`);
const CommentsService = require(`../data-service/CommentsService`);
const {HttpCode} = require(`../../constants`);

const mockCategories = require(`../../mockTestData/mockCategories`);
const mockArticles = require(`../../mockTestData/mockArticles`);

const newArticle = {
  title: `Test title of valid lengthhhhhhhhhhhhhh`,
  announce: `Test announce of valid lengthhhhhhhhhhhhhh`,
  articleText: `Test text`,
  categories: [2, 3]
};

const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  await initDB(mockDB, {categories: mockCategories, articles: mockArticles});

  const app = express();
  app.use(express.json());
  articles(app, new DataService(mockDB), new CommentsService(mockDB));
  return app;
};

describe(`Article REST API`, () => {
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

  describe(`API returns a list of all articles`, () => {
    test(`Status code 200`, async () => {
      const response = await request.get(`/articles`);
      return expect(response.statusCode).toBe(HttpCode.OK);
    });
    test(`Returns a list of 5 articles`, async () => {
      const response = await request.get(`/articles`);
      return expect(response.body.length).toBe(5);
    });
    test(`First article's id is "5"`, async () => {
      const response = await request.get(`/articles`);
      return expect(response.body[0].id).toBe(5);
    });
  });

  describe(`API returns an article with given id`, () => {
    test(`Status code 200`, async () => {
      const response = await request.get(`/articles/5`);
      return expect(response.statusCode).toBe(HttpCode.OK);
    });
    test(`Article title is "Как собрать камни бесконечности"`, async () => {
      const response = await request.get(`/articles/5`);
      return expect(response.body.title).toBe(`Как начать программировать`);
    });
  });

  describe(`API creates an article if the data is valid`, () => {
    test(`Status code 201`, async () => {
      const response = await request.post(`/articles`).send(newArticle);
      return expect(response.statusCode).toBe(HttpCode.CREATED);
    });
    test(`Articles count is changed`, async () => {
      const checksBodyLength = (res) => expect(res.body.length).toBe(6);
      await request.post(`/articles`).send(newArticle);
      return await request.get(`/articles`).expect((res) => checksBodyLength(res));
    });
  });

  describe(`API refuses to create an invalid data article`, () => {
    test(`Status Code is 400 without any of the required property`, async () => {
      const invalidArticles = [
        {...newArticle, title: undefined},
        {...newArticle, announce: undefined},
        {...newArticle, categories: undefined},
      ];
      for (const invalidArticle of invalidArticles) {
        await request
          .post(`/articles`)
          .send(invalidArticle)
          .expect(HttpCode.BAD_REQUEST);
      }
    });

    test(`Status Code is 400 when a field has an invalid type`, async () => {
      const invalidArticles = [
        {...newArticle, title: 123},
        {...newArticle, announce: true},
        {...newArticle, categories: `random string`},
      ];
      for (const invalidArticle of invalidArticles) {
        await request
          .post(`/articles`)
          .send(invalidArticle)
          .expect(HttpCode.BAD_REQUEST);
      }
    });

    test(`Status Code is 400 when a field has an invalid value`, async () => {
      const invalidArticles = [
        {...newArticle, title: `short`},
        {...newArticle, announce: `short`},
        {...newArticle, categories: [`string`, `string`]},
      ];
      for (const invalidArticle of invalidArticles) {
        await request
          .post(`/articles`)
          .send(invalidArticle)
          .expect(HttpCode.BAD_REQUEST);
      }
    });
  });

  describe(`API changes existent article`, () => {
    test(`Status code 200`, async () => {
      const response = await request
          .put(`/articles/5`)
          .send(newArticle);
      return expect(response.statusCode).toBe(HttpCode.OK);
    });
    test(`Returns the changed article`, async () => {
      const response = await request
          .put(`/articles/5`)
          .send(newArticle);
      return expect(response.body).toEqual(true);
    });
    test(`Article is really changed`, async () => {
      return request
        .get(`/articles/5`)
        .expect((res) => expect(res.body.title).toBe(`Как начать программировать`));
    });
  });

  describe(`API returns errors when expected`, () => {
    test(`API returns status code 400 when trying to change an article with an invalid id`, async () => {
      return await request
        .put(`/articles/invalidId`)
        .send(newArticle)
        .expect(HttpCode.BAD_REQUEST);
    });
    test(`API returns status code 404 when trying to change an unexistent article`, async () => {
      return await request
      .put(`/articles/1000`)
      .send(newArticle)
      .expect(HttpCode.NOT_FOUND);
    });

    test(`API returns status 400 when trying to change an article with invalid data`, async () => {
      const invalidArticle = {
        announce: `Test announce`,
        text: `Test text`,
      };
      return await request
        .put(`/articles/5`)
        .send(invalidArticle)
        .expect(HttpCode.BAD_REQUEST);
    });
  });

  describe(`API correctly deletes an article`, () => {

    test(`Status code 200`, async () => {
      const response = await request.delete(`/articles/5`);
      return expect(response.statusCode).toBe(HttpCode.OK);
    });
    test(`Article count is 4 now`, async () => {
      await request.delete(`/articles/5`);
      return await request.get(`/articles`)
      .expect((res) => expect(res.body.length).toBe(4));
    });
    test(`API refuses to delete non-existent article`, async () => {
      return await request.delete(`/articles/1000`)
      .expect(HttpCode.NOT_FOUND);
    });
  });
});


