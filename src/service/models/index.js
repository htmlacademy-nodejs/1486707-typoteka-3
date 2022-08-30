'use strict';

const defineCategory = require(`./category`);
const defineComment = require(`./comment`);
const defineArticle = require(`./article`);
const defineArticlesCategories = require(`./articlesCategories`);
const defineUsers = require(`./users`);

const Aliase = require(`./aliase`);

const define = (sequelize) => {
  const Category = defineCategory(sequelize);
  const Comment = defineComment(sequelize);
  const Article = defineArticle(sequelize);
  const ArticlesCategories = defineArticlesCategories(sequelize);
  const User = defineUsers(sequelize);

  Article.hasMany(Comment, {as: Aliase.COMMENTS, foreignKey: `articleId`, onDelete: `cascade`});
  Comment.belongsTo(Article, {as: Aliase.ARTICLES, foreignKey: `articleId`});

  Article.belongsToMany(Category, {through: ArticlesCategories, as: Aliase.CATEGORIES});
  Category.belongsToMany(Article, {through: ArticlesCategories, as: Aliase.ARTICLES});
  Category.hasMany(ArticlesCategories, {as: Aliase.ARTICLE_CATEGORIES});

  User.hasMany(Article, {as: Aliase.ARTICLES, foreignKey: `userId`});
  Article.belongsTo(User, {as: Aliase.USERS, foreignKey: `userId`});

  User.hasMany(Comment, {as: Aliase.COMMENTS, foreignKey: `userId`});
  Comment.belongsTo(User, {as: Aliase.USERS, foreignKey: `userId`});

  return {Category, Comment, Article, ArticlesCategories, User};
};

module.exports = define;
