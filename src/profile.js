import React from "react";
import ProfilePic from "./profilepic";
import BioEditor from "./bioeditor";

export default function Profile({ first, last, img_url, bio, clickHandler }) {
    console.log(
        "profile.js, props in Profile():",
        first,
        last,
        img_url,
        bio,
        clickHandler
    );
    // console.log("profile.js, this.props.first:", this.props.first);
    // console.log("profile.js, props in Profile():", first);
    // console.log("profile.js, props in Profile():", first);

    return (
        <div className="profile">
            <h3>Heading in profile.js</h3>
            <ProfilePic
                first={this.props.first}
                last={this.props.last}
                img_url={this.props.img_url}
                clickHandler={this.props.clickHandler}
            />
            {first} {last}
            <BioEditor bio={bio} />
        </div>
    );
}
