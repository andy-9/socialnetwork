import React, { useState, useEffect } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default function FindPeople() {
    const [users, setUsers] = useState([]);
    const [find, setFind] = useState("");
    const [justJoined, setJustJoined] = useState(true);

    useEffect(() => {
        // console.log("findpeople.js, useEffect runs");
        // console.log("findpeople.js, find:", find);
        // console.log("findpeople.js, find 2:", `/search-users/${find}`);

        let abort;

        (async () => {
            if (!find) {
                const { data } = await axios.get("/api/users");
                // console.log("findpeople.js, data from /api/users:", data);
                if (!abort) {
                    setUsers(data);
                }
                setJustJoined(true);
            } else {
                const { data } = await axios.get(`/search-users/${find}`);
                // console.log(
                //     "findpeople.js, data from /search-users/:find:",
                //     data
                // );
                if (!abort) {
                    setUsers(data);
                }
            }
        })();

        return () => {
            abort = true;
        };
    }, [find]);

    return (
        <div className="people-container">
            <h2>Connect with your peers</h2>
            <div id="find-people">
                <div id="searchbar">
                    <input
                        className="input-findpeople"
                        onChange={(e) => {
                            setFind(e.target.value);
                            setJustJoined(false);
                        }}
                        placeholder="Enter First or Last Name"
                    />
                    {justJoined && <h3>Checkout who just joined:</h3>}
                    {!justJoined && <h3>Search Results</h3>}
                </div>

                <div className="peers">
                    {users.map((each) => (
                        <Link
                            className="one-percent-right one-percent-bottom"
                            to={`/user/${each.id}`}
                            key={each.id}
                        >
                            <div className="pic-peers">
                                <img
                                    className="img-frame"
                                    src={each.img_url || "/default.svg"}
                                    alt={`${each.first} ${each.last}`}
                                />
                            </div>
                            <div className="center">
                                {each.first} {each.last}
                            </div>
                        </Link>
                    ))}
                    {!users.length && <p>No results found</p>}
                </div>
            </div>
        </div>
    );
}
