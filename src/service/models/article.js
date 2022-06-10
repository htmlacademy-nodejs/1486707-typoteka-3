'use strict';

const {DataTypes, Model} = require(`sequelize`);

class Article extends Model {}

const define = (sequelize) => Article.init({
  title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  articleText: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  picture: DataTypes.TEXT,
  announce: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  sequelize,
  modelName: `Offer`,
  tableName: `offers`
});

module.exports = define;
