'use strict';

const express = require(`express`);
const routes = require(`../api`);

const {HttpCode, API_PREFIX} = require(`../../constants`);
const {getMockData} = require(`../lib/get-mock-data`);

const DEFAULT_PORT = 3000;

const app = express();

app.use(express.json());

app.get(`/posts`, async (req, res) => {
  try {
    const mockData = await getMockData();
    res.json(mockData);
  } catch (err) {
    res.send(err);
  }
});

app.use(API_PREFIX, routes);

app.use((req, res) => res
  .status(HttpCode.NOT_FOUND)
  .send(`Not Found`)
);

module.exports = {
  name: `--server`,
  run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;
    app.listen(port);
  }
};
