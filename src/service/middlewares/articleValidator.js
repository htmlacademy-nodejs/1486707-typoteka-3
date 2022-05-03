'use strict';

const {HttpCode} = require(`../../constants`);

const articleKeys = [`title`, `announce`, `text`, `category`, `comments`];

module.exports = (req, res, next) => {
  const newArticle = req.body;
  const keys = Object.keys(newArticle);
  const keysExist = articleKeys.every((key) => keys.includes(key));

  if (!keysExist) {
    res.status(HttpCode.BAD_REQUEST).send(`Bad request`);
  }

  next();
};
