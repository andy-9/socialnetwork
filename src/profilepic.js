import React from "react";

export default function ProfilePic({ first, last, img_url, toggleModal }) {
    console.log(
        "profilePic.js, props in ProfilePic():",
        first,
        last,
        img_url,
        toggleModal
    );

    let url = img_url || "default.svg";

    return (
        <div>
            <div className="profile-pic-frame" onClick={toggleModal}>
                <img
                    className="profile-pic"
                    src={url}
                    alt={`${first} ${last}`}
                />
            </div>
        </div>
    );
}
