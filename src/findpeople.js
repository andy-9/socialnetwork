import React, { useState, useEffect } from "react";
import axios from "./axios";

export default function FindPeople() {
    const [user, setUser] = useState("");
    const [users, setUsers] = useState([]);

    useEffect(() => {
        console.log("findpeople.js, useEffect runs");

        axios.get("/users").then(({ data }) => {
            console.log("findpeople.js, data from /users:", data);
            setUsers(data);
        }),
            [];

        return () => {
            console.log(
                `findpeople.js, about to replace ${user} with a new value`
            );
        };
    }, [user]);

    return (
        <div>
            <h3>Find People</h3>
            <h4>Checkout who just joined</h4>

            <div>
                {users.map((user) => (
                    <div key={user.id}>
                        <ProfilePic
                            first={user.first}
                            last={user.last}
                            imageUrl={user.img_url}
                        />
                    </div>
                    // <p>
                    //     {user.first} {user.last}
                    // </p>
                ))}
            </div>

            <input
                onChange={(e) => setUser(e.target.value)}
                placeholder="Enter Name"
            />
        </div>
    );
}
