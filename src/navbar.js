import React from "React";
import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <div className="navbar-container">
            <p>{<a href="/logout">Logout</a>}</p>
            <p>
                <Link to="/users">Find People</Link>
            </p>
        </div>
    );
}

// My Profile
// Chat
// Online
// Friends
// (Search icon) <ion-icon name="search-sharp"></ion-icon>
