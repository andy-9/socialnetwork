DROP TABLE IF EXISTS chat;

CREATE TABLE chat (
    id SERIAL PRIMARY KEY,
    text VARCHAR NOT NULL,
    user_id INT NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 );

INSERT INTO chat (text, user_id) VALUES ('What a wonderful idea!', '201'),('Not gonna get me!', '1'),('I am tired, going to bed now', '2'),('Hello there!', '3'),('let me outta here', '201'),('You look beautiful', '1'),('Fixing to eat', '2'),('Getting dressed for tonight', '3')