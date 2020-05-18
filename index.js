const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "localhost:8080" });
// when deploying: const io = require("socket.io")(server, { origins: "localhost:8080" mysocialnetwork.herokuapp.com:* });
const compression = require("compression");
const cookieSession = require("cookie-session");
const csurf = require("csurf");
const cryptoRandomString = require("crypto-random-string");
const config = require("./config");
const db = require("./db");
const { hash, compare } = require("./bc");
const ses = require("./ses");
const s3 = require("./s3");

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

// app.use(
//     cookieSession({
//         secret: `Mein Kite ist wichtiger als D.`,
//         maxAge: 1000 * 60 * 60 * 24 * 14,
//     })
// );

const cookieSessionMiddleware = cookieSession({
    secret: `Mein Kite ist wichtiger als D.`,
    maxAge: 1000 * 60 * 60 * 24 * 14,
});

app.use(cookieSessionMiddleware);
io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(csurf());

app.use(function (req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

//////////////////////// WELCOME ////////////////////////

app.get("/welcome", (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

//////////////////////// REGISTER ////////////////////////

app.post("/register", (req, res) => {
    let { first, last, email, password, confirmPassword } = req.body;

    if (password.length < 8) {
        res.json({ success: false, passwordTooShort: true });
    } else if (first && last && email && password && confirmPassword) {
        if (password != confirmPassword) {
            res.json({ success: false, errorConfirmPassword: true });
            console.log("index.js, second password does not match first");
        } else
            hash(password)
                .then((hashedPw) => {
                    return db.registerUser(first, last, email, hashedPw);
                })
                .then((resultId) => {
                    req.session.userId = resultId;
                    res.json({ success: true });
                })
                .catch((err) => {
                    console.log("CATCH in index.js in post /register:", err);
                    res.json({ success: false, error: true });
                });
    } else {
        res.json({ success: false, error: true });
        console.log("5 input fields on /register not complete");
    }
});

//////////////////////// LOGIN ////////////////////////

app.post("/login", (req, res) => {
    let { email, password } = req.body;

    if (email && password) {
        db.getHashByEmail(email)
            .then((result) => {
                id = result.id;
                return result.password;
            })
            .then((hashedPw) => {
                return compare(password, hashedPw);
            })
            .then((matchValue) => {
                if (matchValue) {
                    req.session.userId = id;
                    res.json({
                        success: true,
                    });
                } else {
                    res.json({
                        success: false,
                        falsePassword: true,
                    });
                    console.log(
                        "index.js, 2 input fields on /login do not match"
                    );
                }
            })
            .catch((err) => {
                console.log("CATCH in index.js in post /login:", err);
                res.json({
                    success: false,
                    error: true,
                });
            });
    } else {
        res.json({
            success: false,
            error: true,
        });
        console.log(
            "2 input fields on /login not complete or falsy, rerender /login with error message"
        );
    }
});

//////////////////////// APP /USER ////////////////////////
app.get("/user", (req, res) => {
    db.getUserInfo(req.session.userId)
        .then((result) => {
            res.json(result);
        })
        .catch((err) => {
            console.log("CATCH in index.js in get /user:", err);
        });
});

//////////////////////// UPLOADER ////////////////////////
app.post("/imgupload", uploader.single("file"), s3.upload, (req, res) => {
    let filename = req.file.filename;
    let img_url = config.s3Url + filename;

    if (req.file) {
        db.addUserPic(req.session.userId, img_url)
            .then(({ rows }) => {
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
    db.addUserBio(req.session.userId, req.body.bio)
        .then(({ rows }) => {
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
    let secretCode; // const possible?
    let { email } = req.body;

    if (email) {
        db.getHashByEmail(email)
            .then((result) => {
                if (result) {
                    secretCode = cryptoRandomString({
                        length: 6,
                    });

                    db.addSecretCode(email, secretCode)
                        .then(() => {
                            console.log(
                                "index.js, addSecretCode, email & secretCode after .then:",
                                email,
                                secretCode
                            );
                            ses.sendEmail(
                                email,
                                "Your reset code",
                                `Your reset code is ${secretCode}. It is valid for 10 minutes.`
                            );
                        })
                        .then(() => {
                            res.json({ success: true });
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
                    "CATCH in index.js /reset/start getHashByEmail, mail-address not in database",
                    err
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
    let { email, code, password, confirmPassword } = req.body;

    if (password.length < 8) {
        res.json({ success: false, passwordTooShort: true });
    } else if (code && password && confirmPassword) {
        if (password != confirmPassword) {
            res.json({ success: false, errorConfirmPassword: true });
            console.log("index.js, second password does not match first");
        } else
            db.getSecretCode(email)
                .then((databaseCode) => {
                    if (code == databaseCode) {
                        hash(password)
                            .then((hashedPw) => {
                                db.updatePassword(email, hashedPw)
                                    .then(() => {
                                        res.json({ success: true });
                                    })
                                    .catch((err) => {
                                        console.log(
                                            "CATCH in index.js /reset/verify updatePassword, comparing codes successful, but update didn't work",
                                            err
                                        );
                                        res.json({
                                            success: false,
                                            error: true,
                                        });
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
    } else if (!code) {
        res.json({ success: false, falseCode: true });
        console.log("index.js /reset/verify, falseCode");
    } else {
        res.json({ success: false, error: true });
        console.log(
            "index.js /reset/verify, input-fields not filled out properly."
        );
    }
});

//////////////////////// FIND PEOPLE ////////////////////////

app.get("/api/users", (req, res) => {
    db.getRecentUsers(req.session.userId)
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            console.log("CATCH in index.js /api/users getRecentUsers", err);
        });
});

app.get("/search-users/:find", (req, res) => {
    let val = req.params.find;
    let array = [];

    db.getMatchingUsersFirst(val)
        .then((matchResultsFirst) => {
            matchResultsFirst.map((first) => array.push(first));
        })
        .then(() => {
            return db.getMatchingUsersLast(val);
        })
        .then((matchResultsLast) => {
            matchResultsLast.map((last) => array.push(last));
            const arr = array.filter((item) => item.id != req.session.userId);
            res.json(arr);
        })
        .catch((err) => {
            console.log("CATCH in index.js /api/users getMatchingUsers", err);
        });
});

//////////////////////// OTHER PROFILES ////////////////////////

app.get("/api/user/:id", (req, res) => {
    const id = req.params.id;

    db.getUserInfo(id)
        .then((otherUserInfo) => {
            if (otherUserInfo.id == req.session.userId) {
                res.json({ isLoggedInUser: true });
            } else {
                res.json({ otherUserInfo, isLoggedInUser: false });
            }
        })
        .catch((err) => {
            console.log("CATCH in index.js /api/user/:id getUserInfo", err);
            res.json({ isLoggedInUser: true });
        });
});

//////////////////////// FRIENDSHIP-ACTION ////////////////////////

app.get("/friendshipstatus/:otherUserId", (req, res) => {
    const receiver_id = req.params.otherUserId;
    const sender_id = req.session.userId;

    db.areUsersFriends(receiver_id, sender_id)
        .then((result) => {
            if (result == 0) {
                res.json({ buttonText: "Send Friend Request" });
            } else if (result[0].accepted == true) {
                res.json({ buttonText: "End Friendship" });
            } else if (result[0].sender_id == req.session.userId) {
                res.json({ buttonText: "Cancel Friend Request" });
            } else {
                res.json({ buttonText: "Accept Friend Request" });
            }
        })
        .catch((err) => {
            console.log("CATCH in index.js areUsersFriends", err);
        });
});

app.post("/send-friend-request/:otherUserId", (req, res) => {
    const sender_id = req.session.userId;
    const receiver_id = req.params.otherUserId;

    if (req.body.bt == "Send Friend Request") {
        db.friendshipRequest(sender_id, receiver_id)
            .then(() => {
                res.json({ buttonText: "Cancel Friend Request" });
            })
            .catch((err) => {
                console.log("CATCH in index.js friendshipRequest", err);
            });
    } else if (req.body.bt == "Accept Friend Request") {
        db.acceptFriendship(receiver_id, sender_id)
            .then(() => {
                res.json({ buttonText: "End Friendship" });
            })
            .catch((err) => {
                console.log("CATCH in index.js friendshipRequest", err);
            });
    } else {
        db.deleteFriendship(receiver_id, sender_id)
            .then(() => {
                res.json({ buttonText: "Send Friend Request" });
            })
            .catch((err) => {
                console.log("CATCH in index.js deleteFriendship", err);
            });
    }
});

//////////////////////// FRIENDS / STATUS ////////////////////////

app.get("/get-friends-wannabes", (req, res) => {
    db.myFriendsAndWannabes(req.session.userId)
        .then((result) => {
            res.json(result);
        })
        .catch((err) => {
            console.log("CATCH in index.js myFriendsAndWannabes", err);
        });
});

//////////////////////// LOGOUT ////////////////////////
app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/welcome#/login");
});

//////////////////////// WELCOME ////////////////////////

app.get("*", function (req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

//////////////////////// SERVER & SOCKET ////////////////////////

server.listen(8080, function () {
    console.log("index.js port 8080 is listening.");
});

io.on("connection", (socket) => {
    // "connection" is like an event listener
    console.log(`a socket with the id ${socket.id} just connected`);

    // if user is not logged in --> disconnect
    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }

    const userId = socket.request.session.userId;
    // good point to retrieve the last 10 messages
    db.getLastTenMessages(userId).then((data) => {
        console.log("index.js, getLastTenMessages, data:", data);
        // will need to be a join: info from both users table and chat (user's first, last, image, chat message, timestamp)
        // most recent message should be at the bottom
        io.sockets.emit("chatMessages", data);
    });

    socket.on("chat message from user", (newMsg) => {
        console.log("This message is coming from chat.js component:", newMsg);
        console.log("user who sent newMsg is:", userId);
        // 1. store msg in db with query (INSERT)
        // 2. do query to get information about user (first, last, image, timestamp(?)), will be a join
        // once i have information emit message so that everyone can see it

        io.sockets.emit("addChatMsg", newMsg); // I will have to send more: last msg + info about user
    });

    // socket.emit("yo", {
    //     message: "Yo! It is nice to see you",
    // });
    // socket.broadcast.emit("somebodyShowedUp", {
    //     msg: "looks nice",
    // });
    // io.emit("achtung", "this site rocks");

    // socket.on("disconnect", function () {
    //     console.log(`a socket with the id ${socket.id} just disconnected`);
    // });
    // socket.on("thanks", function (data) {
    //     console.log(data);
    // });
    // socket.on("hi", ({ msg }) => {
    //     console.log(msg);
    // });
});
