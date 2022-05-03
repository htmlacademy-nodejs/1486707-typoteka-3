'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {nanoid} = require(`nanoid`);
const {ExitCode, MAX_ID_LENGTH} = require(`../../constants`);

const {getRandomInt, arrayShuffle, getRandomDate} = require(`../../utils`);

const DEFAULT_COUNT = 1;
const MAX_COUNT = 1000;
const MAX_COUNT_ERROR_MESSAGE = `Не больше ${MAX_COUNT} публикаций`;
const MAX_TEXT_SENTENCES = 5;
const FILE_NAME = `mocks.json`;
const MAX_COMMENTS = 4;

const FILE_ANNOUNCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf-8`);
    return content.trim().split(`\n`);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

const generateComments = (count, commentsData) => (
  Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    text: arrayShuffle(commentsData)
      .slice(0, getRandomInt(1, 3))
      .join(` `),
  }))
);
const generateArticles = (count, titles, announces, categories, comments) => {
  return Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    title: titles[getRandomInt(1, titles.length - 1)],
    announce: announces[getRandomInt(1, announces.length - 1)],
    text: arrayShuffle(announces).slice(1, MAX_TEXT_SENTENCES).join(` `),
    createdDate: getRandomDate(),
    category: arrayShuffle(categories).slice(0, getRandomInt(1, categories.length - 1)),
    comments: generateComments(getRandomInt(1, MAX_COMMENTS), comments)
  })
  );
};

module.exports = {
  name: `--generate`,
  async run(args) {
    const announces = await readContent(FILE_ANNOUNCES_PATH);
    const titles = await readContent(FILE_TITLES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const comments = await readContent(FILE_COMMENTS_PATH);

    const [count] = args;

    if (count > MAX_COUNT) {
      console.info(MAX_COUNT_ERROR_MESSAGE);
      process.exit(ExitCode.error);
    }

    const countArticles = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const content = JSON.stringify(generateArticles(countArticles, titles, announces, categories, comments));

    try {
      await fs.writeFile(FILE_NAME, content);
      console.info(chalk.green(`Operation success. File Created.`));
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
    }
  }
};
