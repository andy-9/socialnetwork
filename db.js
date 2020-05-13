const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/socialnetwork"
);

////////////////////////// REGISTER //////////////////////////
// INSERT FIRST AND LAST NAME, EMAIL AND PASSWORD INTO DATABASE "USERS"
module.exports.registerUser = (first, last, email, password) => {
    return db
        .query(
            `
    INSERT INTO users (first, last, email, password)
    VALUES ($1, $2, $3, $4)
    RETURNING id;`,
            [first, last, email, password]
        )
        .then((result) => {
            console.log("db.js, result of registerUser", result.rows[0].id);
            return result.rows[0].id;
        })
        .catch((err) => {
            console.log("CATCH in db.js in registerUser:", err);
        });
};

////////////////////////// LOGIN //////////////////////////
// RETURN HASH OF USERS FOR COMPARISON
module.exports.getHashByEmail = (email) => {
    return db
        .query(
            `SELECT password, id
            FROM users
            WHERE email = $1`,
            [email]
        )
        .then((result) => {
            return result.rows[0];
        })
        .catch((err) => {
            console.log("CATCH in db.js in getHashByEmail:", err);
        });
};

////////////////////////// APP / GET USER-INFO //////////////////////////
module.exports.getUserInfo = (id) => {
    return db
        .query(
            `SELECT *
            FROM users
            WHERE id = $1`,
            [id]
        )
        .then((result) => {
            return result.rows[0];
        })
        .catch((err) => {
            console.log("CATCH in db.js in getUserInfo:", err);
        });
};

////////////////////////// PROFILE-PIC //////////////////////////
module.exports.addUserPic = (id, img_url) => {
    return db.query(
        `UPDATE users 
        SET img_url = $2 
        WHERE id = $1
        RETURNING img_url;`,
        [id, img_url]
    );
};

////////////////////////// BIO //////////////////////////
module.exports.addUserBio = (id, bio) => {
    return db.query(
        `UPDATE users 
        SET bio = $2 
        WHERE id = $1
        RETURNING bio;`,
        [id, bio]
    );
};

////////////////////////// RESET //////////////////////////
module.exports.addSecretCode = (email, code) => {
    return db
        .query(
            `
    INSERT INTO reset_codes (email, code)
    VALUES ($1, $2)
    RETURNING email;`,
            [email, code]
        )
        .then((result) => {
            console.log("db.js, result of addSecretCode", result.rows[0]);
            return result.rows[0];
        })
        .catch((err) => {
            console.log("CATCH in db.js in addSecretCode:", err);
        });
};

// GET SECRET CODE IN DB AND COMPARE WITH SECRET CODE FROM EMAIL
module.exports.getSecretCode = (email) => {
    return db
        .query(
            `SELECT * FROM reset_codes
            WHERE CURRENT_TIMESTAMP - timestamp < INTERVAL '10 minutes'
            AND email = $1
            ORDER BY id DESC
            LIMIT 1;`,
            [email]
        )
        .then((result) => {
            console.log("db.js, getSecretCode, result:", result.rows[0].code);
            return result.rows[0].code;
        })
        .catch((err) => {
            console.log("CATCH in db.js in getSecretCode:", err);
        });
};

module.exports.updatePassword = (email, password) => {
    return db
        .query(
            `UPDATE users
            SET password = $2
            WHERE email = $1;`,
            [email, password]
        )
        .catch((err) => {
            console.log("CATCH in db.js in updatePassword:", err);
        });
};

////////////////////////// FIND PEOPLE //////////////////////////

module.exports.getRecentUsers = (id) => {
    return db
        .query(
            `
            SELECT *
            FROM users
            WHERE id != $1
            ORDER BY id
            DESC LIMIT 3`,
            [id]
        )
        .then((result) => {
            // console.log("db.js, getRecentUsers, result:", result.rows);
            return result.rows;
        })
        .catch((err) => {
            console.log("CATCH in db.js in getRecentUsers:", err);
        });
};

module.exports.getMatchingUsersFirst = (val) => {
    return db
        .query(
            `SELECT *
            FROM users
            WHERE first
            ILIKE $1
            ORDER BY first;`,
            [val + "%"]
        )
        .then((result) => {
            // console.log(
            //     "db.js, getMatchingUsersFirst, result.rows:",
            //     result.rows
            // );
            return result.rows;
        })
        .catch((err) => {
            console.log("CATCH in db.js in getMatchingUsersFirst:", err);
        });
};

module.exports.getMatchingUsersLast = (val) => {
    return db
        .query(
            `SELECT *
            FROM users
            WHERE (last ILIKE $1
            AND last ILIKE $1 <> first ILIKE $1)
            ORDER BY last`,
            [val + "%"]
        )
        .then((result) => {
            // console.log(
            //     "db.js, getMatchingUsersLast, result.rows:",
            //     result.rows
            // );
            return result.rows;
        })
        .catch((err) => {
            console.log("CATCH in db.js in getMatchingUsersLast:", err);
        });
};

////////////////////////// FRIENDSHIP  //////////////////////////

module.exports.areUsersFriends = (receiver_id, sender_id) => {
    return db
        .query(
            `SELECT * FROM friendships
            WHERE (receiver_id = $1 AND sender_id = $2)
            OR (receiver_id = $2 AND sender_id = $1)`,
            [sender_id, receiver_id]
        )
        .then((result) => {
            // console.log("db.js, areUsersFriends, result.rows:", result.rows);
            return result.rows;
        })
        .catch((err) => {
            console.log("CATCH in db.js in areUsersFriends:", err);
        });
};

module.exports.friendshipRequest = (sender_id, receiver_id) => {
    return db
        .query(
            `INSERT INTO friendships (sender_id, receiver_id)
            VALUES ($1, $2)
            RETURNING *`,
            [sender_id, receiver_id]
        )
        .then((result) => {
            // console.log("db.js, areUsersFriends, result.rows:", result.rows);
            return result.rows;
        })
        .catch((err) => {
            console.log("CATCH in db.js in areUsersFriends:", err);
        });
};

module.exports.acceptFriendship = (receiver_id, sender_id) => {
    return db
        .query(
            `UPDATE friendships
            SET accepted = TRUE
            WHERE (receiver_id = $1 AND sender_id = $2)
            OR (receiver_id = $2 AND sender_id = $1)
            RETURNING *;`,
            [receiver_id, sender_id]
        )
        .then((result) => {
            // console.log(
            //     "db.js, acceptFriendship, result.rows[0]:",
            //     result.rows[0]
            // );
            return result.rows[0];
        })
        .catch((err) => {
            console.log("CATCH in db.js in acceptFriendship:", err);
        });
};

module.exports.deleteFriendship = (receiver_id, sender_id) => {
    return db
        .query(
            `DELETE FROM friendships
            WHERE (receiver_id = $1 AND sender_id = $2)
            OR (receiver_id = $2 AND sender_id = $1);`,
            [receiver_id, sender_id]
        )
        .then((result) => {
            // console.log("db.js, deleteFriendship, result.rows:", result.rows);
            return result.rows;
        })
        .catch((err) => {
            console.log("CATCH in db.js in deleteFriendship:", err);
        });
};
