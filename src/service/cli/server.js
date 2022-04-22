'use strict';

const fs = require(`fs`).promises;
const express = require(`express`);

const {HttpCode} = require(`../../constants`);

const FILENAME = `mocks.json`;
const DEFAULT_PORT = 3000;

const app = express();

app.use(express.json());

app.get(`/posts`, async (req, res) => {
  try {
    const fileContent = await fs.readFile(FILENAME);
    const mocks = JSON.parse(fileContent);
    res.json(mocks);
  } catch (_err) {
    res.send([]);
  }
});

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
