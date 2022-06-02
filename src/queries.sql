-- возвращает список всех категорий
SELECT * FROM categories;

-- возвращает список категорий, в которых есть статьи
SELECT id, name
FROM categories
    JOIN articles_categories
    ON id = category_id
    GROUP BY id;

-- возвращает список категорий с количеством статей
SELECT id, name, count(article_id) FROM categories
    LEFT JOIN articles_categories
    ON id = category_id
    GROUP BY id;

-- возвращает список статей (сначала свежие)
SELECT articles.*,
    COUNT(comments.id) AS comments_count,
    STRING_AGG(DISTINCT categories.name, ',') AS categories_list,
    users.name,
    users.surname,
    users.email
FROM articles
    JOIN articles_categories ON articles.id = articles_categories.article_id
    JOIN categories ON articles_categories.category_id = categories.id
    LEFT JOIN comments ON comments.article_id = articles.id
    JOIN users ON users.id = articles.user_id
    GROUP BY articles.id, users.id
    ORDER BY articles.created_at DESC;

-- возвращает полную информацию определенной публикации
SELECT articles.*,
    COUNT(comments.id) AS comments_count,
    STRING_AGG(DISTINCT categories.name, ',') AS categories_list,
    users.name,
    users.surname,
    users.email
FROM articles
    JOIN articles_categories ON articles.id = articles_categories.article_id
    JOIN categories ON articles_categories.category_id = categories.id
    LEFT JOIN comments ON comments.article_id = articles.id
    JOIN users ON users.id = articles.user_id
WHERE articles.id = 1
    GROUP BY articles.id, users.id;

-- возвращает список из 5 свежих комментариев
SELECT
    comments.id,
    comments.article_id,
    users.name,
    users.surname,
    comments.text
FROM comments
    JOIN users ON comments.user_id = users.id
    ORDER BY comments.created_at DESC
    LIMIT 5;

-- возвращает список комментариев для определенной публикации (сначала новые)
SELECT 
    comments.id,
    comments.article_id,
    users.name,
    users.surname,
    comments.text
FROM comments
    JOIN users ON comments.user_id = users.id
WHERE comments.article_id = 1
    ORDER BY comments.created_at DESC;

-- обновляет заголовок определенной публикации на «Как я встретил Новый год»
UPDATE articles
SET title = 'Как я встретил Новый год'
WHERE id = 1;
