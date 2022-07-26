'use strict';

const defineCategory = require(`./category`);
const defineComment = require(`./comment`);
const defineArticle = require(`./article`);
const defineArticlesCategories = require(`./articlesCategories`);

const Aliase = require(`./aliase`);

const define = (sequelize) => {
  const Category = defineCategory(sequelize);
  const Comment = defineComment(sequelize);
  const Article = defineArticle(sequelize);
  const ArticlesCategories = defineArticlesCategories(sequelize);

  Article.hasMany(Comment, {as: Aliase.COMMENTS, foreignKey: `articleId`, onDelete: `cascade`});
  Comment.belongsTo(Article, {foreignKey: `artilceId`});

  Article.belongsToMany(Category, {through: ArticlesCategories, as: Aliase.CATEGORIES});
  Category.belongsToMany(Article, {through: ArticlesCategories, as: Aliase.ARTICLES});
  Category.hasMany(ArticlesCategories, {as: Aliase.ARTICLE_CATEGORIES});

  return {Category, Comment, Article, ArticlesCategories};
};

module.exports = define;
