import React from "react";

export default function ProfilePic({ first, last, img_url, toggleModal }) {
    console.log(
        "profilePic.js, props in ProfilePic():",
        first,
        last,
        img_url,
        toggleModal
    );

    img_url = img_url || "default.svg";

    return (
        <div>
            <div className="profile-pic-frame" onClick={toggleModal}>
                <img
                    className="profile-pic"
                    src={img_url}
                    alt={`${first} ${last}`}
                />
            </div>
        </div>
    );
}
