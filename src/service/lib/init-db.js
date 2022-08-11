'use strict';

const defineModels = require(`../models`);
const Aliase = require(`../models/aliase`);

module.exports = async (sequelize, {categories, articles, users}) => {
  const {Category, Article, User} = defineModels(sequelize);
  await sequelize.sync({force: true});

  const categoryModels = await Category.bulkCreate(
      categories.map((item) => ({name: item}))
  );

  const categoryIdByName = categoryModels.reduce((acc, next) => ({
    [next.name]: next.id,
    ...acc
  }), {});

  const userModels = await User.bulkCreate(users, {include: [Aliase.ARTICLES, Aliase.COMMENTS]});

  const userIdByEmail = userModels.reduce((acc, next) => ({
    [next.email]: next.id,
    ...acc
  }), {});

  articles.forEach((article) => {
    article.userId = userIdByEmail[article.user];
    article.comments.forEach((comment) => {
      comment.userId = userIdByEmail[comment.user];
    });
  });

  let articleModelPromises;
  for (const article of articles) {
    const articleModel = await Article.create(article, {include: [Aliase.COMMENTS]});
    const articleCategories = article.categories.map(
        (name) => categoryIdByName[name]
    );
    articleModelPromises = await articleModel.addCategories(articleCategories);
  }
  const resolvedArticlePromises = await Promise.all(articleModelPromises);
  return resolvedArticlePromises;
};
