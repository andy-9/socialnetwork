import React from "react";

export default function ProfilePic({ first, last, img_url, toggleModal }) {
    // console.log(
    //     "profilePic.js, arguments in ProfilePic():",
    //     first,
    //     last,
    //     img_url,
    //     toggleModal
    // );

    let url = img_url || "default.svg";

    return (
        <div>
            <div onClick={toggleModal}>
                <img src={url} alt={`${first} ${last}`} />
            </div>
        </div>
    );
}
