'use strict';

const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH} = require(`../../constants`);

class CommentsService {

  findAll(article) {
    return article.comments;
  }

  findOne(article, id) {
    return article.comments.find((item) => item.id === id);
  }

  create(article, comment) {
    const {comments} = article;
    const newComment = {
      id: nanoid(MAX_ID_LENGTH),
      ...comment
    };

    article.comments = [...comments, newComment];
    return newComment;
  }

  drop(article, id) {
    const {comments} = article;
    const comment = comments.find((item) => item.id === id);

    if (!comment) {
      return null;
    }

    article.comments = comments.filter((item) => item.id !== id);
    return comment;
  }
}

module.exports = CommentsService;
