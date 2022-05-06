'use strict';

class SearchService {
  constructor(articles) {
    this._articles = articles;
  }

  findAll(searchString) {
    const searchStringWords = searchString.split(` `);
    const newArticles = [...this._articles];
    const filteredArticles = newArticles.filter((article) => {
      const substrings = article.title.split(` `);
      return searchStringWords.every((searchWord) => substrings.includes(searchWord));
    });
    return filteredArticles;
  }
}

module.exports = SearchService;
