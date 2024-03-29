'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {ExitCode} = require(`../../constants`);

const sequelize = require(`../lib/sequelize`);

const {getRandomInt, arrayShuffle, getRandomSubarray} = require(`../../utils`);
const {getLogger} = require(`../lib/logger`);
const initDatabase = require(`../lib/init-db`);
const passwordUtils = require(`../lib/password`);

const DEFAULT_COUNT = 10;
const MAX_COUNT = 1000;
const MAX_COUNT_ERROR_MESSAGE = `Не больше ${MAX_COUNT} публикаций`;
const MAX_TEXT_SENTENCES = 5;
const MAX_COMMENTS = 4;
const MAX_CATEGORIES = 5;

const FILE_ANNOUNCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;

const logger = getLogger({name: `api`});

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf-8`);
    return content.trim().split(`\n`);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

const generateComments = (count, commentsData, users) => (
  Array(count).fill({}).map(() => ({
    user: users[getRandomInt(0, users.length - 1)].email,
    text: arrayShuffle(commentsData)
      .slice(0, getRandomInt(1, 3))
      .join(` `),
  }))
);
const generateArticles = (count, titles, announces, categories, comments, users, pictures) => {
  return Array(count).fill({}).map(() => ({
    user: users[getRandomInt(0, users.length - 1)].email,
    title: titles[getRandomInt(1, titles.length - 1)],
    announce: announces[getRandomInt(1, announces.length - 1)],
    articleText: arrayShuffle(announces).slice(1, MAX_TEXT_SENTENCES).join(` `),
    categories: getRandomSubarray(categories, MAX_CATEGORIES),
    comments: generateComments(getRandomInt(1, MAX_COMMENTS), comments, users),
    picture: pictures[getRandomInt(1, pictures.length - 1)]
  })
  );
};

module.exports = {
  name: `--filldb`,
  async run(args) {
    try {
      logger.info(`Trying to connect to the database...`);
      await sequelize.authenticate();
    } catch (err) {
      logger.error(`An error occured: ${err.message}`);
      process.exit(1);
    }
    logger.info(`Connection to the database established`);

    const announces = await readContent(FILE_ANNOUNCES_PATH);
    const titles = await readContent(FILE_TITLES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const comments = await readContent(FILE_COMMENTS_PATH);

    const users = [
      {
        name: `Иван`,
        surname: `Иванов`,
        email: `ivanov@example.com`,
        passwordHash: await passwordUtils.hash(`ivanov`),
        avatar: `avatar-1.png`
      },
      {
        name: `Пётр`,
        surname: `Петров`,
        email: `petrov@example.com`,
        passwordHash: await passwordUtils.hash(`petrov`),
        avatar: `avatar-2.png`
      },
      {
        name: `Сидор`,
        surname: `Сидоров`,
        email: `sidorov@example.com`,
        passwordHash: await passwordUtils.hash(`sidorov`),
        avatar: `avatar-3.png`
      },
    ];

    const pictures = [
      `forest@1x.jpg`,
      `sea@1x.jpg`,
      `skyscraper@1x.jpg`,
      null,
      null
    ];

    const [count] = args;

    if (count > MAX_COUNT) {
      console.info(MAX_COUNT_ERROR_MESSAGE);
      process.exit(ExitCode.error);
    }

    const countArticles = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const articles = generateArticles(countArticles, titles, announces, categories, comments, users, pictures);

    return initDatabase(sequelize, {categories, articles, users});
  }
};
