import React, { useState, useEffect } from "react";
import axios from "./axios";

export default function FriendShipButton({ otherUserId, first, last }) {
    const [buttonText, setButtonText] = useState("");

    useEffect(() => {
        axios.get(`/friendshipstatus/${otherUserId}`).then((resp) => {
            setButtonText(resp.data.buttonText);
        });
    }, []);

    function submit() {
        axios
            .post(`/send-friend-request/${otherUserId}`, { bt: buttonText })
            .then((resp) => {
                setButtonText(resp.data.buttonText);
            });
    }

    return (
        <div className="people-container">
            {buttonText == "Send Friend Request" && (
                <p>
                    Send {first} {last} a friend request.
                </p>
            )}
            {buttonText == "End Friendship" && (
                <p>
                    You are friends with {first} {last}.
                </p>
            )}
            {buttonText == "Cancel Friend Request" && (
                <p>
                    You sent {first} {last} a friend request. They haven&apos;t
                    accepted yet. If you changed your mind, you can cancel your
                    request.
                </p>
            )}
            {buttonText == "Accept Friend Request" && (
                <p>
                    {first} {last} sent you a friend request. Click the button
                    to become friends.
                </p>
            )}
            <button className="friend-button" onClick={submit}>
                {buttonText}
            </button>
        </div>
    );
}
