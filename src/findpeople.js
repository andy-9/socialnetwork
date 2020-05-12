import React, { useState, useEffect } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";
import ProfilePic from "./profilepic";

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
        <div>
            <h2>Find People</h2>
            <input
                onChange={(e) => {
                    setFind(e.target.value);
                    setJustJoined(false);
                }}
                placeholder="Enter Name"
            />
            {justJoined && <h4>Checkout who just joined</h4>}
            {!justJoined && <h4>Search Results</h4>}
            <div>
                {users.map((each) => (
                    <Link to={`/user/${each.id}`} key={each.id}>
                        <ProfilePic
                            first={each.first}
                            last={each.last}
                            imageUrl={each.img_url}
                        />
                        {each.first} {each.last}
                    </Link>
                ))}
                {!users.length && <div>No results found</div>}
            </div>
        </div>
    );
}
