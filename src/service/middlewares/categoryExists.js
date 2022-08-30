'use strict';

const {HttpCode} = require(`../../constants`);

module.exports = (service) => async (req, res, next) => {
  const {categoryId} = req.params;
  const category = await service.findOne(categoryId);

  if (!category) {
    return res.status(HttpCode.NOT_FOUND).send(`Comment with the ${categoryId} id not found`);
  }

  res.locals.category = category;
  return next();
};

