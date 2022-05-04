'use strict';

const express = require(`express`);
const request = require(`supertest`);

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

describe(`API returns a list of all articles`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
         .get(`/articles`);
  });

  test(`Status code 200`, () => {
    return expect(response.statusCode).toBe(HttpCode.OK);
  });
  test(`Returns a list of 5 articles`, () => {
    return expect(response.body.length).toBe(5);
  });
  test(`First article's id is "jDuz1E"`, () => {
    return expect(response.body[0].id).toBe(`jDuz1E`);
  });
});

describe(`API returns an article with given id`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
           .get(`/articles/jDuz1E`);
  });

  test(`Status code 200`, () => {
    return expect(response.statusCode).toBe(HttpCode.OK);
  });
  test(`Article title is "Как собрать камни бесконечности"`, () => {
    return expect(response.body.title).toBe(`Как собрать камни бесконечности`);
  });
});

describe(`API creates an article if the data is valid`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
           .post(`/articles`)
           .send(newArticle);
  });

  test(`Status code 201`, () => {
    return expect(response.statusCode).toBe(HttpCode.CREATED);
  });
  test(`Returns the created article`, () => {
    return expect(response.body).toEqual(expect.objectContaining(newArticle));
  });
  test(`Articles count is changed`, () => {
    return request(app)
      .get(`/articles`)
      .expect((res) => expect(res.body.length).toBe(6));
  });
});

describe(`API refuses to create an invalid data article`, () => {
  const app = createAPI();

  test(`Status Code is 400 without any of the required property`, async () => {
    for (const key of Object.keys(newArticle)) {
      const badArticle = {...newArticle};
      delete badArticle[key];
      await request(app)
            .post(`/articles`)
            .send(badArticle)
            .expect(HttpCode.BAD_REQUEST);
    }
  });
});

describe(`API changes existent article`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
        .put(`/articles/jDuz1E`)
        .send(newArticle);
  });

  test(`Status code 200`, () => {
    return expect(response.statusCode).toBe(HttpCode.OK);
  });
  test(`Returns the changed article`, () => {
    return expect(response.body).toEqual(expect.objectContaining(newArticle));
  });
  test(`Article is really changed`, () => {
    return request(app)
      .get(`/articles/jDuz1E`)
      .expect((res) => expect(res.body.title).toBe(`Как собрать камни бесконечности`));
  });
});

describe(`API returns errors when expected`, () => {
  const app = createAPI();

  test(`API returns status code 404 when trying to change an unexistent article`, () => {
    return request(app)
    .put(`/articles/invalidId`)
    .send(newArticle)
    .expect(HttpCode.NOT_FOUND);
  });

  test(`API returns status 400 when trying to change an article with invalid data`, () => {
    const invalidArticle = {
      announce: `Test announce`,
      text: `Test text`,
    };
    return request(app)
      .put(`/articles/jDuz1E`)
      .send(invalidArticle)
      .expect(HttpCode.BAD_REQUEST);
  });
});

describe(`API correctly deletes an article`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
    .delete(`/articles/jDuz1E`);
  });

  test(`Status code 200`, () => {
    return expect(response.statusCode).toBe(HttpCode.OK);
  });
  test(`Returns deleted article`, () => {
    return expect(response.body.id).toBe(`jDuz1E`);
  });
  test(`Article count is 4 now`, () => {
    return request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(4));
  });
  test(`API refuses to delete non-existent article`, () => {
    return request(app)
    .delete(`/articles/invalidId`)
    .expect(HttpCode.NOT_FOUND);
  });
});


