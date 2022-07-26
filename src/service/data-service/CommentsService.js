'use strict';

class CommentsService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
  }

  async findAll(articleId) {
    return await this._Comment.findAll({
      where: {articleId},
      raw: true
    });
  }

  async findOne(articleId, id) {
    return await this._Comment.findOne({
      where: {
        id,
        articleId
      }
    });
  }

  async create(articleId, comment) {
    const newComment = await this._Comment.create({
      articleId,
      ...comment
    });
    return newComment.get();
  }

  async drop(id) {
    const deletedRows = await this._Comment.destroy({
      where: {id}
    });
    return !!deletedRows;
  }
}

module.exports = CommentsService;
