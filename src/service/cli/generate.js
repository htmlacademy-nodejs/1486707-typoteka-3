'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {ExitCode} = require(`../../constants`);

const {getRandomInt, arrayShuffle, getRandomDate} = require(`../../utils`);

const DEFAULT_COUNT = 1;
const MAX_COUNT = 1000;
const MAX_COUNT_ERROR_MESSAGE = `Не больше ${MAX_COUNT} публикаций`;
const MAX_TEXT_SENTENCES = 5;
const FILE_NAME = `mocks.json`;

const FILE_ANNOUNCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf-8`);
    return content.trim().split(`\r\n`);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

const generateArticles = (count, titles, announces, categories) => {
  return Array(count).fill({}).map(() => ({
    title: titles[getRandomInt(1, titles.length - 1)],
    announce: announces[getRandomInt(1, announces.length - 1)],
    text: arrayShuffle(announces).slice(1, MAX_TEXT_SENTENCES).join(` `),
    createdDate: getRandomDate(),
    category: arrayShuffle(categories).slice(0, getRandomInt(1, categories.length - 1))
  })
  );
};

module.exports = {
  name: `--generate`,
  async run(args) {
    const announces = await readContent(FILE_ANNOUNCES_PATH);
    const titles = await readContent(FILE_TITLES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);

    const [count] = args;

    if (count > MAX_COUNT) {
      console.info(MAX_COUNT_ERROR_MESSAGE);
      process.exit(ExitCode.error);
    }

    const countArticles = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const content = JSON.stringify(generateArticles(countArticles, titles, announces, categories));

    try {
      await fs.writeFile(FILE_NAME, content);
      console.info(chalk.green(`Operation success. File Created.`));
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
    }
  }
};
