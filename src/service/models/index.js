'use strict';

const {Model} = require(`sequelize`);

const defineCategory = require(`./category`);
const defineComment = require(`./comment`);
const defineArticle = require(`./article`);

const Aliase = require(`./aliase`);

class ArticlesCategory extends Model {}

const define = (sequelize) => {
  const Category = defineCategory(sequelize);
  const Comment = defineComment(sequelize);
  const Article = defineArticle(sequelize);

  ArticlesCategory.init({}, {
    sequelize,
    modelName: `ArticlesCategory`,
    tableName: `articlesCategories`
  });

  Article.hasMany(Comment, {as: Aliase.COMMENTS, foreignKey: `articleId`, onDelete: `cascade`});
  Comment.belongsTo(Article, {foreignKey: `artilceId`});

  Article.belongsToMany(Category, {through: ArticlesCategory, as: Aliase.CATEGORIES});
  Category.belongsToMany(Article, {through: ArticlesCategory, as: Aliase.ARTICLES});
  Category.hasMany(ArticlesCategory, {as: Aliase.ARTICLE_CATEGORIES});

  return {Category, Comment, Article, ArticlesCategory};
};

module.exports = define;
