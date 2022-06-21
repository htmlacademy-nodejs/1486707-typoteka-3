'use strict';

const Aliase = require(`../models/aliase`);

class ArticlesService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
    this._Category = sequelize.models.Category;
  }

  async create(articleData) {
    const article = await this._Article.create(articleData);
    await article.addCategories(articleData.categories);
    return article.get();
  }

  async drop(id) {
    const deletedRows = await this._Article.destroy({
      where: {id}
    });
    return !!deletedRows;
  }

  async findAll() {
    const include = [Aliase.CATEGORIES];

    const articles = await this._Article.findAll({
      include,
      order: [
        `createdAt`, `DESC`
      ]
    });

    return articles.map((item) => item.get());
  }

  async findOne(id) {
    return await this._Article.findByPk(
        id,
        {
          include: [Aliase.CATEGORIES]
        }
    );
  }

  async update(id, article) {
    const [affectedRows] = await this._Article.update(
        article,
        {
          where: {id}
        }
    );
    return !!affectedRows;
  }
}

module.exports = ArticlesService;
