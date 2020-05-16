import React from "react";
import { Link } from "react-router-dom";
import Logo from "./logo";
import Navbar from "./navbar";
import ProfilePic from "./profilepic";

export default function Presentational({ first, last, img_url, toggleModal }) {
    return (
        <div className="flex">
            <div className="logo-top-left">
                <Logo />
            </div>
            <h1>Kite.Inc</h1>
            <Navbar />
            <Link to="/">
                <div className="profile-pic-frame">
                    <ProfilePic
                        className="profile-pic"
                        first={first}
                        last={last}
                        img_url={img_url}
                    />
                </div>
            </Link>
        </div>
    );
}
