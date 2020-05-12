import React, { useState, useEffect } from "react";
import axios from "./axios";

export default function FriendShipButton({ otherUserId, first, last }) {
    console.log("friend-button.js, otherUserId:", otherUserId);
    const [buttonText, setButtonText] = useState("");

    useEffect(() => {
        console.log("friend-button.js, I am FriendButton Component mounting 1");
        axios.get(`/friendshipstatus/${otherUserId}`).then((resp) => {
            console.log(
                "friend-button.js, response from axios-request:",
                resp.data.buttonText
            );
            setButtonText(resp.data.buttonText);
        });
    }, []);

    function submit() {
        console.log("friend-button.js, buttonText in submit():", buttonText);
        console.log("friend-button.js, otherUserId:", otherUserId);

        axios
            .post(`/send-friend-request/${otherUserId}`, { bt: buttonText })
            .then((resp) => {
                console.log(
                    "friend-button.js, response from axios-request:",
                    resp.data.buttonText
                );
                setButtonText(resp.data.buttonText);
            });
    }

    return (
        <div>
            {buttonText == "Send Friend Request" && (
                <p>
                    Send {first} {last} a friend request.
                </p>
            )}
            {buttonText == "Cancel Friendship" && (
                <p>
                    You are friends with {first} {last}.
                </p>
            )}
            {buttonText == "Cancel Friend Request" && (
                <p>
                    You sent {first} {last} a friend request. They haven't
                    accepted yet. If you changed your mind, you can cancel your
                    request here:
                </p>
            )}
            {buttonText == "Accept Friend Request" && (
                <p>
                    {first} {last} sent you a friend request. Click here to
                    become friends:
                </p>
            )}
            <button onClick={submit}>{buttonText}</button>
        </div>
    );
}
