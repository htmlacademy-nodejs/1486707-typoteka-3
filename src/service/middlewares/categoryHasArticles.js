'use strict';

const {HttpCode} = require(`../../constants`);

const CATEGORY_HAS_ARTICLES_MESSAGE = `Невозможно удалить. Для этой категории существуют записи.`;

module.exports = (service) => async (req, res, next) => {
  const {categoryId} = req.params;
  const {count} = await service.findPage(categoryId);

  if (count) {
    return res.status(HttpCode.BAD_REQUEST).send(CATEGORY_HAS_ARTICLES_MESSAGE);
  }

  return next();
};

