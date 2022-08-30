'use strict';

const Aliase = require(`../models/aliase`);

class CommentsService {
  constructor(sequelize) {
    this._Comment = sequelize.models.Comment;
    this._User = sequelize.models.User;
    this._Article = sequelize.models.Article;
  }

  async findAll(articleId) {
    return await this._Comment.findAll({
      include: [
        {
          model: this._User,
          as: Aliase.USERS,
          attributes: {
            exclude: [`passwordHash`]
          }
        }
      ],
      order: [
        [`createdAt`, `DESC`]
      ],
      where: {articleId},
      raw: false
    });
  }

  async findOne(articleId, id) {
    return await this._Comment.findOne({
      include: [
        {
          model: this._User,
          as: Aliase.USERS,
          attributes: {
            exclude: [`passwordHash`]
          }
        }
      ],
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

  async findLimit({limit}) {
    const options = {
      limit,
      include: [
        {
          model: this._User,
          as: Aliase.USERS,
          attributes: {
            exclude: [`passwordHash`]
          }
        },
        {
          model: this._Article,
          as: Aliase.ARTICLES,
        }
      ],
      order: [
        [`createdAt`, `DESC`]
      ]
    };

    return await this._Comment.findAll(options);
  }
}

module.exports = CommentsService;
