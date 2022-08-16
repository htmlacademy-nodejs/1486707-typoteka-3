'use strict';

const passwordUtils = require(`../../src/service/lib/password`);

module.exports = [{
  name: `Сидор`,
  surname: `Сидоров`,
  email: `sidorov@example.com`,
  password: `sidorov`,
  passwordRepeated: `sidorov`,
  passwordHash: passwordUtils.hashSync(`sidorov`),
  avatar: `sidorov.jpg`
},
{
  name: `Иван`,
  surname: `Иванов`,
  email: `ivanov@example.com`,
  password: `ivanov`,
  passwordRepeated: `ivanov`,
  passwordHash: passwordUtils.hashSync(`ivanov`),
  avatar: `ivanov.jpg`
},
{
  name: `Петр`,
  surname: `Петров`,
  email: `petrov@example.com`,
  password: `petrov`,
  passwordRepeated: `petrov`,
  passwordHash: passwordUtils.hashSync(`petrov`),
  avatar: `petrov.jpg`
},
];
