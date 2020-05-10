import React from "react";

export default function ProfilePic({
    first,
    last,
    img_url = "default.svg",
    toggleModal,
}) {
    // console.log(
    //     "profilePic.js, arguments in ProfilePic():",
    //     fisrst,
    //     last,
    //     img_url,
    //     toggleModal
    // );

    img_url = img_url || "default.svg";

    return (
        <div className="profilepic" onClick={toggleModal}>
            <img src={img_url} alt={`${first} ${last}`} />
        </div>
    );
}
