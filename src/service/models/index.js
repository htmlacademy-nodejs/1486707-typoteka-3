'use strict';

const {Model} = require(`sequelize`);

const defineCategory = require(`./category`);
const defineComment = require(`./comment`);
const defineArticle = require(`./article`);

const Aliase = require(`./aliase`);

class ArticleCategory extends Model {}

const define = (sequelize) => {
  const Category = defineCategory(sequelize);
  const Comment = defineComment(sequelize);
  const Article = defineArticle(sequelize);

  ArticleCategory.init({}, {sequelize});

  Article.hasMany(Comment, {as: Aliase.COMMENTS, foreignKey: `articleId`, onDelete: `cascade`});
  Comment.belongsTo(Article, {foreignKey: `artilceId`});

  Article.belongsToMany(Category, {through: `articleCategories`, as: Aliase.CATEGORIES});
  Category.belongsToMany(Article, {through: `articleCategories`, as: Aliase.ARTICLES});
  Category.hasMany(ArticleCategory, {as: Aliase.ARTICLE_CATEGORIES});

  return {Category, Comment, Article, ArticleCategory};
};

module.exports = define;
