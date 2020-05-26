DROP TABLE IF EXISTS chat;

CREATE TABLE chat (
    id SERIAL PRIMARY KEY,
    text VARCHAR NOT NULL,
    user_id INT NOT NULL REFERENCES users(id),
    receiver_id INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 );

INSERT INTO chat (text, user_id, receiver_id) VALUES ('What a wonderful idea!', '200', '1'),('Not gonna get me!', '1', '2'),('I am tired, going to bed now', '2', '200'),('Hello there!', '2', '1'),('let me outta here', '200', '2'),('You look beautiful', '1', '200'),('Fixing to eat', '2', '1'),('Getting dressed for tonight', '3', '1')