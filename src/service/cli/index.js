'use strict';

const help = require(`./help`);
const version = require(`./version`);
const filldb = require(`./filldb`);
const server = require(`./server`);

const Cli = {
  [filldb.name]: filldb,
  [help.name]: help,
  [version.name]: version,
  [server.name]: server,
};

module.exports = {
  Cli
};
