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

const newComment = {
  avatar: `Test avatar`,
  name: `Test name`,
  surname: `surname`,
  text: `Test text`,
};

const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  await initDB(mockDB, {categories: mockCategories, articles: mockArticles});

  const app = express();
  app.use(express.json());
  articles(app, new DataService(mockDB), new CommentsService(mockDB));
  return app;
};

describe(`Commentary REST API`, () => {
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

  describe(`API returns a list of all comments`, () => {
    test(`Status code 200`, async () => {
      const response = await request.get(`/articles/5/comments`);
      return expect(response.statusCode).toBe(HttpCode.OK);
    });

    test(`Returns a list of 3 articles`, async () => {
      const response = await request.get(`/articles/5/comments`);
      return expect(response.body.length).toBe(3);
    });

    test(`First comment's id is "9"`, async () => {
      const response = await request.get(`/articles/5/comments`);
      return expect(response.body[0].id).toBe(9);
    });
  });

  describe(`API returns a comment with given id`, () => {
    test(`Status code 200`, async () => {
      const response = await request.get(`/articles/5/comments/9`);
      return expect(response.statusCode).toBe(HttpCode.OK);
    });

    test(`Comment text includes "Мне кажется или я уже читал это где-то?"`, async () => {
      const response = await request.get(`/articles/5/comments/9`);
      return expect(response.body.text).toMatch(`Мне кажется или я уже читал это где-то?`);
    });
  });

  describe(`API creates a comment if the data is valid`, () => {
    test(`Status code 201`, async () => {
      const response = await request
             .post(`/articles/5/comments`)
             .send(newComment);
      return expect(response.statusCode).toBe(HttpCode.CREATED);
    });

    test(`Comments count is changed`, async () => {
      const getBodyLength = (res) => expect(res.body.length).toBe(4);
      await request
             .post(`/articles/5/comments`)
             .send(newComment);
      return request
        .get(`/articles/5/comments`)
        .expect((res) => getBodyLength(res));
    });
  });

  describe(`API refuses to create an invalid data comment`, () => {
    test(`Status Code is 400 without any of the required property`, async () => {
      for (const key of Object.keys(newComment)) {
        const badComment = {...newComment};
        delete badComment[key];
        await request
          .post(`/articles`)
          .send(badComment)
          .expect(HttpCode.BAD_REQUEST);
      }
    });
  });

  describe(`API correctly deletes a comment`, () => {
    test(`Status code 200`, async () => {
      const response = await request
      .delete(`/articles/5/comments/9`);
      return expect(response.statusCode).toBe(HttpCode.OK);
    });

    test(`Comments count is 2 now`, async () => {
      await request
      .delete(`/articles/5/comments/9`);
      return await request
      .get(`/articles/5/comments`)
      .expect((res) => expect(res.body.length).toBe(2));
    });

    test(`API refuses to delete non-existent comment`, async () => {
      return await request
      .delete(`/articles/5/comments/invalidId`)
      .expect(HttpCode.NOT_FOUND);
    });
  });

});


