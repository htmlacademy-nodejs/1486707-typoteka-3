'use strict';

const express = require(`express`);
const {Router} = require(`express`);

const getApiRoutes = require(`../api`);
const {HttpCode, API_PREFIX} = require(`../../constants`);
const {getMockData} = require(`../lib/get-mock-data`);
const {getLogger} = require(`../lib/logger`);
const sequelize = require(`../lib/sequelize`);

const logger = getLogger({name: `api`});

const DEFAULT_PORT = 3000;

const app = express();
const apiRoutes = new Router();

app.use(express.json());

app.use((err, _req, _res, _next) => {
  logger.error(`An error occurred on processing request: ${err.message}`);
});

app.get(`/posts`, async (req, res) => {
  try {
    const mockData = await getMockData();
    res.json(mockData);
  } catch (err) {
    res.send(err);
  }
});

app.use(async (req, res, next) => {
  await getApiRoutes(apiRoutes, next);
});

app.use(API_PREFIX, apiRoutes);

app.use((req, res, next) => {
  logger.debug(`Request on route ${req.url}`);
  res.on(`finish`, () => {
    logger.info(`Response status code ${res.statusCode}`);
    next();
  });
});

app.use((req, res) => {
  res
  .status(HttpCode.NOT_FOUND)
  .send(`Not Found`);
  logger.error(`Route not found: ${req.url}`);
}
);

module.exports = {
  name: `--server`,
  async run(args) {

    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
    } catch (err) {
      logger.error(`An error occured: ${err.message}`);
      process.exit(1);
    }
    logger.info(`Connection established.`);

    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    try {
      app.listen(port, (err) => {
        if (err) {
          return logger.error(`An error occured on server creation`);
        }

        return logger.info(`Listening to connections on ${port}`);
      });
    } catch (err) {
      logger.error(`An error occured: ${err.message}`);
      process.exit(1);
    }
  }
};
