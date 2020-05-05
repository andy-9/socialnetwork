import React from "react";

// pass props as an argument to get access to the info being passed down from the parent (App)
export default function ProfilePic({ first, last, imageUrl }) {
    // console.log("profilepic.js, props in ProfilePic():", props);
    imageUrl = imageUrl || "default.svg";
    let fullName = `${first} ${last}`;

    return (
        <div>
            <h2>
                I'm the profilepic component and my name is {first} and my last
                name is {last}.
            </h2>
            <div className="profile-pic-frame">
                <img className="profile-pic" src={imageUrl} alt={fullName} />
            </div>
        </div>
    );
}
