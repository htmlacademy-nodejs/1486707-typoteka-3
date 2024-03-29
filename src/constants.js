'use strict';

module.exports.DEFAULT_COMMAND = `--help`;

module.exports.USER_ARGV_INDEX = 2;

module.exports.ExitCode = {
  error: 1,
  success: 0,
};

module.exports.HttpCode = {
  OK: 200,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  UNAUTHORIZED: 401,
  CREATED: 201,
  BAD_REQUEST: 400
};

module.exports.MAX_ID_LENGTH = 6;

module.exports.API_PREFIX = `/api`;

module.exports.HttpMethod = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

module.exports.Env = {
  DEVELOPMENT: `development`,
  PRODUCTION: `production`
};
