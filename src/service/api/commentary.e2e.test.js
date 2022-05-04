'use strict';

const express = require(`express`);
const request = require(`supertest`);

const articles = require(`./articles`);
const ArticlesService = require(`../data-service/ArticlesService`);
const CommentsService = require(`../data-service/CommentsService`);
const {mockData} = require(`../../test-mock-data`);
const {HttpCode} = require(`../../constants`);

const newComment = {
  avatar: `Test avatar`,
  name: `Test name`,
  surname: `surname`,
  date: `date`,
  text: `Test text`,
};

const createAPI = () => {
  const app = express();
  const cloneData = JSON.parse(JSON.stringify(mockData));
  app.use(express.json());
  articles(app, new ArticlesService(cloneData), new CommentsService());
  return app;
};

describe(`API returns a list of all comments`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
         .get(`/articles/jDuz1E/comments`);
  });

  test(`Status code 200`, () => {
    return expect(response.statusCode).toBe(HttpCode.OK);
  });
  test(`Returns a list of 3 articles`, () => {
    return expect(response.body.length).toBe(3);
  });
  test(`First comment's id is "0tuMqv"`, () => {
    return expect(response.body[0].id).toBe(`0tuMqv`);
  });
});

describe(`API returns a comment with given id`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
           .get(`/articles/jDuz1E/comments/0tuMqv`);
  });

  test(`Status code 200`, () => {
    return expect(response.statusCode).toBe(HttpCode.OK);
  });
  test(`Comment text includes "Мне кажется или я уже читал это где-то?"`, () => {
    return expect(response.body.text).toMatch(`Мне кажется или я уже читал это где-то?`);
  });
});

describe(`API creates a comment if the data is valid`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
           .post(`/articles/jDuz1E/comments`)
           .send(newComment);
  });

  test(`Status code 201`, () => {
    return expect(response.statusCode).toBe(HttpCode.CREATED);
  });
  test(`Returns the created comment`, () => {
    return expect(response.body).toEqual(expect.objectContaining(newComment));
  });
  test(`Comments count is changed`, () => {
    return request(app)
      .get(`/articles/jDuz1E/comments`)
      .expect((res) => expect(res.body.length).toBe(4));
  });
});

describe(`API refuses to create an invalid data comment`, () => {
  const app = createAPI();

  test(`Status Code is 400 without any of the required property`, async () => {
    for (const key of Object.keys(newComment)) {
      const badComment = {...newComment};
      delete badComment[key];
      await request(app)
            .post(`/articles`)
            .send(badComment)
            .expect(HttpCode.BAD_REQUEST);
    }
  });
});

describe(`API correctly deletes a comment`, () => {
  const app = createAPI();
  let response;

  beforeAll(async () => {
    response = await request(app)
    .delete(`/articles/jDuz1E/comments/0tuMqv`);
  });

  test(`Status code 200`, () => {
    return expect(response.statusCode).toBe(HttpCode.OK);
  });
  test(`Returns deleted article`, () => {
    return expect(response.body.id).toBe(`0tuMqv`);
  });
  test(`Comments count is 2 now`, () => {
    return request(app)
    .get(`/articles/jDuz1E/comments`)
    .expect((res) => expect(res.body.length).toBe(2));
  });
  test(`API refuses to delete non-existent comment`, () => {
    return request(app)
    .delete(`/articles/jDuz1E/comments/invalidId`)
    .expect(HttpCode.NOT_FOUND);
  });
});


