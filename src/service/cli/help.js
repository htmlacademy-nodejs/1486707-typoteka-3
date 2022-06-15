'use strict';

const chalk = require(`chalk`);

const HELP_MESSAGE = `Программа запускает http-сервер и формирует файл с данными для API.

Гайд:
service.js <command>
Команды:
--version:            выводит номер версии
--help:               печатает этот текст
--filldb <count>      заполняет базу данных`;

module.exports = {
  name: `--help`,
  run() {
    console.info(chalk.gray(HELP_MESSAGE));
  }
};
