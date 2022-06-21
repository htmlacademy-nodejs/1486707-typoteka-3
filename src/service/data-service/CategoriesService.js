'use strict';

class CategoryService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Category = sequelize.models.Category;
    this._ArticleCategory = sequelize.models._ArticleCategory;
  }

  async findAll() {
    return await this._Category.findAll({raw: true});
  }
}

module.exports = CategoryService;
