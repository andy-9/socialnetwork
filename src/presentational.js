import React from "react";
import Logo from "./logo";
import Navbar from "./navbar";
import ProfilePic from "./profilepic";

export default function Presentational({ first, last, img_url, toggleModal }) {
    // console.log(
    //     "presentational.js, arguments in Presentational():",
    //     first,
    //     last,
    //     img_url,
    //     toggleModal
    // );

    return (
        <div className="header">
            <Logo />

            <h1>Kite.Inc</h1>

            <Navbar />

            <div className="profile-pic-frame">
                <ProfilePic
                    className="profile-pic"
                    first={first}
                    last={last}
                    img_url={img_url}
                    toggleModal={toggleModal}
                />
            </div>
        </div>
    );
}
