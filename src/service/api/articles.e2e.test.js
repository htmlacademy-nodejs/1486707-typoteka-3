'use strict';

const express = require(`express`);
const supertest = require(`supertest`);

const articles = require(`./articles`);
const ArticlesService = require(`../data-service/ArticlesService`);
const CommentsService = require(`../data-service/CommentsService`);
const {mockData} = require(`../../test-mock-data`);
const {HttpCode} = require(`../../constants`);

const newArticle = {
  title: `Test title`,
  announce: `Test announce`,
  text: `Test text`,
  category: [`Test category 1`, `Test category 2`],
  comments: []
};

const createAPI = () => {
  const app = express();
  const cloneData = JSON.parse(JSON.stringify(mockData));
  app.use(express.json());
  articles(app, new ArticlesService(cloneData), new CommentsService());
  return app;
};

describe(`Article REST API`, () => {
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

  describe(`API returns a list of all articles`, () => {
    test(`Status code 200`, async () => {
      const response = await request.get(`/articles`);
      return expect(response.statusCode).toBe(HttpCode.OK);
    });
    test(`Returns a list of 5 articles`, async () => {
      const response = await request.get(`/articles`);
      return expect(response.body.length).toBe(5);
    });
    test(`First article's id is "jDuz1E"`, async () => {
      const response = await request.get(`/articles`);
      return expect(response.body[0].id).toBe(`jDuz1E`);
    });
  });

  describe(`API returns an article with given id`, () => {
    test(`Status code 200`, async () => {
      const response = await request.get(`/articles/jDuz1E`);
      return expect(response.statusCode).toBe(HttpCode.OK);
    });
    test(`Article title is "Как собрать камни бесконечности"`, async () => {
      const response = await request.get(`/articles/jDuz1E`);
      return expect(response.body.title).toBe(`Как собрать камни бесконечности`);
    });
  });

  describe(`API creates an article if the data is valid`, () => {
    test(`Status code 201`, async () => {
      const response = await request.post(`/articles`).send(newArticle);
      return expect(response.statusCode).toBe(HttpCode.CREATED);
    });
    test(`Returns the created article`, async () => {
      const response = await request.post(`/articles`).send(newArticle);
      return expect(response.body).toEqual(expect.objectContaining(newArticle));
    });
    test(`Articles count is changed`, async () => {
      const checksBodyLength = (res) => expect(res.body.length).toBe(6);
      await request.post(`/articles`).send(newArticle);
      return await request.get(`/articles`).expect((res) => checksBodyLength(res));
    });
  });

  describe(`API refuses to create an invalid data article`, () => {
    test(`Status Code is 400 without any of the required property`, async () => {
      for (const key of Object.keys(newArticle)) {
        const badArticle = {...newArticle};
        delete badArticle[key];
        await request
              .post(`/articles`)
              .send(badArticle)
              .expect(HttpCode.BAD_REQUEST);
      }
    });
  });

  describe(`API changes existent article`, () => {
    test(`Status code 200`, async () => {
      const response = await request
          .put(`/articles/jDuz1E`)
          .send(newArticle);
      return expect(response.statusCode).toBe(HttpCode.OK);
    });
    test(`Returns the changed article`, async () => {
      const response = await request
          .put(`/articles/jDuz1E`)
          .send(newArticle);
      return expect(response.body).toEqual(expect.objectContaining(newArticle));
    });
    test(`Article is really changed`, async () => {
      return request
        .get(`/articles/jDuz1E`)
        .expect((res) => expect(res.body.title).toBe(`Как собрать камни бесконечности`));
    });
  });

  describe(`API returns errors when expected`, () => {
    test(`API returns status code 404 when trying to change an unexistent article`, async () => {
      return await request
      .put(`/articles/invalidId`)
      .send(newArticle)
      .expect(HttpCode.NOT_FOUND);
    });

    test(`API returns status 400 when trying to change an article with invalid data`, async () => {
      const invalidArticle = {
        announce: `Test announce`,
        text: `Test text`,
      };
      return await request
        .put(`/articles/jDuz1E`)
        .send(invalidArticle)
        .expect(HttpCode.BAD_REQUEST);
    });
  });

  describe(`API correctly deletes an article`, () => {

    test(`Status code 200`, async () => {
      const response = await request.delete(`/articles/jDuz1E`);
      return expect(response.statusCode).toBe(HttpCode.OK);
    });
    test(`Returns deleted article`, async () => {
      const response = await request.delete(`/articles/jDuz1E`);
      return expect(response.body.id).toBe(`jDuz1E`);
    });
    test(`Article count is 4 now`, async () => {
      await request.delete(`/articles/jDuz1E`);
      return await request.get(`/articles`)
      .expect((res) => expect(res.body.length).toBe(4));
    });
    test(`API refuses to delete non-existent article`, async () => {
      return await request.delete(`/articles/invalidId`)
      .expect(HttpCode.NOT_FOUND);
    });
  });
});


