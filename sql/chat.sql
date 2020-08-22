DROP TABLE IF EXISTS chat;

CREATE TABLE chat (
    id SERIAL PRIMARY KEY,
    text VARCHAR NOT NULL,
    user_id INT NOT NULL REFERENCES users(id),
    receiver_id INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 );
