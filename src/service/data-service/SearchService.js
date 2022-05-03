'use strict';

class SearchService {
  constructor(articles) {
    this._articles = articles;
  }

  findAll(searchString) {
    const newArticles = [...this._articles];
    const filteredArticles = newArticles.filter((article) => {
      const substrings = article.title.split(` `);
      return substrings.includes(searchString);
    });
    return filteredArticles;
  }
}

module.exports = SearchService;
