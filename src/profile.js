import React from "react";
import ProfilePic from "./profilepic";
import BioEditor from "./bioeditor";

export default function Profile({
    id,
    first,
    last,
    img_url,
    bio,
    updateBio,
    toggleModal,
}) {
    // console.log(
    //     "profile.js, props in Profile():",
    //     id,
    //     first,
    //     last,
    //     img_url,
    //     bio,
    //     updateBio,
    //     toggleModal
    // );

    return (
        <div className="profile">
            <div className="pic-for-profile">
                <ProfilePic
                    first={first}
                    last={last}
                    img_url={img_url}
                    toggleModal={toggleModal}
                />
            </div>
            <div className="text-for-profile">
                <h3 className="profile-fullname">
                    {first} {last}
                </h3>
                <BioEditor
                    className="bio-text"
                    id={id}
                    bio={bio}
                    updateBio={updateBio}
                />
            </div>
        </div>
    );
}
