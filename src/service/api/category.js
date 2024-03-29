'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const categoryExists = require(`../middlewares/categoryExists`);
const categoryValidator = require(`../middlewares/categoryValidator`);
const categoryHasArticles = require(`../middlewares/categoryHasArticles`);

const route = new Router();


module.exports = (app, service) => {
  app.use(`/categories`, route);

  route.get(`/`, async (req, res) => {
    const categories = await service.findAll({withCount: false});
    res.status(HttpCode.OK)
        .json(categories);
  });

  route.get(`/:categoryId`, async (req, res) => {
    const {categoryId} = req.params;
    const {limit, offset} = req.query;

    const category = await service.findOne(categoryId);

    const {count, articlesByCategory} = await service.findPage(categoryId, limit, offset);

    res.status(HttpCode.OK)
      .json({
        category,
        count,
        articlesByCategory
      });
  });

  route.post(`/`, categoryValidator, async (req, res) => {
    const newCategory = req.body;

    const category = await service.create(newCategory);
    return res.status(HttpCode.OK).json(category);
  });

  route.put(`/:categoryId`, [categoryExists(service), categoryValidator], async (req, res) => {
    const {categoryId} = req.params;
    const newCategory = req.body;

    const updatedCategory = await service.update(categoryId, newCategory);
    return res.status(HttpCode.OK).json(updatedCategory);
  });

  route.delete(`/:categoryId`, [categoryExists(service), categoryHasArticles(service)], async (req, res) => {
    const {categoryId} = req.params;

    const deletedCategory = await service.drop(categoryId);
    return res.status(HttpCode.OK).json(deletedCategory);
  });
};
