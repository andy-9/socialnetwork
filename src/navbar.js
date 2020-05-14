import React from "React";
import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <div className="navbar-container">
            <p>
                <ion-icon className="icon" name="search-sharp"></ion-icon>
                <Link to="/users">Find People</Link>
            </p>

            <p>
                <ion-icon className="icon" name="heart-sharp"></ion-icon>
                {/* <ion-icon
                    className="icon"
                    name="people-circle-sharp"
                ></ion-icon> */}
                <Link to="/friends">Friends</Link>
            </p>

            <p>
                <ion-icon className="icon" name="person-sharp"></ion-icon>
                <Link to="/">My Profile</Link>
            </p>

            <p>
                <ion-icon className="icon" name="log-out-sharp"></ion-icon>
                {<a href="/logout">Logout</a>}
            </p>
        </div>
    );
}

// Chat
// Online
