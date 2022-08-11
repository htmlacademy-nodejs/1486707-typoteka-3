'use strict';

const axios = require(`axios`);
const {HttpMethod} = require(`../constants`);

const TIMEOUT = 1000;
const port = process.env.API_PORT || 3000;
const defaultUrl = `http://localhost:${port}/api/`;

class API {
  constructor(baseURL, timeout) {
    this._http = axios.create({
      baseURL,
      timeout
    });
  }

  async _load(url, options) {
    const response = await this._http.request({url, ...options});
    return response.data;
  }

  getArticles(offset, limit) {
    return this._load(`/articles`, {params: {offset, limit}});
  }

  getArticle(id, comments) {
    return this._load(`/articles/${id}`, {params: {comments}});
  }

  async getAllComments() {
    const articles = await this._load(`/articles`);

    const commentsData = articles.reduce((comments, article) => {
      return [...comments, ...article.comments];
    }, []);
    return commentsData;
  }

  getComments(id) {
    return this._load(`/articles/${id}/comments`);
  }

  getCategories() {
    return this._load(`/categories`);
  }

  search(query) {
    return this._load(`/search`, {params: {query}});
  }

  createArticle(data) {
    return this._load(`/articles`, {
      method: HttpMethod.POST,
      data
    });
  }

  editArticle(id, data) {
    return this._load(`/articles/${id}`, {
      method: HttpMethod.PUT,
      data
    });
  }

  createComment(id, data) {
    return this._load(`/articles/${id}/comments`, {
      method: HttpMethod.POST,
      data
    });
  }

  async createUser(data) {
    return this._load(`/main/register`, {
      method: HttpMethod.POST,
      data
    });
  }
}

const defaultAPI = new API(defaultUrl, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI
};
