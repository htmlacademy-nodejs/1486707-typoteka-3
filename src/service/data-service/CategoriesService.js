'use strict';

const Sequelize = require(`sequelize`);
const Aliase = require(`../models/aliase`);

class CategoryService {
  constructor(sequelize) {
    this._Category = sequelize.models.Category;
    this._ArticlesCategories = sequelize.models.ArticlesCategories;
  }

  async findAll() {
    const categories = await this._Category.findAll({
      attributes: [
        `id`,
        `name`,
        [
          Sequelize.fn(
              `COUNT`,
              Sequelize.col(`CategoryId`)
          ),
          `count`
        ]
      ],
      group: [Sequelize.col(`Category.id`)],
      include: [{
        model: this._ArticlesCategories,
        as: Aliase.ARTICLE_CATEGORIES,
        attributes: []
      }],
      raw: true
    });

    return categories;
  }
}

module.exports = CategoryService;
