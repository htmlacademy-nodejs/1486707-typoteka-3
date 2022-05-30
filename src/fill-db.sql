-- заполняет таблицу пользователей тремя рандомными сущностями
INSERT INTO users(email, password_hash, name, surname, avatar) VALUES
('ivanovtest@example.com', '5f4dcc3b5aa765d61d8327deb882cf99', 'ivan', 'ivanov', 'avatar-1.png'),
('petrovtest@example.com', '7c6a180b36896a0a8c02787eeafb0e4c', 'petr', 'petrov', 'avatar-2.png'),
('sidorov@example.com', '6cb75f652a9b52798eb6cf2201057c73', 'sidr', 'sidorov', 'avatar-3.png');

-- заполняет таблицу категорий данными из существующего списка
INSERT INTO categories(name) VALUES
('Деревья'),
('За жизнь'),
('Без рамки'),
('Разное'),
('IT'),
('Музыка'),
('Кино'),
('Программирование'),
('Железо');

-- заполняет таблицу статей случайными данными
ALTER TABLE articles DISABLE TRIGGER ALL;
INSERT INTO articles(title, article_text, announce, picture, user_id) VALUES
('Ёлки. История деревьев', 'Ёлки — это не просто красивое дерево. Это прочная древесина. Первая большая ёлка была установлена только в 1938 году. Вы можете достичь всего. Стоит только немного постараться и запастись книгами.', 'Ёлки — это не просто красивое дерево. Это прочная древесина.', 'forest@1x.jpg', 1),
('Как перестать беспокоиться и начать жить', 'Золотое сечение — соотношение двух величин, гармоническая пропорция.', 'Золотое сечение — соотношение двух величин, гармоническая пропорция. Вы можете достичь всего. Стоит только немного постараться и запастись книгами.', 'sea-fullsize@1x.jpg', 2),
('Лучшие рок-музыканты 20-века', 'Это один из лучших рок-музыкантов.', 'Это один из лучших рок-музыкантов. Он написал больше 30 хитов. Из под его пера вышло 8 платиновых альбомов.', 'skyscraper@1x.jpg', 3);
ALTER TABLE articles ENABLE TRIGGER ALL;

-- заполняет таблицу связей категорий и статей
ALTER TABLE articles_categories DISABLE TRIGGER ALL;
INSERT INTO articles_categories(article_id, category_id) VALUES
(1, 1),
(1, 2),
(2, 2),
(2, 4),
(2, 3),
(3, 6);
ALTER TABLE articles_categories ENABLE TRIGGER ALL;

-- заполняет таблицу комментариев
ALTER TABLE comments DISABLE TRIGGER ALL;
INSERT INTO comments(text, article_id, user_id) VALUES
('Это где ж такие красоты?', 1, 2),
('Совсем немного...', 3, 1),
('Согласен с автором!', 1, 3),
('Мне кажется или я уже читал это где-то?', 2, 1),
('Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.', 2, 3),
('Хочу такую же футболку :-)', 3, 2),
('Плюсую, но слишком много буквы!', 1, 1);
ALTER TABLE comments ENABLE TRIGGER ALL;
