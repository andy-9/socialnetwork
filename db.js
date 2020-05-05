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

////////////////////////// APP //////////////////////////
module.exports.getUserInfo = (id) => {
    return db
        .query(
            `SELECT first, last, imgUrl
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

module.exports.addUserPic = (id, imgUrl) => {
    return db.query(
        `UPDATE imgUrl 
        SET imgUrl = $2 
        WHERE id = $1;`,
        [id, imgUrl]
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
    return db.query(
        `UPDATE users
        SET password = $2
        WHERE email = $1;`,
        [email, password]
    );
};
