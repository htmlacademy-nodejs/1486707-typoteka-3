CREATE TABLE categories(
    id SERIAL PRIMARY KEY,
    name text NOT NULL
);

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    email text UNIQUE NOT NULL,
    password_hash text NOT NULL,
    name text NOT NULL,
    surname text NOT NULL,
    avatar text NOT NULL
);

CREATE TABLE articles(
    id SERIAL PRIMARY KEY,
    title text NOT NULL,
    article_text text NOT NULL,
    announce text NOT NULL,
    picture text NOT NULL,
    created_at timestamp DEFAULT current_timestamp,
    user_id integer NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE comments(
    id SERIAL PRIMARY KEY,
    text text NOT NULL,
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

