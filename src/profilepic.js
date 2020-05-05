import React from "react";

// pass props as an argument to get access to the info being passed down from the parent (App)
export default function ProfilePic({ first, last, imgUrl }) {
    console.log("profilepic.js, props in ProfilePic():", first, last, imgUrl);

    imgUrl = imgUrl || "default.svg";

    return (
        <div>
            <div className="profile-pic-frame">
                <img
                    className="profile-pic"
                    src={imgUrl}
                    alt={`${first} ${last}`}
                />
            </div>
        </div>
    );
}
