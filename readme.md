# Личный проект «Типотека» [![Build status][travis-image]][travis-url]

* Студент: [Владислав Несвит](https://up.htmlacademy.ru/nodejs/3/user/1486707).
* Наставник: [Алексей Марунин](https://htmlacademy.ru/profile/id1402867).

---

### Руководство по использованию

Для работы приложения необходимы:
  - установленный postgres;
  - установленный node.js версии не менее 16.14.2.

Инициализация проекта выполняется следующим образом:
  1. Скопировать проект к себе на локальную машину.
  2. В корне проекта запустить команду npm install .
  3. Создать и заполнить базу данных. Например, заполнить её моковыми данными с помощью команды npm run start-back-server -- --filldb .
  4. Создать в корне проект файл .env и заполнить его согласно руководству, приведенному в файле /environments.md .
  5. Запустить команду npm run start-servers
  6. Сервер бэкенда, по умолчанию, находится на http://localhost:3000/ , сервер фронтенда на http://localhost:8080/ .
  7. Согласно Т.З., автором блога считается первый пользователь. Если при создании БД использовались моковые данные, то для такого пользователя логин - ivanov@example.com , пароль - ivanov.
  

---

### Описание API


Командная строка приложения принимает следующие команды:

   npm run start-servers - запускает серверы приложения для фронтенда и бэкенда;

   npm run start-back-server - предоставляет доступ к дополнительным функциям сервиса (устанавливает глобальную переменную LOG_LEVEL=error), возможные аргументы:

      --version:            выводит номер версии

      --help:               печатает этот текст

      --filldb <count>:     заполняет базу данных

      --server:             запускает сервер

   npm run start-back-server::debug - аналог команды npm run start-back-server с установленными глобальными переменными LOG_LEVEL=info NODE_ENV=development. Возможные аргументы те же.

   npm run start-front-server - запускает сервер для фронтенда;

   npm run test - запускает автотесты;

---

<a href="https://htmlacademy.ru/intensive/ecmascript"><img align="left" width="50" height="50" title="HTML Academy" src="https://up.htmlacademy.ru/static/img/intensive/ecmascript/logo-for-github.svg"></a>

Репозиторий создан для обучения на интенсивном онлайн‑курсе «[Node.js, уровень 1](https://htmlacademy.ru/intensive/nodejs)» от [HTML Academy](https://htmlacademy.ru).

[travis-image]: https://travis-ci.com/htmlacademy-nodejs/1486707-typoteka-3.svg?branch=master
[travis-url]: https://travis-ci.com/htmlacademy-nodejs/1486707-typoteka-3
