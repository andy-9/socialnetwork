import React from "react";
import ProfilePic from "./profilepic";
import BioEditor from "./bioeditor";

export default function Profile({ first, last, img_url, bio }) {
    console.log("profile.js, props in Profile():", first, last, img_url, bio);

    return (
        <div className="profile">
            <h3>Heading in profile.js</h3>
            {ProfilePic}
            {first} {last}
            <BioEditor bio={bio} />
        </div>
    );
}
