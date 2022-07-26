'use strict';

const {Model} = require(`sequelize`);

class ArticlesCategories extends Model {}

const define = (sequelize) => ArticlesCategories.init(
    {}, {
      sequelize,
      modelName: `ArticlesCategories`,
      tableName: `articlesCategories`
    }
);

module.exports = define;
