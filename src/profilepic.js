import React from "react";

export default function ProfilePic({
    first,
    last,
    img_url = "/default.svg",
    toggleModal,
}) {
    img_url = img_url || "/default.svg";

    return (
        <div onClick={toggleModal}>
            <img src={img_url} alt={`${first} ${last}`} />
        </div>
    );
}
