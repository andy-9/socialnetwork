const express = require("express");
const app = express();
const compression = require("compression");
const cookieSession = require("cookie-session");
const csurf = require("csurf");
const { addEntry } = require("./db.js"); // necessary?
const db = require("./db");
const { hash, compare } = require("./bc");
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
    if (req.session.userId) {
        res.redirect("/");
        console.log("index.js GET /welcome, has cookie, redirect to /");
    } else {
        res.sendFile(__dirname + "/index.html");
        console.log(
            "index.js GET /welcome, no cookie, sendFile to /index.html"
        );
    }
});

//////////////////////// REGISTER ////////////////////////

app.post("/register", (req, res) => {
    let { first, last, email, password } = req.body;
    console.log(
        "index.js POST /register, all inserted data:",
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
                console.log("CATCH in index.js in POST /register:", err);
                res.json({ success: false, error: true });
            });
    } else {
        res.json({ success: false, error: true });
        console.log("4 input fields on /register not complete");
    }
});

//////////////////////// LOGIN ////////////////////////

app.post("/login", (req, res) => {
    let { email, password } = req.body;
    console.log("index.js POST /register, all inserted data:", email, password);

    if (email && password) {
        db.getHashByEmail(email)
            .then((result) => {
                console.log("result getHashByEmail in index.js:", result); // logs password & id in object
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
                console.log("CATCH in index.js in POST /login:", err);
                res.json({ success: false, error: true });
            });
    } else {
        res.json({ success: false, error: true });
        console.log(
            "2 input fields on /login not complete or falsy, rerender /login with error message"
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
    if (!req.session.userId) {
        res.redirect("/welcome");
        console.log("index.js GET *, no cookie, redirect to /welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
        console.log("index.js GET *, has cookie, sendFile to /index.html");
    }
});

app.listen(8080, function () {
    console.log("index.js port 8080 is listening.");
});
