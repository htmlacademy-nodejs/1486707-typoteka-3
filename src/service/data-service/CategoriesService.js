'use strict';

const Sequelize = require(`sequelize`);
const Aliase = require(`../models/aliase`);

class CategoryService {
  constructor(sequelize) {
    this._Category = sequelize.models.Category;
    this._ArticlesCategories = sequelize.models.ArticlesCategories;
  }

  async findAll() {
    return await this._Category.findAll({
      group: [Sequelize.col(`Category.id`)],
      include: [{
        model: this._ArticlesCategories,
        as: Aliase.ARTICLE_CATEGORIES,
        attributes: []
      }],
      raw: true
    });
  }
}

module.exports = CategoryService;
