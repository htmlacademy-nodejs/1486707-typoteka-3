'use strict';

const express = require(`express`);
const supertest = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../lib/init-db`);
const users = require(`./users`);
const DataService = require(`../data-service/UsersService`);

const {HttpCode} = require(`../../constants`);

const mockCategories = require(`../../mockTestData/mockCategories`);
const mockArticles = require(`../../mockTestData/mockArticles`);
const mockUsers = require(`../../mockTestData/mockUsers`);

const validUser = {
  name: `Иван`,
  surname: `Иванов`,
  email: `newIvanov@example.com`,
  password: `ivanov`,
  passwordRepeated: `ivanov`,
  avatar: `ivanov.jpg`
};

const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  await initDB(mockDB, {categories: mockCategories, articles: mockArticles, users: mockUsers});

  const app = express();
  app.use(express.json());
  users(app, new DataService(mockDB));
  return app;
};

describe(`User REST API`, () => {
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

  describe(`API creates user if the data is valid`, () => {
    test(`Status code 201`, async () => {
      const response = await request.post(`/user`).send(validUser);
      return expect(response.statusCode).toBe(HttpCode.CREATED);
    });
  });

  describe(`API refuses create user if data is invalid`, () => {
    test(`without any required property response code is 400`, async () => {
      const badUsers = [
        {...validUser, name: null},
        {...validUser, surname: null},
        {...validUser, email: null},
        {...validUser, password: null},
        {...validUser, passwordRepeated: null}
      ];

      for (const badUser of badUsers) {
        const response = await request.post(`/user`).send(badUser);
        expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
      }
    });

    test(`when field type is wrong response code is 400`, async () => {
      const badUsers = [
        {...validUser, name: 123},
        {...validUser, surname: 456},
        {...validUser, email: false},
        {...validUser, password: 789},
        {...validUser, passwordRepeated: true},
        {...validUser, avatar: 123}
      ];

      for (const badUser of badUsers) {
        const response = await request.post(`/user`).send(badUser);
        expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
      }
    });

    test(`when filed value is wrong response code is 400`, async () => {
      const badUsers = [
        {...validUser, name: `fas'1234123'!$%`},
        {...validUser, surname: `fas'1234123'!$%`},
        {...validUser, email: `invalidEmail`},
        {...validUser, password: `short`, passwordRepeated: `short`},
      ];

      for (const badUser of badUsers) {
        const response = await request.post(`/user`).send(badUser);
        expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
      }
    });

    test(`when password and passwordRepeated are not equal, code is 400`, async () => {
      const badUser = {...validUser, password: `longEnough`, passwordRepeated: `longEnough`};

      const response = await request.post(`/user`).send(badUser);
      expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    });

    test(`when email is already in use, code is 400`, async () => {
      const badUser = {...validUser, email: `ivanov@example.com`};

      const response = await request.post(`/user`).send(badUser);
      expect(response.statusCode).toBe(HttpCode.BAD_REQUEST);
    });
  });

  describe(`API authenticate user if data is valid`, () => {
    const validAuthData = {
      email: `ivanov@example.com`,
      password: `ivanov`
    };

    test(`Status code is 200`, async () => {
      const response = await request.post(`/user/auth`).send(validAuthData);
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    test(`User name is Иван Иванов`, async () => {
      const response = await request.post(`/user/auth`).send(validAuthData);
      expect(response.body.name).toBe(`Иван`);
      expect(response.body.surname).toBe(`Иванов`);
    });
  });

  describe(`API refuses to authenticate user if data is invalid`, () => {
    test(`if email is incorrect status is 401`, async () => {
      const badEmailData = {
        email: `invalid@test.com`,
        password: `ivanov`
      };

      const response = await request.post(`/user/auth`).send(badEmailData);
      expect(response.statusCode).toBe(HttpCode.UNAUTHORIZED);
    });

    test(`if password doesn't match status code is 401`, async () => {
      const badPasswordData = {
        email: `ivanov@example.com`,
        password: `invalidPassword`
      };

      const response = await request.post(`/user/auth`).send(badPasswordData);
      expect(response.statusCode).toBe(HttpCode.UNAUTHORIZED);
    });
  });
});


