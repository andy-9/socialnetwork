import React from "react";

const ProfilePic = ({ first, last, url = "/default.jpg", onClick }) => (
    <img src={url} alt={`${first} ${last}`} onClick={onClick} />
);

export default ProfilePic;
