'use strict';

const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH} = require(`../../constants`);

class ArticlesService {
  constructor(articles) {
    this._articles = articles;
  }

  create(article) {
    const newArticle = {
      ...article,
      id: nanoid(MAX_ID_LENGTH), comments: []};

    this._articles.push(newArticle);
    return newArticle;
  }

  drop(id) {
    const article = this._articles.find((item) => item.id === id);

    if (!article) {
      return null;
    }

    this._articles = this._articles.filter((item) => item.id !== id);
    return article;
  }

  findAll() {
    return this._articles;
  }

  findOne(id) {
    return this._articles.find((item) => item.id === id);
  }

  update(id, article) {
    const oldArticle = this._articles
      .find((item) => item.id === id);

    return {
      ...oldArticle,
      ...article
    };
  }
}

module.exports = ArticlesService;
