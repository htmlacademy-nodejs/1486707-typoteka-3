'use strict';

const Aliase = require(`../models/aliase`);

class ArticlesService {
  constructor(sequelize) {
    this._sequelize = sequelize;
    this._Article = sequelize.models.Article;
    this._Comment = sequelize.models.Comment;
    this._User = sequelize.models.User;
    this._Category = sequelize.models.Category;
  }

  async create(articleData) {
    const article = await this._Article.create(articleData);
    await article.addCategories(articleData.categories);
    return article.get();
  }

  async drop(id) {
    const deletedRows = await this._Article.destroy({
      where: {id}
    });
    return !!deletedRows;
  }

  async findAll({withComments}) {
    const include = [
      Aliase.CATEGORIES,
      {
        model: this._User,
        as: Aliase.USERS,
        attributes: {
          exclude: [`passwordHash`]
        }
      }
    ];

    if (withComments) {
      include.push({
        model: this._Comment,
        as: Aliase.COMMENTS,
        include: [
          {
            model: this._User,
            as: Aliase.USERS,
            attributes: {
              exclude: [`passwordHash`]
            }
          }
        ]
      });
    }

    const articles = await this._Article.findAll({
      include,
      order: [
        [`createdAt`, `DESC`]
      ]
    });

    return articles.map((item) => item.get());
  }

  async findOne({id, withComments}) {
    const include = [
      Aliase.CATEGORIES,
      {
        model: this._User,
        as: Aliase.USERS,
        attributes: {
          exclude: [`passwordHash`]
        }
      }
    ];

    if (withComments) {
      include.push({
        model: this._Comment,
        as: Aliase.COMMENTS,
        include: [
          {
            model: this._User,
            as: Aliase.USERS,
            attributes: {
              exclude: [`passwordHash`]
            }
          }
        ]
      });
    }

    return await this._Article.findByPk(
        id,
        {
          include
        }
    );
  }

  async update(id, article) {
    const [affectedRows] = await this._Article.update(
        article,
        {
          where: {id}
        }
    );
    return !!affectedRows;
  }

  async findPage({limit, offset}) {
    const include = [{
      model: this._Comment,
      as: Aliase.COMMENTS,
      include: [
        {
          model: this._User,
          as: Aliase.USERS,
          attributes: {
            exclude: [`passwordHash`]
          }
        }
      ]},
    Aliase.CATEGORIES,
    {
      model: this._User,
      as: Aliase.USERS,
      attributes: {
        exclude: [`passwordHash`]
      }
    }
    ];

    const {count, rows} = await this._Article.findAndCountAll({
      limit,
      offset,
      include,
      order: [
        [`createdAt`, `DESC`]
      ],
      distinct: true
    });
    return {count, articlesData: rows};
  }

  async findLimit({limit, withComments}) {
    if (!withComments) {
      const options = {
        limit,
        include: [
          Aliase.CATEGORIES
        ],
        order: [
          [`createdAt`, `DESC`]
        ]
      };

      return await this._Article.findAll(options);
    }

    const options = {
      subQuery: false,
      attributes: {
        include: [
          [this._sequelize.fn(`COUNT`, this._sequelize.col(`comments.id`)), `commentsCount`]
        ]
      },
      include: [
        {
          model: this._Comment,
          as: Aliase.COMMENTS,
          attributes: [],
        },
        {
          model: this._Category,
          as: Aliase.CATEGORIES,
          attributes: [`id`, `name`]
        }
      ],
      group: [
        `Article.id`,
        `categories.id`,
        `categories->ArticlesCategories.ArticleId`,
        `categories->ArticlesCategories.CategoryId`
      ],
      order: [
        [this._sequelize.fn(`COUNT`, this._sequelize.col(`comments.id`)), `DESC`]
      ]
    };

    let articles = await this._Article.findAll(options);

    articles = articles
        .map((article) => article.get())
        .filter((article) => article.commentsCount > 0);

    return articles.slice(0, limit);
  }
}

module.exports = ArticlesService;
