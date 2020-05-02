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
// module.exports.getHashByEmail = (email) => {
//     return db
//         .query(
//             `SELECT password, id
//             FROM users
//             WHERE email = $1`,
//             [email]
//         )
//         .then((result) => {
//             return result.rows[0];
//         });
// };

// RETURN FIRST NAME OF CURRENT ID
// module.exports.getCurrentFirstNameById = (id) => {
//     return db
//         .query(`SELECT first FROM users WHERE id = $1`, [id])
//         .then((result) => {
//             return result.rows[0];
//         });
// };
