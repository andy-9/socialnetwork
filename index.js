const express = require("express");
const app = express();
const compression = require("compression");
const cookieSession = require("cookie-session");
const csurf = require("csurf");
const db = require("./db");
const { addEntry } = require("./db.js"); // necessary?
const { hash, compare } = require("./bc");
const cryptoRandomString = require("crypto-random-string");
const ses = require("./ses");

// const helmet = require("helmet");

//////////////////////// MIDDLEWARE ////////////////////////
app.use(compression());
// app.use(helmet());
app.use(express.json());
app.use(express.static("./public"));

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/",
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

app.use(
    cookieSession({
        secret: `Mein Kite ist wichtiger als D.`,
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);

app.use(csurf());

app.use(function (req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

//////////////////////// WELCOME ////////////////////////

app.get("/welcome", (req, res) => {
    console.log("index.js, get /welcome");
    if (req.session.userId) {
        res.redirect("/");
        console.log("index.js get /welcome, has cookie, redirect to /");
    } else {
        res.sendFile(__dirname + "/index.html");
        console.log(
            "index.js get /welcome, no cookie, sendFile to /index.html"
        );
    }
});

//////////////////////// REGISTER ////////////////////////

app.post("/register", (req, res) => {
    console.log("index.js, post /register");
    let { first, last, email, password } = req.body;
    console.log(
        "index.js post /register, all inserted data:",
        first,
        last,
        email,
        password
    );

    if (first && last && email && password) {
        hash(password)
            .then((hashedPw) => {
                console.log("password hashed in /register:", hashedPw);
                return db.registerUser(first, last, email, hashedPw);
            })
            .then((resultId) => {
                // console.log("resultId:", resultId);
                req.session.userId = resultId;
                // console.log("index.js, req.session:", req.session);
                res.json({ success: true });
                console.log(
                    "registration successful, 4 input fields added to database, cookie 'userId' set, redirect to /"
                );
            })
            .catch((err) => {
                console.log("CATCH in index.js in post /register:", err);
                res.json({ success: false, error: true });
            });
    } else {
        res.json({ success: false, error: true });
        console.log("4 input fields on /register not complete");
    }
});

//////////////////////// LOGIN ////////////////////////

app.post("/login", (req, res) => {
    console.log("index.js, post /login");
    let { email, password } = req.body;
    console.log("index.js post /register, all inserted data:", email, password);

    if (email && password) {
        db.getHashByEmail(email)
            .then((result) => {
                console.log(
                    "result getHashByEmail in index.js in post /login:",
                    result
                ); // logs password & id in object
                id = result.id;
                return result.password;
            })
            .then((hashedPw) => {
                return compare(password, hashedPw);
            })
            .then((matchValue) => {
                console.log("match value of compare:", matchValue); // true or false
                if (matchValue) {
                    req.session.userId = id;
                    res.json({ success: true });
                    console.log(
                        "login successful, redirect to /, cookie 'userId' set",
                        req.session
                    );
                } else {
                    res.json({ success: false, falsePassword: true });
                    console.log(
                        "index.js, 2 input fields on /login do not match"
                    );
                }
            })
            .catch((err) => {
                console.log("CATCH in index.js in post /login:", err);
                res.json({ success: false, error: true });
            });
    } else {
        res.json({ success: false, error: true });
        console.log(
            "2 input fields on /login not complete or falsy, rerender /login with error message"
        );
    }
});

//////////////////////// RESET ////////////////////////

app.post("/password/reset/start", (req, res) => {
    console.log("index.js, post /password/reset/start");
    let secretCode; // const possible?
    let { email } = req.body;
    console.log("index.js post /reset/start, inserted data:", email);

    if (email) {
        db.getHashByEmail(email)
            .then((result) => {
                console.log(
                    "result getHashByEmail in index.js post reset/start:",
                    result
                );

                if (result) {
                    secretCode = cryptoRandomString({
                        length: 6,
                    });
                    console.log(
                        "index.js getHashByEmail /reset/start, secretCode:",
                        secretCode
                    );

                    db.addSecretCode(email, secretCode)
                        .then(() => {
                            ses.sendEmail(
                                email, // maybe result.email
                                "Your reset code",
                                `Your reset code is ${secretCode}. It is valid for 10 minutes.`
                            );
                        })
                        .then(() => {
                            res.json({ success: true });
                            console.log(
                                "index.js /reset/start addSecretCode, email-address exists in database, now step 2"
                            );
                        })
                        .catch((err) => {
                            console.log(
                                "CATCH in index.js /reset/start addSecretCode:",
                                err
                            );
                            res.json({ success: false, error: true });
                        });
                } else {
                    console.log(
                        "index.js /reset/start, else in getHashByEmail, mail-address not in database"
                    );
                    res.json({
                        success: false,
                        falseEmail: true,
                    });
                }
            })
            .catch((err) => {
                console.log(
                    "CATCH in index.js /reset/start getHashByEmail, mail-address not in database"
                );
                res.json({ success: false, falseEmail: true });
            });
    } else {
        res.json({ success: false, error: true });
        console.log("index.js /reset/start, no email-address in input-field.");
    }
});

app.post("/password/reset/verify", (req, res) => {
    console.log("index.js, post /reset/verify");
    let { email, code, password } = req.body;
    console.log(
        "index.js post /reset/verify, inserted data:",
        email,
        code,
        password
    );

    if (code && password) {
        db.getSecretCode(email)
            .then((databaseCode) => {
                console.log(
                    "result getSecretCode in index.js post reset/verify:",
                    databaseCode
                );

                if (code == databaseCode) {
                    hash(password)
                        .then((hashedPw) => {
                            console.log(
                                "password hashed in index.js post reset/verify getSecretCode:",
                                hashedPw
                            );
                            db.updatePassword(email, hashedPw)
                                .then(() => {
                                    // req.session.userId = resultId;
                                    res.json({ success: true });
                                    console.log(
                                        "index.js /reset/verify updatePassword, comparing codes successful, new password in db, now step 3"
                                    );
                                })
                                .catch((err) => {
                                    console.log(
                                        "CATCH in index.js /reset/verify updatePassword, comparing codes successful, but update didn't work"
                                    );
                                    res.json({ success: false, error: true });
                                });
                        })
                        .catch((err) => {
                            console.log(
                                "CATCH in index.js /reset/verify hash(password)",
                                err
                            );
                        });
                } else {
                    console.log(
                        "index.js /reset/verify, else in comparing codes NOT successful"
                    );
                    res.json({
                        success: false,
                        falseCode: true,
                    });
                }
            })
            .catch((err) => {
                console.log(
                    "CATCH in index.js /reset/verify getSecretCode:",
                    err
                );
                res.json({ success: false, error: true });
            });
    } else {
        res.json({ success: false, error: true });
        console.log(
            "index.js /reset/verify, input-fields not filled out properly."
        );
    }
});

//////////////////////// LOGOUT ////////////////////////
app.get("/logout", (req, res) => {
    req.session = null;
    console.log("index.js logout, redirect to /login");
    res.redirect("/welcome#/login");
});

//////////////////////// WELCOME ////////////////////////

app.get("*", function (req, res) {
    console.log("index.js, get *");
    if (!req.session.userId) {
        res.redirect("/welcome");
        console.log("index.js get *, no cookie, redirect to /welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
        console.log("index.js get *, has cookie, sendFile to /index.html");
    }
});

app.listen(8080, function () {
    console.log("index.js port 8080 is listening.");
});
