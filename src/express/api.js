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

  getArticles(offset, limit, userId) {
    return this._load(`/articles`, {params: {offset, limit, userId}});
  }

  getArticle(id, comments, userId) {
    return this._load(`/articles/${id}`, {params: {comments, userId}});
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

  createUser(data) {
    return this._load(`/user`, {
      method: HttpMethod.POST,
      data
    });
  }

  auth(email, password) {
    return this._load(`/user/auth`, {
      method: HttpMethod.POST,
      data: {email, password}
    });
  }
}

const defaultAPI = new API(defaultUrl, TIMEOUT);

module.exports = {
  API,
  getAPI: () => defaultAPI
};
