const express = require("express");
const app = express();
const compression = require("compression");
const cookieSession = require("cookie-session");
const csurf = require("csurf");
const db = require("./db");
const { hash, compare } = require("./bc");
const cryptoRandomString = require("crypto-random-string");
const ses = require("./ses");
const s3 = require("./s3");
const config = require("./config");
// const helmet = require("helmet");

////////////////// IMAGE UPLOAD BOILERPLATE //////////////////

const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

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

//////////////////////// APP /USER ////////////////////////
app.get("/user", (req, res) => {
    // console.log("index.js, get /user, req.session", req.session);

    db.getUserInfo(req.session.userId)
        .then((result) => {
            // console.log(
            //     "result getUserInfo in index.js in post /user:",
            //     result
            // );
            res.json(result);
        })
        .catch((err) => {
            console.log("CATCH in index.js in get /user:", err);
        });
});

//////////////////////// UPLOADER ////////////////////////
app.post("/imgupload", uploader.single("file"), s3.upload, (req, res) => {
    // console.log("index.js post /imgupload, uploaded (req.)file:", req.file);
    filename = req.file.filename;
    // console.log("index.js post /imgupload, config.s3Url", config.s3Url);
    let img_url = config.s3Url + filename;
    // console.log("index.js post /imgupload, complete new url:", img_url);

    if (req.file) {
        db.addUserPic(req.session.userId, img_url)
            .then(({ rows }) => {
                console.log(
                    "index.js post /imgupload, addUserPic response from db:",
                    rows[0]
                );
                const userImg = rows[0];
                res.json({
                    userImg,
                });
            })
            .catch((err) => {
                console.log("CATCH in post /imgupload to database", err);
                res.json({ success: false });
            });
    } else {
        res.json({
            success: false,
        });
    }
});

//////////////////////// BIO ////////////////////////
app.post("/bio", (req, res) => {
    // console.log("index.js, post /bio");
    // console.log("req.body:", req.body);

    db.addUserBio(req.session.userId, req.body.bio)
        .then(({ rows }) => {
            console.log(
                "index.js post /bio, addUserBio response from db:",
                rows[0]
            );
            const userBio = rows[0];
            res.json({
                userBio,
            });
        })
        .catch((err) => {
            console.log("CATCH in post /bio to database", err);
            res.json({ success: false });
        });
});

//////////////////////// RESET START ////////////////////////

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

//////////////////////// RESET VERIFY ////////////////////////

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

//////////////////////// USER-ID ////////////////////////

// needs to be different to my naming in app.js, add 'api/
app.get("/api/user/:id", (req, res) => {
    console.log("index.js, get /api/user/:id");
    console.log("req.params.id:", req.params.id);
    const id = req.params.id;
    console.log("id:", id);
    console.log("req.session.userId", req.session.userId);

    if (id == req.session.userId) {
        console.log("push to /");
        this.props.history.push("/");
    } else {
        db.getUserInfo(id).then((otherUserInfo) => {
            console.log(
                "result getUserInfo in index.js get /api/user/:id:",
                otherUserInfo
            );
            res.json({ otherUserInfo });
        });
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
    // console.log("index.js, get *");
    if (!req.session.userId) {
        res.redirect("/welcome");
        console.log("index.js get *, no cookie, redirect to /welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
        // console.log("index.js get *, has cookie, sendFile to /index.html");
    }
});

app.listen(8080, function () {
    console.log("index.js port 8080 is listening.");
});
