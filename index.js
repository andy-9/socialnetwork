const express = require("express");
const app = express();
const compression = require("compression");
const cookieSession = require("cookie-session");
const { addEntry } = require("./db.js"); // necessary?
const db = require("./db");
const { hash, compare } = require("./bc");
// const helmet = require("helmet");

//////////////////////// MIDDLEWARE ////////////////////////
app.use(compression());
// app.use(helmet());
app.use(express.json());
app.use(express.static("./public"));

app.use(
    cookieSession({
        secret: `Mein Kite ist wichtiger als D.`,
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);

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

// does this make sense?:
app.use(function (err, req, res, next) {
    console.error("ERROR in middleware, index.js:", err.stack);
    res.status(500).send("Something broke, status code 500!");
});

//////////////////////// WELCOME ROUTE ////////////////////////

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

//////////////////////// REGISTER ROUTE ////////////////////////

app.post("/register", (req, res) => {
    let { first, last, email, password } = req.body;
    console.log(
        "index.js POST /register, all inserted data:",
        first,
        last,
        email,
        password
    );

    if (first === "" || last === "" || email === "" || password < 8) {
        res.json({ success: false });
        console.log("4 input fields on /register not complete");
    } else {
        // if (first != "" && last != "" && email != "" && password != "") {
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
    }
    // else {
    //     res.json({ success: false });
    //     console.log("4 input fields on /register not complete");
    // }
});

//////////////////////// START/LOGIN ROUTE ////////////////////////

app.get("*", function (req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
        console.log("index.js GET *, no cookie, redirect to /welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
        console.log("index.js GET *, has cookie, sendFile to /index.html");
    }
});

// does this make sense?:
app.use(function (req, res, next) {
    res.status(404).send("sorry, can't find that, 404");
});

app.listen(8080, function () {
    console.log("index.js port 8080 is listening.");
});
