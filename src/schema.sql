CREATE TABLE categories(
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name varchar(30) NOT NULL
);

CREATE TABLE users(
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    email varchar(255) UNIQUE NOT NULL,
    password_hash varchar(255) NOT NULL,
    name varchar(255) NOT NULL,
    surname varchar(255) NOT NULL,
    avatar varchar(50) NOT NULL
);

CREATE TABLE articles(
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title varchar(250) NOT NULL,
    article_text varchar(1000) NOT NULL,
    announce varchar(250) NOT NULL,
    picture varchar(50) NOT NULL,
    created_at timestamp DEFAULT current_timestamp,
    user_id integer NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE comments(
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    text varchar(250) NOT NULL,
    created_at timestamp DEFAULT current_timestamp,
    article_id integer NOT NULL,
    user_id integer NOT NULL,
    FOREIGN KEY (article_id) REFERENCES articles(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE articles_categories(
    article_id integer NOT NULL,
    category_id integer NOT NULL,
    PRIMARY KEY (article_id, category_id),
    FOREIGN KEY (article_id) REFERENCES articles(id),
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE INDEX ON articles(title);

