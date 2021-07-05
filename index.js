const express = require("express");
const app = express();
const server = require("http").Server(app);
// const io = require("socket.io").listen(server);
const io = require("socket.io")(server);
const compression = require("compression");
const cookieSession = require("cookie-session");
const csurf = require("csurf");
const cryptoRandomString = require("crypto-random-string");
const config = require("./config");
const db = require("./db");
const { hash, compare } = require("./bc");
const ses = require("./ses");
const s3 = require("./s3");

////////////////// TRUNCATE DATE //////////////////
const truncateDate = (posttime) => {
    return (posttime = new Intl.DateTimeFormat("en-GB", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: false,
        timeZone: "Etc/GMT",
    }).format(posttime));
};

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

    if (first && last && email && password && confirmPassword) {
        if (password.length < 8) {
            res.json({ success: false, passwordTooShort: true });
        }
        if (password != confirmPassword) {
            res.json({ success: false, errorConfirmPassword: true });
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
                    res.json({ success: false, error: true });
                    console.log("CATCH in index.js in post /register:", err);
                });
    } else {
        res.json({ success: false, error: true });
    }
});

//////////////////////// LOGIN ////////////////////////
app.post("/login", (req, res) => {
    let { email, password } = req.body;

    if (email && password) {
        db.getHashByEmail(email)
            .then((result) => {
                if (!result) {
                    res.json({
                        success: false,
                        falseEmail: true,
                    });
                } else {
                    id = result.id;
                    return result.password;
                }
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
                }
            })
            .catch((err) => {
                res.json({
                    success: false,
                    error: true,
                });
                console.log("CATCH in index.js in post /login:", err);
            });
    } else {
        res.json({
            success: false,
            error: true,
        });
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
                res.json({
                    success: false,
                });
                console.log("CATCH in post /imgupload to database", err);
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
            res.json({ success: false });
            console.log("CATCH in post /bio to database", err);
        });
});

//////////////////////// RESET START ////////////////////////
app.post("/password/reset/start", (req, res) => {
    let secretCode;
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
                            res.json({ success: false, error: true });
                            console.log(
                                "CATCH in index.js /reset/start addSecretCode:",
                                err
                            );
                        });
                } else {
                    res.json({
                        success: false,
                        falseEmail: true,
                    });
                }
            })
            .catch((err) => {
                res.json({ success: false, falseEmail: true });
                console.log(
                    "CATCH in index.js /reset/start getHashByEmail, mail-address not in database",
                    err
                );
            });
    } else {
        res.json({ success: false, error: true });
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
                                        res.json({
                                            success: false,
                                            error: true,
                                        });
                                        console.log(
                                            "CATCH in index.js /reset/verify updatePassword, comparing codes successful, but update didn't work",
                                            err
                                        );
                                    });
                            })
                            .catch((err) => {
                                console.log(
                                    "CATCH in index.js /reset/verify hash(password)",
                                    err
                                );
                            });
                    } else {
                        res.json({
                            success: false,
                            falseCode: true,
                        });
                    }
                })
                .catch((err) => {
                    res.json({ success: false, error: true });
                    console.log(
                        "CATCH in index.js /reset/verify getSecretCode:",
                        err
                    );
                });
    } else if (!code) {
        res.json({ success: false, falseCode: true });
    } else {
        res.json({ success: false, error: true });
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
            res.json({ isLoggedInUser: true });
            console.log("CATCH in index.js /api/user/:id getUserInfo", err);
        });
});

app.get("/api/friends-of-friends/:id", (req, res) => {
    const receiver_id = req.params.id;
    const sender_id = req.session.userId;

    db.areUsersFriends(receiver_id, sender_id)
        .then((result) => {
            db.getFriendsInfo(receiver_id, sender_id)
                .then((result) => {
                    res.json(result);
                })
                .catch((err) => {
                    console.log(
                        "CATCH in index.js /api/friends-of-friends/:id getFriendsInfo:",
                        err
                    );
                });
        })
        .catch((err) => {
            console.log(
                "CATCH in index.js /api/friends-of-friends/:id areUsersFriends:",
                err
            );
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
server.listen(process.env.PORT || 8080, function () {
    console.log("index.js port 8080 is listening.");
});

io.on("connection", (socket) => {
    const userId = socket.request.session.userId;

    if (!userId) {
        return socket.disconnect(true);
    }

    db.getLastTenMessages().then((data) => {
        for (let i = 0; i < data.length; i++) {
            data[i].created_at = truncateDate(data[i].created_at);
        }
        io.sockets.emit("lastTenChatMessages", data.reverse());
    });

    socket.on("chat message from user", (newMsg) => {
        db.insertChatMessage(newMsg, userId).then((data) => {
            for (let i = 0; i < data.length; i++) {
                data[i].created_at = truncateDate(data[i].created_at);
            }
            io.sockets.emit("addChatMsg", data.reverse());
        });
    });
});
