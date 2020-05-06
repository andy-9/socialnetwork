import React from "react";
import ProfilePic from "./profilepic";
import BioEditor from "./bioeditor";

export default function Profile({ first, last, img_url, bio, toggleModal }) {
    console.log(
        "profile.js, props in Profile():",
        first,
        last,
        img_url,
        bio,
        toggleModal
    );
    // console.log("profile.js, this.props.first:", this.props.first);
    // console.log("profile.js, props in Profile():", first);
    // console.log("profile.js, props in Profile():", first);

    return (
        <div className="profile">
            <h3>Heading in profile.js</h3>
            <ProfilePic
                first={first}
                last={last}
                img_url={img_url}
                toggleModal={toggleModal}
            />
            {first} {last}
            <p>Edit your bio</p>
            <BioEditor bio={bio} />
        </div>
    );
}
