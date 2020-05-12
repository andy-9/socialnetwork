import React, { useState, useEffect } from "react";
import axios from "./axios";

export default function FriendShipButton({ otherUserId }) {
    console.log("otherUserId:", otherUserId);
    const [buttonText, setButtonText] = useState("Make Friend Request");

    useEffect(() => {
        console.log("I am FriendButton Component mounting");
        axios.get(`/friendshipstatus/${otherUserId}`).then((resp) => {
            console.log(("resp:", resp));
            setButtonText(resp.data.buttonText);
        });
    }, []);

    function submit() {
        console.log(
            "I click on the button! and the button text is",
            buttonText
        );
    }

    return (
        <div>
            <button onClick={submit}>{buttonText}</button>
        </div>
    );
}
